import type { ImgHTMLAttributes } from 'react';
import images from '@/lib/image-manifest.json';
export function OptimizedImage({src='',sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw',...props}:ImgHTMLAttributes<HTMLImageElement>) {
  const item=images[src as keyof typeof images];
  if(!item) return <img src={src} {...props}/>;
  const variants=item.variants as [number,string][];
  return <img src={variants[Math.min(1,variants.length-1)][1]} srcSet={variants.map(([w,url])=>`${url} ${w}w`).join(', ')} sizes={sizes} width={item.width} height={item.height} decoding="async" {...props}/>;
}
