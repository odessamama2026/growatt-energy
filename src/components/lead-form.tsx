import { useRef, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { normalizeUaPhone } from '@/lib/utils';
import { campaignParams, track } from '@/lib/analytics';
import { useLead } from '@/lib/lead-store';
const KITS=[['kit5','Інвертор + батарея'],['solar','Комплект із сонячними панелями'],['consult','Консультація']];
export function LeadForm({source,compact=false}:{source:string;compact?:boolean}) {
  const [error,setError]=useState(''); const [pending,setPending]=useState(false); const [done,setDone]=useState('');
  const [savedPhone,setSavedPhone]=useState(''); const requestId=useRef(''); const inFlight=useRef(false);
  const calculator=useLead(s=>s.calculator);
  async function onSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(inFlight.current) return;
    const form=new FormData(event.currentTarget);
    const phone=String(form.get('phone')||'');
    if(!/^(?:380\d{9}|0\d{9})$/.test(phone.replace(/\D/g,''))) {setError('Вкажіть номер у форматі 067 XXX XX XX');return;}
    requestId.current ||= crypto.randomUUID();
    inFlight.current=true;setPending(true);setError('');
    try {
      const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        requestId:requestId.current,name:form.get('name'),phone,city:form.get('city'),kit:form.get('kit')||'consult',comment:form.get('comment'),preferredTime:form.get('preferredTime'),website:form.get('website'),consent:form.get('consent')==='on',source,calculator:source==='calculator'?calculator:null,utm:campaignParams(),page:window.location.pathname
      }),signal:AbortSignal.timeout(25000)});
      const result=await response.json();
      if(!response.ok||!result.ok) throw new Error(result.error||'Не вдалося зберегти заявку');
      setSavedPhone(normalizeUaPhone(phone));setDone(result.id);track('generate_lead',source);
    } catch(err) {setError(err instanceof Error && err.name!=='TimeoutError'?err.message:'Відповідь затримується. Спробуйте ще раз — повторна заявка не створиться.');}
    finally {inFlight.current=false;setPending(false);}
  }
  if(done) return <div role="status" className="rounded-lg border border-line bg-sand/60 p-6 text-center"><Check className="mx-auto size-10 text-primary"/><h3 className="mt-4 text-xl">Заявку збережено</h3><p className="mt-3 text-sm">Зв’яжемося з вами за номером {savedPhone}.</p><p className="mt-3 break-all text-xs text-muted">Номер: {done}</p></div>;
  return <form onSubmit={onSubmit} className="grid min-w-0 gap-4" aria-busy={pending}>
    <div className="grid gap-4 sm:grid-cols-2"><div className="grid gap-1.5"><Label htmlFor={`name-${source}`}>Ім’я</Label><Input id={`name-${source}`} name="name" autoComplete="name" maxLength={100}/></div><div className="grid gap-1.5"><Label htmlFor={`phone-${source}`}>Телефон *</Label><Input id={`phone-${source}`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="067 XXX XX XX" required maxLength={40} aria-describedby={error?`error-${source}`:undefined}/></div></div>
    {compact?<div className="grid gap-1.5"><Label htmlFor={`time-${source}`}>Коли зручно зателефонувати?</Label><Input id={`time-${source}`} name="preferredTime" placeholder="Наприклад: завтра після 14:00" maxLength={100}/></div>:<><div className="grid gap-1.5"><Label htmlFor={`city-${source}`}>Місто</Label><Input id={`city-${source}`} name="city" defaultValue="Одеса" maxLength={100}/></div><fieldset className="grid gap-2"><legend className="mb-2 text-sm font-medium">Що цікавить</legend>{KITS.map(([id,label])=><label key={id} className="flex min-h-11 items-center gap-3 rounded-md border border-line p-3 text-sm"><input type="radio" name="kit" value={id} defaultChecked={id==='kit5'} className="accent-primary"/>{label}</label>)}</fieldset><div className="grid gap-1.5"><Label htmlFor={`comment-${source}`}>Коментар</Label><Textarea id={`comment-${source}`} name="comment" maxLength={2000}/></div></>}
    {source==='calculator'&&calculator?<p className="text-sm text-muted">Додамо до заявки обрані прилади: {calculator.appliances.length}.</p>:null}
    <div className="honeypot" aria-hidden="true"><label>Ваш сайт<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="flex items-start gap-3 text-xs leading-relaxed text-muted"><input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-primary"/><span>Погоджуюся на обробку даних для відповіді на заявку. <a href="/privacy" className="underline">Політика конфіденційності</a></span></label>
    {error?<p role="alert" id={`error-${source}`} className="text-sm text-danger">{error}</p>:null}
    <Button type="submit" size="lg" disabled={pending} className="w-full">{pending?'Зберігаємо…':compact?'Передзвоніть мені':'Отримати розрахунок'}</Button>
  </form>;
}
