import { createFileRoute } from '@tanstack/react-router';
import { publicConfig } from '@/lib/public-config';
export const Route=createFileRoute('/robots.txt')({server:{handlers:{GET:()=>new Response(publicConfig.live&&publicConfig.url?`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${publicConfig.url}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}})}}});
