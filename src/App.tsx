import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { ShopProvider, useShop } from './store';
import { Header, Footer } from './components/Layout';
import Bag, { BagContent } from './components/Bag';
import Home, { ShoppingSteps } from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import { getProduct, imageUrl } from './data/catalog';
import { config } from './config';
import { whatsappUrl } from './commerce';
function About() { return <><section className="about-hero section"><div><span className="eyebrow">TENTANG RUMEA</span><h1>Ruang untuk<br />menjadi <em>dirimu.</em></h1><p>RUMEA adalah tentang pilihan yang terasa personal. Tentang warna yang kamu sukai, siluet yang menemanimu, dan keindahan yang tidak perlu berlebihan.</p><p>Kami menghadirkan pilihan hijab, pashmina, khimar, dan mukena agar kamu bisa menemukan padanan untuk keseharianmu. Sederhana, dengan perhatian pada setiap pilihan.</p><Link to="/koleksi" className="button">Temukan koleksimu <ArrowRight size={17} /></Link></div><div className="about-photo"><img src={imageUrl('gradasi.webp')} alt="Viscose Gradasi Blushy Rose — RUMEA" width="900" height="1200" /><span>THE ART OF EVERYDAY ELEGANCE</span></div></section><section className="brand-statement"><span className="eyebrow">CARA KAMI MELIHAT KEINDAHAN</span><h2>Bukan tentang banyak pilihan.<br />Tentang pilihan yang <em>berarti untukmu.</em></h2><p>Dengan informasi produk yang jelas dan percakapan yang hangat,<br />kami ingin membuat proses memilih terasa lebih mudah.</p></section><ShoppingSteps /></>; }
function Guide() { return <><div className="guide-intro section"><span className="eyebrow">PANDUAN BELANJA</span><h1>Dari pilihanmu,<br />ke <em>percakapan kita.</em></h1><p>Pemesanan RUMEA dilanjutkan secara personal melalui WhatsApp.</p></div><ShoppingSteps /><section className="guide-faq section"><h2>Hal yang ingin kamu <em>ketahui.</em></h2>{[
  ['Apakah produk pasti tersedia?', 'Koleksi yang ditampilkan merupakan pilihan dalam katalog. Ketersediaan warna dan varian akan kami konfirmasi melalui WhatsApp sebelum pembayaran.'],
  ['Bagaimana dengan harga “Tanya Harga”?', 'Harga beberapa koleksi perlu dikonfirmasi. Kamu tetap bisa menambahkannya ke tas. Produk ini tidak dimasukkan ke subtotal angka sampai harganya disepakati.'],
  ['Bagaimana ongkir dan pembayarannya?', 'Ongkos kirim menyesuaikan alamat tujuan dan dikonfirmasi bersama kami. Cara pembayaran serta total akhir akan dibicarakan melalui WhatsApp.'],
  ['Apakah pesanan langsung selesai setelah membuka WhatsApp?', 'Belum. Pesan yang disiapkan website merupakan daftar permintaan pesanan. Pesanan dikonfirmasi setelah ketersediaan, total akhir, pengiriman, dan pembayaran disepakati bersama kami.'],
  ['Bagaimana jika ingin bertanya tentang produk atau pengembalian?', 'Hubungi kami melalui WhatsApp untuk detail material, ukuran, warna, serta ketentuan penanganan pesanan dan pengembalian. Pastikan informasinya sesuai kebutuhanmu sebelum pembayaran.'],
].map(([q, a]) => <details key={q}><summary>{q}<ArrowUpRight size={17} /></summary><p>{a}</p></details>)}<a className="button" href={whatsappUrl('Halo RUMEA, saya ingin bertanya tentang cara pemesanan.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Tanya RUMEA <ArrowUpRight size={17} /></a></section></>; }
function RouteEffects() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else window.scrollTo({ top: 0, behavior: 'instant' });
    const p = pathname.startsWith('/produk/') ? getProduct(pathname.split('/')[2]) : undefined;
    document.title = p ? `${p.name} — RUMEA` : ({ '/koleksi': 'Koleksi Pilihan — RUMEA', '/tentang': 'Tentang RUMEA', '/tas': 'Tas Belanja — RUMEA', '/panduan': 'Panduan Belanja — RUMEA', '/tersimpan': 'Koleksi Tersimpan — RUMEA' }[pathname] || 'RUMEA — Anggun dalam kesederhanaan');
    const description = p?.description || 'Temukan pilihan hijab, pashmina, khimar, dan mukena RUMEA. Jelajahi koleksi dan pesan secara personal melalui WhatsApp.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', config.siteUrl + imageUrl(p?.images[0] || 'gradasi-cream.webp'));
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = config.siteUrl + pathname;
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); } }), { threshold: .06 });
    document.querySelectorAll('.section-heading, .brand-statement h2, .editorial-copy, .color-copy, .steps-intro').forEach(e => { e.classList.add('reveal'); observer.observe(e); });
    return () => observer.disconnect();
  }, [pathname, search, hash]);
  return null;
}
function Shell() { const { toast } = useShop(); return <><a className="skip-link" href="#main">Langsung ke konten</a><RouteEffects /><Header /><main id="main"><Routes><Route path="/" element={<Home />} /><Route path="/koleksi" element={<Catalog />} /><Route path="/produk/:slug" element={<Product />} /><Route path="/tersimpan" element={<Catalog saved />} /><Route path="/tentang" element={<About />} /><Route path="/panduan" element={<Guide />} /><Route path="/tas" element={<div className="bag-page section"><span className="eyebrow">PILIHAN PERSONALMU</span><h1>Tas <em>belanja.</em></h1><BagContent full /></div>} /><Route path="*" element={<div className="empty-state"><span className="eyebrow">404 / RUMEA</span><h1>Jalan lain, cerita baru.</h1><p>Halaman yang kamu cari belum ditemukan.</p><Link className="button" to="/">Kembali ke beranda <ArrowRight size={18} /></Link></div>} /></Routes></main><Footer /><Bag /><div className={`toast ${toast ? 'visible' : ''}`} role="status">{toast}</div></>; }
export default function App() { return <ShopProvider><Shell /></ShopProvider>; }
