const env=import.meta.env;
export const publicConfig={
  url:(env.VITE_SITE_URL||'').replace(/\/$/,''),
  live:env.VITE_SITE_LIVE==='true',
  gaId:/^G-[A-Z0-9]+$/.test(env.VITE_GA4_ID||'')?env.VITE_GA4_ID:'',
  verification:env.VITE_GOOGLE_SITE_VERIFICATION||'',
  businessName:env.VITE_BUSINESS_NAME||'Growatt Energy',
};
export function seo(title:string,description:string,path='/') {
  const url=publicConfig.url?publicConfig.url+path:'';
  return {meta:[{title},{name:'description',content:description},{name:'robots',content:publicConfig.live&&url?'index,follow':'noindex,nofollow'},...(publicConfig.verification?[{name:'google-site-verification',content:publicConfig.verification}]:[])],links:url?[{rel:'canonical',href:url}]:[]};
}
