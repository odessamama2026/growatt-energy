import { useEffect,useState } from 'react';
import { publicConfig } from '@/lib/public-config';
import { track } from '@/lib/analytics';
export function Analytics() {
  const [choice,setChoice]=useState<string|null>(null);
  useEffect(()=>{try {setChoice(localStorage.getItem('analytics-consent'));}catch{setChoice(null);}},[]);
  useEffect(()=>{
    if(!publicConfig.live||!publicConfig.gaId||choice!=='yes') return;
    window.dataLayer ||= [];
    window.gtag ||= function() {window.dataLayer.push(arguments);};
    window.gtag('js',new Date());
    // Strip query strings from page_location to avoid collecting accidental PII.
    window.gtag('config',publicConfig.gaId,{page_location:location.origin+location.pathname,page_referrer:document.referrer?new URL(document.referrer).origin:'',allow_google_signals:false});
    const tag=document.createElement('script');tag.async=true;tag.src=`https://www.googletagmanager.com/gtag/js?id=${publicConfig.gaId}`;document.head.appendChild(tag);
    const click=(e:MouseEvent)=>{const link=(e.target as Element).closest?.('a');const href=link?.getAttribute('href')||'';if(href.startsWith('tel:'))track('click_phone');else if(href.startsWith('mailto:'))track('click_email');else if(href.startsWith('https://t.me/'))track('click_telegram');else if(href.startsWith('https://wa.me/'))track('click_whatsapp');};
    document.addEventListener('click',click);
    return()=>{document.removeEventListener('click',click);tag.remove();};
  },[choice]);
  function select(value:string) {try{localStorage.setItem('analytics-consent',value);}catch{}setChoice(value);}
  if(!publicConfig.live||!publicConfig.gaId||choice) return null;
  return <aside className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-lg rounded-lg border border-line bg-paper p-4 shadow-soft" aria-label="Налаштування аналітики"><p className="text-sm">Дозволити Google Analytics для статистики відвідувань? Це не впливає на надсилання заявки.</p><div className="mt-3 flex gap-3"><button className="min-h-11 rounded-md bg-primary px-4 text-primary-foreground" onClick={()=>select('yes')}>Дозволити</button><button className="min-h-11 rounded-md border border-line px-4" onClick={()=>select('no')}>Відхилити</button></div></aside>;
}
