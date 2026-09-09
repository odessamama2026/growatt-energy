import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {validateLead, signEnvelope} from '../src/lib/crm/protocol.mjs';
import {handleLead} from '../src/lib/crm/handler.server.mjs';
const valid={requestId:'b7e637ab-a028-4181-952d-40f081c620ba',phone:'067 123 45 67',name:'Тест',source:'hero',kit:'kit5',consent:true,website:''};
const env={SITE_URL:'https://example.test',CRM_SHARED_SECRET:'test-secret-only-'.repeat(3),GOOGLE_CRM_WEBAPP_URL:'https://script.google.com/macros/s/test/exec'};
function request(data=valid,origin=env.SITE_URL){return new Request('https://example.test/api/leads',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(data)});}
test('normalises phone, limits text and discards arbitrary payload fields',()=>{const r=validateLead({...valid,admin:true,comment:'x'.repeat(3000)});assert.equal(r.phone,'+380671234567');assert.equal(r.comment.length,2000);assert.equal(r.admin,undefined);});
test('rejects invalid phone, missing consent and honeypot',()=>{for(const patch of [{phone:'123'},{consent:false},{website:'spam'}])assert.throws(()=>validateLead({...valid,...patch}));});
test('calculator selection retained but claimed client runtime discarded',()=>{const r=validateLead({...valid,calculator:{appliances:['light','light','unknown'],hours:999}});assert.deepEqual(r.calculator.appliances,['light']);assert.equal(r.calculator.hours,undefined);});
test('origin mismatch and unconfigured backend fail without network',async()=>{const no=()=>{throw Error('Network must not be called');};assert.equal((await handleLead(request(valid,'https://evil.test'),env,no)).status,403);assert.equal((await handleLead(request(),{SITE_URL:env.SITE_URL},no)).status,503);});
test('oversized bodies rejected',async()=>assert.equal((await handleLead(request({...valid,comment:'x'.repeat(14000)}),env)).status,413));
test('save success requires upstream acknowledgement',async()=>{const ok=await handleLead(request(),env,async()=>Response.json({ok:true,id:'GE-test-12345'}));assert.deepEqual(await ok.json(),{ok:true,id:'GE-test-12345'});const fail=await handleLead(request(),env,async()=>Response.json({ok:false,code:'SAVE_FAILED'}));assert.equal(fail.status,502);assert.equal((await fail.json()).ok,false);});
test('rate limit and network timeout surfaced without leaking secrets',async()=>{assert.equal((await handleLead(request(),env,async()=>Response.json({ok:false,code:'RATE_LIMIT'}))).status,429);const r=await handleLead(request(),env,async()=>{throw Error(env.CRM_SHARED_SECRET);});assert.equal(r.status,502);assert.ok(!(await r.text()).includes(env.CRM_SHARED_SECRET));});
function gasRuntime() {
  const state={properties:new Map([['CRM_SHARED_SECRET',env.CRM_SHARED_SECRET],['SPREADSHEET_ID','test']]),cache:new Map(),tables:new Map(),networkFail:false,calls:0,emails:0,emailFail:false};
  const names={'Заявки':23,'История':4,'Уведомления':7};
  for(const [name,n]of Object.entries(names))state.tables.set(name,[Array(n).fill('header')]);
  function sheet(name){const data=state.tables.get(name);return {getLastRow:()=>data.length,getLastColumn:()=>names[name],appendRow:r=>data.push(r),getRange:(row,col,n=1,m=1)=>({getValues:()=>data.slice(row-1,row-1+n).map(r=>r.slice(col-1,col-1+m)),setValues:values=>values.forEach((r,i)=>r.forEach((v,j)=>data[row-1+i][col-1+j]=v))})};}
  const context={console:{error:()=>{}},Date,JSON,Set,Error,Number,String,Math,RegExp,
    PropertiesService:{getScriptProperties:()=>({getProperty:k=>state.properties.get(k)||null,setProperty:(k,v)=>state.properties.set(k,v)})},
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
    CacheService:{getScriptCache:()=>({get:k=>state.cache.get(k),put:(k,v)=>state.cache.set(k,v)})},
    Utilities:{computeHmacSha256Signature:(s,k)=>[...createHmac('sha256',k).update(s).digest()],formatDate:()=> '2026-09-07',getUuid:()=> 'uuid-test-123456'},
    SpreadsheetApp:{openById:()=>({getSheetByName:sheet,getUrl:()=> 'https://docs.google.com/spreadsheets/d/test'}),flush(){}},
    ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},
    GmailApp:{sendEmail:()=>{if(state.emailFail)throw Error('email failure');state.emails++;}},
    UrlFetchApp:{fetch:()=>{state.calls++;if(state.networkFail)throw Error('secret-bearing-URL');return{getContentText:()=>JSON.stringify({ok:true,result:{message_id:123}}),getResponseCode:()=>200};}}
  };
  vm.createContext(context);vm.runInContext(readFileSync(new URL('../google-apps-script/Code.gs',import.meta.url),'utf8'),context);
  return {context,state};
}
function sendGas(context,patch={}){const lead={...validateLead(valid),rateKey:'a'.repeat(64),...patch};return JSON.parse(context.doPost({postData:{contents:JSON.stringify(signEnvelope(lead,env.CRM_SHARED_SECRET))}}).text);}
test('GAS verifies Node signatures and rejects tampering and expired envelopes',()=>{const {context}=gasRuntime();const envelope=signEnvelope(valid,env.CRM_SHARED_SECRET);assert.ok(context.verify_(envelope,env.CRM_SHARED_SECRET,Date.now()));assert.equal(context.verify_({...envelope,payload:'{}'},env.CRM_SHARED_SECRET,Date.now()),false);assert.equal(context.verify_(signEnvelope(valid,env.CRM_SHARED_SECRET,Date.now()-400000),env.CRM_SHARED_SECRET,Date.now()),false);});
test('GAS saves once and repairs outbox after interrupted write',()=>{const {context,state}=gasRuntime();const first=sendGas(context);assert.ok(first.ok);state.tables.get('Уведомления').splice(1);assert.equal(sendGas(context).id,first.id);assert.equal(state.tables.get('Заявки').length,2);assert.equal(state.tables.get('Уведомления').length,3);});
test('formula injection escaped in text cells',()=>{const {context,state}=gasRuntime();sendGas(context,{name:' =IMPORTXML("https://evil.test")'});assert.ok(state.tables.get('Заявки')[1][2].startsWith("'"));assert.ok(state.tables.get('Заявки')[1][3].startsWith("'+380"));});
test('GAS rate limits new submissions but still accepts idempotent retries',()=>{const {context}=gasRuntime();assert.ok(sendGas(context).ok);for(let i=0;i<4;i++)assert.ok(sendGas(context,{requestId:'request-number-000'+i}).ok);assert.equal(sendGas(context,{requestId:'request-number-9999'}).code,'RATE_LIMIT');assert.ok(sendGas(context).ok);});
test('failed Telegram delivery retains lead and retries without exposing token',()=>{const {context,state}=gasRuntime();sendGas(context);state.properties.set('TELEGRAM_BOT_TOKEN','test-token');state.properties.set('TELEGRAM_CHAT_ID','test-chat');state.networkFail=true;context.deliverNotifications();assert.equal(state.tables.get('Заявки').length,2);assert.equal(state.tables.get('Уведомления')[1][2],'Ожидает');assert.ok(!JSON.stringify(state.tables.get('Уведомления')).includes('secret-bearing'));state.networkFail=false;state.tables.get('Уведомления')[1][4]=new Date(0);context.deliverNotifications();assert.equal(state.tables.get('Уведомления')[1][2],'Отправлено');context.deliverNotifications();assert.equal(state.calls,2);});

