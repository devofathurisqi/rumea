import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
const products=JSON.parse(await readFile('src/data/products.json','utf8'));
const routes=['/','/koleksi','/tentang','/panduan','/tas','/tersimpan',...products.map(p=>'/produk/'+p.slug)];
const assets=new Set();
for(const route of routes){
 const file=path.join('dist',route,'index.html');
 const html=await readFile(file,'utf8');
 if(!html.includes('<h1')||!html.includes('rel="canonical"'))throw new Error('Missing content or canonical: '+route);
 if(/Vuyama|khusus reseller|harga modal|opsi 1|placeholder text/i.test(html))throw new Error('Non-public or placeholder copy: '+route);
 for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)[^"\s]*"/g)){
  const target=decodeURIComponent(match[1]);
  if(!target)continue;
  assets.add(target);
 }
 for(const match of html.matchAll(/srcSet="([^"]+)"/gi))for(const item of match[1].split(','))assets.add(item.trim().split(' ')[0]);
 const p=products.find(p=>route==='/produk/'+p.slug);
 if(p&&!html.includes('"@type":"Product"'))throw new Error('Missing product schema: '+route);
}
for(const asset of assets){
 const dest=path.join('dist',asset);
 try{await access(dest);}catch{try{await access(path.join(dest,'index.html'));}catch{throw new Error('Missing build asset or route: '+asset);}}
}
await access('dist/sitemap.xml');await access('dist/404.html');
console.log(`Verified ${routes.length} HTML routes and ${assets.size} referenced local assets/links. No supplier identity or reseller copy in public HTML.`);
