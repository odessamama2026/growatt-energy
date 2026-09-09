import { createHmac, randomUUID } from 'node:crypto';

export class InputError extends Error {}
/** @param {unknown} value @param {number} max */
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
/** @param {any} value */
export function validateLead(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('Некоректна заявка');
  if (clean(value.website, 200)) throw new InputError('Не вдалося перевірити форму');
  const digits = clean(value.phone, 40).replace(/\D/g, '');
  const phone = /^380\d{9}$/.test(digits) ? '+' + digits : /^0\d{9}$/.test(digits) ? '+38' + digits : '';
  if (!phone) throw new InputError('Вкажіть телефон у форматі 067 XXX XX XX');
  if (value.consent !== true) throw new InputError('Підтвердьте згоду на обробку заявки');
  const source = clean(value.source, 40);
  const sources = ['hero','header','mobile-menu','mobile-cta','product','benefits','calculator','solar','footer-section','site','callback'];
  if (!sources.includes(source)) throw new InputError('Некоректне джерело заявки');
  const kit = clean(value.kit, 20);
  if (!['kit5','solar','consult'].includes(kit)) throw new InputError('Оберіть комплект');
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(value.requestId || '')) throw new InputError('Оновіть сторінку і спробуйте ще раз');
  /** @type {Record<string,string>} */
  const utm = {};
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) utm[key] = clean(value.utm?.[key], 120);
  let calculator = null;
  if (Array.isArray(value.calculator?.appliances)) {
    const appliances = [...new Set(value.calculator.appliances)].filter((id) => ['light','fridge','net','tv','wash','heating-boiler'].includes(id));
    calculator = {appliances, note: 'Орієнтовний розрахунок користувача; потребує перевірки інженером'};
  }
  return {requestId:value.requestId, name:clean(value.name,100),phone,city:clean(value.city,100),kit,comment:clean(value.comment,2000),preferredTime:clean(value.preferredTime,100),source,utm,calculator,consent:true,consentVersion:'2026-09-07',page:clean(value.page,150).split('?')[0]};
}
/** @param {any} data @param {string} secret @param {number} now */
export function signEnvelope(data, secret, now = Date.now()) {
  // Sign ASCII-only JSON so transport/receiver charset defaults cannot alter it.
  // JSON.parse restores Cyrillic, surrogate pairs and all original field values.
  const payload = JSON.stringify(data).replace(/[\u007f-\uffff]/g, character =>
    '\\u' + character.charCodeAt(0).toString(16).padStart(4, '0'));
  const timestamp = String(now);
  return {payload,timestamp,signature:createHmac('sha256',secret).update(timestamp + '.' + payload).digest('hex')};
}
/** @param {string} ip @param {string} secret */
export function anonymousRateKey(ip, secret) { return createHmac('sha256', secret).update(ip || 'unknown').digest('hex'); }
export function newRequestId() { return randomUUID(); }