test('email and Telegram delivery fail and retry independently',()=>{const {context,state}=gasRuntime();sendGas(context);state.properties.set('TELEGRAM_BOT_TOKEN','test');state.properties.set('TELEGRAM_CHAT_ID','test');state.properties.set('NOTIFICATION_EMAIL','owner@example.test');state.emailFail=true;context.deliverNotifications();assert.equal(state.calls,1);assert.equal(state.emails,0);assert.equal(state.tables.get('Уведомления')[1][2],'Отправлено');assert.equal(state.tables.get('Уведомления')[2][2],'Ожидает');state.emailFail=false;state.tables.get('Уведомления')[2][4]=new Date(0);context.deliverNotifications();assert.equal(state.emails,1);assert.equal(state.calls,1);context.deliverNotifications();assert.equal(state.emails,1);});

test('UTF-8 transport preserves main-form Cyrillic fields through GAS and email queue', async () => {
  for (const kit of ['kit5', 'solar', 'consult']) {
    const {context,state}=gasRuntime();
    const input={...valid,name:'Тест — не дзвонити',city:'Одеса',comment:'Потрібен розрахунок ☀️',source:'footer-section',kit};
    const response=await handleLead(request(input),env,async (_url,options)=>{
      // A receiver without an explicit charset may decode the UTF-8 bytes as Latin-1.
      const contentType=new Headers(options.headers).get('content-type') || '';
      const encoding=/charset\s*=\s*utf-8/i.test(contentType)?'utf8':'latin1';
      const contents=Buffer.from(options.body,'utf8').toString(encoding);
      return Response.json(JSON.parse(context.doPost({postData:{contents}}).text));
    });
    assert.equal(response.status,200);
    const result=await response.json();
    assert.equal(result.ok,true);
    const row=state.tables.get('Заявки')[1];
    assert.equal(row[2],input.name);
    assert.equal(row[5],input.city);
    assert.equal(row[6],kit);
    assert.equal(row[7],input.comment);
    assert.equal(row[8],'footer-section');
    assert.equal(state.tables.get('Уведомления')[2][0],'email:lead:'+result.id);
    state.properties.set('NOTIFICATION_EMAIL','owner@example.test');
    context.deliverNotifications();
    assert.equal(state.emails,1);
  }
});

