const env=import.meta.env;
const defaultSiteUrl='https://growatt-energy.vercel.app';
const configuredUrl=(env.VITE_SITE_URL||defaultSiteUrl).replace(/\/$/,'');
const browserOrigin=typeof window==='undefined'?'':window.location.origin;
const isProductionOrigin=!browserOrigin||browserOrigin===configuredUrl;
export const publicConfig={
  url:isProductionOrigin?configuredUrl:'',
  live:isProductionOrigin&&(configuredUrl===defaultSiteUrl||env.VITE_SITE_LIVE==='true'),
  gaId:/^G-[A-Z0-9]+$/.test(env.VITE_GA4_ID||'')?env.VITE_GA4_ID:'',
  verification:env.VITE_GOOGLE_SITE_VERIFICATION||'',
  businessName:env.VITE_BUSINESS_NAME||'Growatt Energy',
};
export function seo(title:string,description:string,path='/') {
  const url=publicConfig.url?publicConfig.url+path:'';
  return {meta:[
    {title},
    {name:'description',content:description},
    {name:'robots',content:publicConfig.live&&url?'index,follow':'noindex,nofollow'},
    {property:'og:title',content:title},
    {property:'og:description',content:description},
    {property:'og:type',content:'website'},
    {property:'og:locale',content:'uk_UA'},
    ...(url?[{property:'og:url',content:url},{property:'og:image',content:publicConfig.url+'/images/hero.jpg'}]:[]),
    {name:'twitter:card',content:'summary_large_image'},
    {name:'twitter:title',content:title},
    {name:'twitter:description',content:description},
    ...(publicConfig.verification?[{name:'google-site-verification',content:publicConfig.verification}]:[])
  ],links:url?[{rel:'canonical',href:url}]:[]};
}