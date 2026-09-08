// Only a deliberate public launch requires final business/integration settings.
const e=process.env;
if(e.VITE_SITE_LIVE==='true'&&e.VERCEL_ENV!=='preview') {
  const required=['VITE_SITE_URL','VITE_PHONE','VITE_CONTACT_EMAIL','VITE_DATA_CONTROLLER','GOOGLE_CRM_WEBAPP_URL','CRM_SHARED_SECRET','SITE_URL'];
  const missing=required.filter(k=>!e[k]);
  if(missing.length) throw Error('Public launch settings missing: '+missing.join(', '));
  if(e.SITE_URL!==e.VITE_SITE_URL) throw Error('SITE_URL and VITE_SITE_URL must match');
  const url=new URL(e.SITE_URL);if(url.protocol!=='https:'||url.origin!==e.SITE_URL)throw Error('Use a canonical HTTPS origin without trailing slash');
  if(!/^\+380\d{9}$/.test(e.VITE_PHONE))throw Error('Set a verified Ukrainian business phone');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.VITE_CONTACT_EMAIL))throw Error('Set the business contact email');
  if(e.CRM_SHARED_SECRET.length<32)throw Error('CRM secret must be at least 32 characters');
}
