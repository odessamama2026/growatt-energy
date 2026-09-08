declare global { interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void; } }
export function track(name: 'generate_lead'|'form_open'|'click_phone'|'click_telegram'|'click_whatsapp'|'click_email', source='site') {
  // Only controlled source labels. Never send names, phone numbers or form text.
  window.gtag?.('event',name,{form_source:source});
}
export function campaignParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(key=>[key,(params.get(key)||'').slice(0,120)]));
}
