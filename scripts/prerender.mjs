import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { config } from '../src/config.ts';
const products = JSON.parse(await readFile('src/data/products.json','utf8'));
const origin=config.siteUrl;
const base=await readFile('dist/index.html','utf8');
await mkdir('.sites',{recursive:true});
await build({entryPoints:['src/entry-server.tsx'],bundle:true,platform:'node',format:'cjs',outfile:'.sites/entry-server.cjs',external:['react','react-dom','react-dom/server'],jsx:'automatic',logLevel:'warning'});
const require=createRequire(import.meta.url);
const {render}=require('../.sites/entry-server.cjs');
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routes=['/','/koleksi','/tentang','/panduan','/tas','/tersimpan',...products.map(p=>'/produk/'+p.slug)];
try {
 for(const route of routes){
  const p=products.find(p=>route==='/produk/'+p.slug);
  let html=base.replace('<div id="root"></div>',`<div id="root">${render(route)}</div>`);
  if(p){
   html=html.replace(/<title>.*?<\/title>/,`<title>${escape(p.name)} — RUMEA</title>`)
    .replace(/(<meta name="description" content=")[^"]*/,`$1${escape(p.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/,`$1${escape(p.name)} — RUMEA`)
    .replace(/(<meta property="og:description" content=")[^"]*/,`$1${escape(p.description)}`);
  }
  html=html.replace(/(<meta property="og:image" content=")[^"]*/,`$1${origin}/assets/images/${p?.images[0]||'gradasi-cream.webp'}`);
  html=html.replace('</head>',`<link rel="canonical" href="${origin}${route}"/>${p?`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description,image:origin+'/assets/images/'+p.images[0],brand:{'@type':'Brand',name:'RUMEA'},...(p.material?{material:p.material}:{}),sku:p.id}).replace(/</g,'\\u003c')}</script>`:''}</head>`);
  const dir=route==='/'?'dist':'dist'+route;
  await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html);
 }
 await writeFile('dist/404.html',base.replace('<div id="root"></div>',`<div id="root">${render('/404')}</div>`));
 await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>!['/tas','/tersimpan'].includes(r)).map(r=>`<url><loc>${origin}${r}</loc></url>`).join('')}</urlset>`);
 await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
 console.log(`Prerendered ${routes.length} routes with metadata and sitemap.`);
}catch(error){throw error;}
