import { createFileRoute } from '@tanstack/react-router';
import { publicConfig } from '@/lib/public-config';
export const Route=createFileRoute('/sitemap.xml')({server:{handlers:{GET:()=>{
  const url=publicConfig.url.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const paths=publicConfig.live&&url?['/','/privacy']:[];
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>`<url><loc>${url}${p}</loc></url>`).join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}}}});
