import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { cleanCart, clampQuantity, cartSummary, orderMessage, whatsappUrl } from '../src/commerce.ts';
const catalog=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url),'utf8'));
const modal=catalog.find(p=>p.id==='modal-viscose'),gradasi=catalog.find(p=>p.id==='viscose-gradasi'),lea=catalog.find(p=>p.id==='lea-oval-khiban');
const line=(p,quantity=1,variantId=p.variants[0].id)=>({productId:p.id,variantId,quantity});
test('invalid persisted data and stale variants are discarded',()=>{
 assert.deepEqual(cleanCart(null,catalog),[]);
 assert.deepEqual(cleanCart([null,{},line(modal,1,'not-a-color'),{productId:'unknown',variantId:'x',quantity:2}],catalog),[]);
});
test('duplicate product and variant merge; distinct colors remain separate',()=>{
 const c=cleanCart([line(gradasi,2),line(gradasi,3),line(gradasi,1,gradasi.variants[1].id)],catalog);
 assert.equal(c.length,2);assert.equal(c[0].quantity,5);assert.equal(c[1].quantity,1);
});
test('quantity is a bounded integer independent of stock',()=>{
 for(const n of [null,undefined,'',-10,0,'bad']) assert.equal(clampQuantity(n),1);
 assert.equal(clampQuantity(500),99);assert.equal(clampQuantity(2.9),2);
});
test('multi-product subtotal uses current verified retail data',()=>{
 const s=cartSummary([line(modal,2),line(gradasi,3)],catalog);
 assert.equal(s.subtotal,2*59000+3*99000);assert.equal(s.count,5);assert.equal(s.pending,0);
});
test('mixed cart explicitly excludes unknown prices',()=>{
 const s=cartSummary([line(modal,2),line(lea,3)],catalog);
 assert.equal(s.subtotal,118000);assert.equal(s.pending,3);assert.equal(s.hasPriced,true);assert.equal(s.lines[1].total,null);
 const m=orderMessage([line(modal,2),line(lea,3)],catalog);
 assert.match(m,/3 pcs dengan harga konfirmasi belum termasuk subtotal/);assert.match(m,/Subtotal produk berharga/);
});
test('all-inquiry cart never advertises a numeric subtotal',()=>{
 const m=orderMessage([line(lea,2)],catalog);assert.match(m,/Subtotal: menunggu konfirmasi harga/);assert.doesNotMatch(m,/Rp/);
});
test('WhatsApp destination, unicode encoding, variants and quantities are correct',()=>{
 const cart=[line(modal,2),line(gradasi,3,gradasi.variants[2].id),line(lea,1)];
 const message=orderMessage(cart,catalog,{name:'Dewi & Putri',city:'Jakarta',notes:'Warna krem, terima kasih ♥'});
 const url=new URL(whatsappUrl(message));assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/6281318597071');assert.equal(url.searchParams.get('text'),message);
 assert.match(message,/Creamy Nude/);assert.match(message,/Jumlah: 3 pcs/);assert.match(message,/Dewi & Putri/);assert.match(message,/ketersediaan produk dan varian/);assert.doesNotMatch(message,/Vuyama|reseller|selesai|lunas/i);
});
test('empty cart cannot produce an order message',()=>assert.throws(()=>orderMessage([],catalog),/kosong/));
test('catalog is unique, traceable, internally valid and has only real local images',()=>{
 assert.equal(catalog.length,22);assert.equal(catalog.filter(p=>p.retailPrice===null).length,6);
 assert.equal(new Set(catalog.map(p=>p.slug)).size,22);
 for(const p of catalog){
  assert.equal(p.pricingStatus,p.retailPrice===null?'inquiry':'verified');assert.ok(p.variants.length);assert.equal(p.availabilityStatus,'confirm');
  for(const file of [...p.images,...p.variants.map(v=>v.image)]) assert.ok(existsSync(new URL('../public/assets/images/'+file,import.meta.url)),file);
  assert.doesNotMatch(p.description,/Vuyama|reseller|placeholder|opsi 1/i);
 }
});
