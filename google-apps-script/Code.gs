/* Growatt CRM. Install as a spreadsheet-bound Apps Script project owned by the CRM account.
 * No secrets in this source. Set Script Properties as described in docs/SETUP-RU.md.
 * Spreadsheet is private. Website receives only the submission ID, never rows.
 */
const CRM = {
  leads: 'Заявки', history: 'История', outbox: 'Уведомления', summary: 'Сводка',
  headers: ['ID','Создано','Имя','Телефон','Email','Город','Запрос','Комментарий','Источник','Статус','Сумма','Следующий контакт','Заметки','Переписка Gmail','Последний контакт','UTM source','UTM medium','UTM campaign','Расчёт','Удобное время','ID запроса','Согласие','Предложение Google Docs'],
  states: ['Новая','Связались','Не дозвонились','Предложение отправлено','Успешно','Отказ'],
  label: 'CRM/Заявки'
};
function props_() { return PropertiesService.getScriptProperties(); }
function book_() { const id=props_().getProperty('SPREADSHEET_ID'); if(!id) throw Error('SETUP_REQUIRED'); return SpreadsheetApp.openById(id); }
function sheet_(name) { const s=book_().getSheetByName(name); if(!s) throw Error('SETUP_REQUIRED'); return s; }
function safe_(value,max) {
  let text=String(value==null?'':value).slice(0,max||2000).replace(/\u0000/g,'');
  // Prevent spreadsheet formula injection, including leading whitespace/control chars.
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text="'"+text;
  return text;
}
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function locked_(fn) { const lock=LockService.getScriptLock();lock.waitLock(10000);try{return fn();}finally{lock.releaseLock();} }
function rows_(sheet) { return sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues():[]; }
function history_(id,event,detail) { sheet_(CRM.history).appendRow([new Date(),safe_(id),safe_(event),safe_(detail,2000)]); }
function initSheet_(ss,name,headers) {
  const sheet=ss.getSheetByName(name)||ss.insertSheet(name);
  if(sheet.getLastRow()===0) sheet.appendRow(headers);
  const actual=sheet.getRange(1,1,1,headers.length).getValues()[0];
  if(JSON.stringify(actual)!==JSON.stringify(headers)) throw Error('HEADER_MISMATCH: '+name);
  sheet.setFrozenRows(1);sheet.getRange(1,1,1,headers.length).setBackground('#eeeeee').setFontColor('#111111').setFontWeight('bold');
  return sheet;
}
function setupCrm() {
  // Re-running setup keeps existing rows and reuses the same spreadsheet.
  const p=props_();
  if(!p.getProperty('SPREADSHEET_ID')) p.setProperty('SPREADSHEET_ID',(SpreadsheetApp.getActiveSpreadsheet()||SpreadsheetApp.create('Growatt — CRM')).getId());
  const ss=book_(); ss.setSpreadsheetTimeZone('Europe/Kyiv');ss.setSpreadsheetLocale('en_US');
  const leads=initSheet_(ss,CRM.leads,CRM.headers);
  initSheet_(ss,CRM.history,['Дата','ID заявки','Событие','Подробности']);
  initSheet_(ss,CRM.outbox,['ID события','ID заявки','Статус','Попытки','Следующая попытка','ID сообщения Telegram','Ошибка']);
  if(!leads.getFilter()) leads.getRange(1,1,leads.getMaxRows(),CRM.headers.length).createFilter();
  leads.getRange(2,10,leads.getMaxRows()-1,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CRM.states,true).setAllowInvalid(false).build());
  leads.getRange(2,11,leads.getMaxRows()-1,1).setNumberFormat('#,##0.00');
  for(const col of [2,12,15]) leads.getRange(2,col,leads.getMaxRows()-1,1).setNumberFormat('dd.mm.yyyy hh:mm');
  leads.setColumnWidths(1,CRM.headers.length,145);leads.setColumnWidth(8,300);leads.setColumnWidth(13,260);
  leads.setConditionalFormatRules([SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($L2<>"",$L2<NOW(),$J2<>"Успешно",$J2<>"Отказ")').setBackground('#ffe0d6').setRanges([leads.getRange(2,1,leads.getMaxRows()-1,CRM.headers.length)]).build()]);
  const summary=ss.getSheetByName(CRM.summary)||ss.insertSheet(CRM.summary);
  summary.getRange('A1:B8').setValues([['Показатель','Значение'],['Всего заявок','=COUNTA(\'Заявки\'!A2:A)'],['Новые','=COUNTIF(\'Заявки\'!J2:J,"Новая")'],['Успешные','=COUNTIF(\'Заявки\'!J2:J,"Успешно")'],['Сумма успешных, UAH','=SUMIF(\'Заявки\'!J2:J,"Успешно",\'Заявки\'!K2:K)'],['Доля успешных','=IFERROR(B4/B2,0)'],['Начало периода',new Date(new Date().getFullYear(),new Date().getMonth(),1)],['Конец периода',new Date()]]);
  summary.getRange('B6').setNumberFormat('0.0%');summary.getRange('B7:B8').setNumberFormat('dd.mm.yyyy');
  summary.getRange('A10').setValue('Заявок за период');summary.getRange('B10').setFormula('=COUNTIFS(\'Заявки\'!B2:B,">="&B7,\'Заявки\'!B2:B,"<"&B8+1)');
  summary.getRange('A12').setFormula('=QUERY(\'Заявки\'!A1:W,"select I,count(A) where A is not null group by I label I \'Источник\',count(A) \'Заявок\'",1)');
  summary.setColumnWidth(1,260);summary.setColumnWidth(2,180);
  GmailApp.getUserLabelByName(CRM.label)||GmailApp.createLabel(CRM.label);
  if(!p.getProperty('GMAIL_SINCE_MS')) p.setProperty('GMAIL_SINCE_MS',String(Date.now()));
  // setup only prepares resources; activate automations explicitly afterwards.
  console.log('CRM prepared: '+ss.getUrl());
  return ss.getUrl();
}
function installTriggers() {
  const p=props_();if(!p.getProperty('TELEGRAM_BOT_TOKEN')||!p.getProperty('TELEGRAM_CHAT_ID')) throw Error('TELEGRAM_NOT_CONFIGURED');
  book_();
  const installed=ScriptApp.getProjectTriggers();
  if(!p.getProperty('NOTIFICATION_EMAIL')) throw Error('EMAIL_NOT_CONFIGURED');
  for(const trigger of installed) if(trigger.getHandlerFunction()==='deliverNotifications') ScriptApp.deleteTrigger(trigger);
  ScriptApp.newTrigger('deliverNotifications').timeBased().everyMinutes(1).create();
  if(!installed.some(t=>t.getHandlerFunction()==='syncGmail')) ScriptApp.newTrigger('syncGmail').timeBased().everyMinutes(5).create();
  if(!installed.some(t=>t.getHandlerFunction()==='recordEdit')) ScriptApp.newTrigger('recordEdit').forSpreadsheet(p.getProperty('SPREADSHEET_ID')).onEdit().create();
}
function verify_(envelope,secret,now) {
  if(!secret||secret.length<32||typeof envelope.payload!=='string'||envelope.payload.length>16000) return false;
  if(!/^\d{13}$/.test(envelope.timestamp)||Math.abs(now-Number(envelope.timestamp))>300000) return false;
  const bytes=Utilities.computeHmacSha256Signature(envelope.timestamp+'.'+envelope.payload,secret);
  const expected=bytes.map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
  const actual=String(envelope.signature||'');if(actual.length!==expected.length) return false;
  let mismatch=0; for(let i=0;i<expected.length;i++) mismatch|=expected.charCodeAt(i)^actual.charCodeAt(i);
  return mismatch===0;
}
function checkLead_(lead) {
  if(!lead||!/^\+380\d{9}$/.test(lead.phone||'')||lead.consent!==true||!/^[a-zA-Z0-9-]{16,80}$/.test(lead.requestId||'')||!['kit5','solar','consult'].includes(lead.kit)) throw Error('INVALID');
  if(!/^[a-f0-9]{64}$/.test(lead.rateKey||'')) throw Error('INVALID');
}
function quota_(key,limit,seconds) {
  const cache=CacheService.getScriptCache();const count=Number(cache.get(key)||0);
  if(count>=limit) return false;cache.put(key,String(count+1),seconds);return true;
}
function enqueue_(id,eventId) {
  const s=sheet_(CRM.outbox);
  const events=eventId.startsWith('lead:')?[eventId,'email:'+eventId]:[eventId];
  const existing=new Set(rows_(s).map(r=>r[0]));
  for(const event of events) if(!existing.has(event)) s.appendRow([event,id,'Ожидает',0,new Date(),'','']);
}
function doPost(e) {
  try {
    if(!e||!e.postData||e.postData.contents.length>20000) return json_({ok:false,code:'INVALID'});
    const envelope=JSON.parse(e.postData.contents);
    if(!verify_(envelope,props_().getProperty('CRM_SHARED_SECRET'),Date.now())) return json_({ok:false,code:'UNAUTHORIZED'});
    const lead=JSON.parse(envelope.payload); checkLead_(lead);
    const result=locked_(()=>{
      const sheet=sheet_(CRM.leads);const rows=rows_(sheet);
      const previous=rows.find(r=>r[20]===lead.requestId);
      if(previous) { enqueue_(previous[0],'lead:'+previous[0]); return {ok:true,id:previous[0]}; }
      const day=Utilities.formatDate(new Date(),'UTC','yyyy-MM-dd');
      if(!quota_('ip:'+lead.rateKey,5,600)) return {ok:false,code:'RATE_LIMIT'};
      // A persisted daily cap protects Apps Script quotas; cache-only caps are best effort.
      const p=props_();const counter=JSON.parse(p.getProperty('DAILY_COUNT')||'{}');
      const total=counter.day===day?Number(counter.count)||0:0;
      if(total>=Number(p.getProperty('MAX_DAILY_LEADS')||100)) return {ok:false,code:'RATE_LIMIT'};
      p.setProperty('DAILY_COUNT',JSON.stringify({day,count:total+1}));
      const id='GE-'+Utilities.getUuid();const now=new Date();
      const row=[id,now,lead.name,lead.phone,'',lead.city,lead.kit,lead.comment,lead.source,'Новая','','','', '',now,lead.utm?.utm_source,lead.utm?.utm_medium,lead.utm?.utm_campaign,lead.calculator?JSON.stringify(lead.calculator):'',lead.preferredTime,lead.requestId,lead.consentVersion,''];
      sheet.appendRow(row.map(v=>v instanceof Date?v:safe_(v)));
      SpreadsheetApp.flush();
      enqueue_(id,'lead:'+id);history_(id,'Создана','Форма сайта');
      return {ok:true,id};
    });
    // Delivery is handled by the trigger, independently of the visitor's request.
    return json_(result);
  } catch(error) { console.error('CRM request failed');return json_({ok:false,code:'SAVE_FAILED'}); }
}
function deliverNotifications() {
  // The lock prevents concurrent workers from sending the same pending row.
  return locked_(()=>{
    const p=props_();const token=p.getProperty('TELEGRAM_BOT_TOKEN');const chat=p.getProperty('TELEGRAM_CHAT_ID');
    const email=p.getProperty('NOTIFICATION_EMAIL');
    const box=sheet_(CRM.outbox);const leads=rows_(sheet_(CRM.leads));const pending=rows_(box);let sent=0;
    for(let i=0;i<pending.length&&sent<10;i++) {
      const row=pending[i];if(row[2]==='Отправлено'||row[2]==='Ошибка'||new Date(row[4]).getTime()>Date.now()) continue;
      const lead=leads.find(r=>r[0]===row[1]);if(!lead) continue;
      const attempts=Number(row[3])+1;
      const text=['Заявка Growatt',lead[0],'Имя: '+(lead[2]||'—'),'Телефон: '+(String(lead[3]||'').replace(/^'/,'')||'—'),'Email: '+(lead[4]||'—'),'Город: '+(lead[5]||'—'),'Запрос: '+lead[6],'Комментарий: '+(lead[7]||'—'),'Источник: '+lead[8],'Когда звонить: '+(lead[19]||'—'),book_().getUrl()].join('\n').slice(0,3500);
      try {
        let messageId='';
        if(String(row[0]).startsWith('email:')) {
          if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('EMAIL_NOT_CONFIGURED');
          GmailApp.sendEmail(email,'Новая заявка Growatt — '+String(lead[0]),text);
          messageId='email';
        } else {
        if(!token||!chat) throw Error('TELEGRAM_NOT_CONFIGURED');
        const response=UrlFetchApp.fetch('https://api.telegram.org/bot'+token+'/sendMessage',{method:'post',contentType:'application/json',payload:JSON.stringify({chat_id:chat,text,disable_web_page_preview:true}),muteHttpExceptions:true});
        const data=JSON.parse(response.getContentText());if(!data.ok) throw Error('TELEGRAM_'+response.getResponseCode());
        messageId=String(data.result.message_id);
        }
        box.getRange(i+2,3,1,5).setValues([['Отправлено',attempts,'',messageId,'']]);
      } catch(error) {
        // Never persist the raw exception: network errors can include a token-bearing URL.
        box.getRange(i+2,3,1,5).setValues([[attempts>=6?'Ошибка':'Ожидает',attempts,new Date(Date.now()+Math.min(3600000,60000*Math.pow(2,attempts))),'','Не подтверждена доставка']]);
      }
      sent++;
    }
  });
}
function syncGmail() {
  return locked_(()=>{
    const p=props_();const since=Number(p.getProperty('GMAIL_SINCE_MS')||Date.now());
    const offset=Number(p.getProperty('GMAIL_OFFSET')||0);
    const threads=GmailApp.search('label:"'+CRM.label+'" -in:spam -in:trash after:'+Math.floor(since/1000),offset,20);
    const leadSheet=sheet_(CRM.leads);const history=sheet_(CRM.history);const data=rows_(leadSheet);
    const processed=new Set(rows_(history).filter(r=>r[2]==='GMAIL_MESSAGE').map(r=>String(r[3])));
    const own=[Session.getEffectiveUser().getEmail(),...GmailApp.getAliases()].map(s=>s.toLowerCase());
    for(const thread of threads) {
      const link=thread.getPermalink();let index=data.findIndex(r=>r[13]===link);
      for(const msg of thread.getMessages()) {
        const mid=msg.getId();if(msg.getDate().getTime()<since||processed.has(mid)) continue;
        const sender=(msg.getFrom().match(/<([^>]+)>/)||[])[1]||msg.getFrom();
        if(own.includes(sender.toLowerCase())) continue;
        if(index===-1) {
          // Deterministic ID lets a retry recover after a partially completed import.
          const id='GM-'+thread.getId();index=data.findIndex(r=>r[0]===id);
          if(index===-1) {
            const row=[id,msg.getDate(),msg.getFrom(),' ',sender,'',msg.getSubject(),msg.getPlainBody().slice(0,2000),'gmail','Новая','','','',link,msg.getDate(),'','','','','','gmail:'+thread.getId(),'Входящее обращение',''];
            leadSheet.appendRow(row.map(v=>v instanceof Date?v:safe_(v)));data.push(row);index=data.length-1;
          }
        }
        leadSheet.getRange(index+2,15).setValue(msg.getDate());
        enqueue_(data[index][0],'gmail:'+mid);
        history_(data[index][0],'GMAIL_MESSAGE',mid);processed.add(mid);
      }
    }
    p.setProperty('GMAIL_OFFSET',threads.length===20?String(offset+20):'0');
  });
}
function recordEdit(e) {
  if(!e||e.range.getSheet().getName()!==CRM.leads||e.range.getRow()<2) return;
  locked_(()=>{
    const start=e.range.getRow();const end=Math.min(e.range.getLastRow(),e.range.getSheet().getLastRow());
    for(let row=start;row<=end;row++) {
      const id=e.range.getSheet().getRange(row,1).getValue();if(!id) continue;
      history_(id,'Изменение','Диапазон '+e.range.getA1Notation()+(e.oldValue!==undefined?' | Было: '+safe_(e.oldValue):'')+(e.value!==undefined?' | Стало: '+safe_(e.value):''));
    }
  });
}
function onOpen() { SpreadsheetApp.getUi().createMenu('Growatt CRM').addItem('Создать предложение для выбранной строки','createProposal').addItem('Повторить неудачные уведомления','retryFailedNotifications').addToUi(); }
function retryFailedNotifications() {
  locked_(()=>{const s=sheet_(CRM.outbox);rows_(s).forEach((r,i)=>{if(r[2]==='Ошибка') s.getRange(i+2,3,1,5).setValues([['Ожидает',0,new Date(),'','']]);});});
}
function createProposal() {
  const active=SpreadsheetApp.getActiveSpreadsheet();const selected=active?.getActiveSheet();const row=selected?.getActiveRange()?.getRow();
  if(!selected||selected.getName()!==CRM.leads||!row||row<2) throw Error('Выберите строку заявки');
  const data=selected.getRange(row,1,1,CRM.headers.length).getValues()[0];
  if(!data[0]) throw Error('Пустая строка');
  if(data[22]) { SpreadsheetApp.getUi().alert('Предложение уже создано: '+data[22]);return; }
  const doc=DocumentApp.create('Предложение '+data[0]);const body=doc.getBody();
  body.appendParagraph('Комерційна пропозиція').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Клієнт: '+data[2]);body.appendParagraph('Запит: '+data[6]);body.appendParagraph('Сума: '+(data[10]||'Уточнити')+' UAH');
  body.appendParagraph('Заповніть перед надсиланням: точні моделі, комплектацію, монтаж, строки, оплату та гарантію.');
  doc.saveAndClose();selected.getRange(row,23).setValue(doc.getUrl());history_(data[0],'Создан черновик предложения',doc.getUrl());
}
