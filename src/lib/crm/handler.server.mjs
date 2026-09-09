import { InputError, validateLead, signEnvelope, anonymousRateKey } from './protocol.mjs';
/** @param {any} body @param {number} status */
const reply = (body,status=200) => Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
/** @param {Request} request @param {Record<string,string|undefined>} env @param {typeof fetch} send */
export async function handleLead(request, env = process.env, send = fetch) {
  if (request.method !== 'POST') return reply({ok:false},405);
  // An explicit allowlist avoids trusting arbitrary forwarded host headers.
  const allowed = (env.LEAD_ALLOWED_ORIGINS || env.SITE_URL || '').split(',').map(s=>s.trim()).filter(Boolean);
  if (!allowed.includes(request.headers.get('origin') || '')) return reply({ok:false,error:'Запит з цього сайту не дозволено'},403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ok:false,error:'Непідтримуваний формат'},415);
  if (!env.GOOGLE_CRM_WEBAPP_URL || !env.CRM_SHARED_SECRET || env.CRM_SHARED_SECRET.length < 32) return reply({ok:false,error:'Прийом заявок тимчасово недоступний. Спробуйте пізніше.'},503);
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(env.GOOGLE_CRM_WEBAPP_URL)) return reply({ok:false,error:'Прийом заявок тимчасово недоступний.'},503);
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new InputError('Порожня заявка');
    const chunks = []; let size=0;
    while (true) { const {done,value}=await reader.read(); if(done) break; size+=value.length; if(size>12000) { await reader.cancel(); return reply({ok:false,error:'Заявка надто велика'},413); } chunks.push(value); }
    const lead = validateLead(JSON.parse(Buffer.concat(chunks).toString('utf8')));
    const ip = (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
    const envelope = signEnvelope({...lead,rateKey:anonymousRateKey(ip,env.CRM_SHARED_SECRET)},env.CRM_SHARED_SECRET);
    const body = JSON.stringify(envelope);
    // Escaping Unicode expands the wire representation; respect GAS limits.
    if (envelope.payload.length > 16000 || body.length > 20000) return reply({ok:false,error:'Заявка надто велика. Скоротіть коментар.'},413);
    // Apps Script must decode the same UTF-8 text that was signed by Node.
    const response = await send(env.GOOGLE_CRM_WEBAPP_URL,{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body,redirect:'follow',signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error('upstream');
    const result = await response.json();
    if (result.ok && /^[a-zA-Z0-9-]{8,100}$/.test(result.id || '')) return reply({ok:true,id:result.id});
    if(result.code === 'RATE_LIMIT') return reply({ok:false,error:'Забагато спроб. Повторіть пізніше.'},429);
    throw new Error('save_failed');
  } catch(error) {
    if (error instanceof InputError || error instanceof SyntaxError) return reply({ok:false,error:error instanceof InputError ? error.message : 'Некоректні дані'},400);
    // Do not log request bodies, secrets or upstream responses.
    return reply({ok:false,error:'Не вдалося підтвердити збереження. Повторіть спробу — дубль заявки не створиться.'},502);
  }
}
