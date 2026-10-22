import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, Plus, ArrowUpRight } from 'lucide-react';
import type { Product } from '../types';
import { imageUrl, imageSet, priceLabel } from '../data/catalog';
import { useShop } from '../store';
export default function ProductCard({ product: p }: { product: Product }) {
  const [selected, setSelected] = useState(p.variants[0]);
  const [params] = useSearchParams();
  const color = params.get('warna'), query = params.get('q');
  useEffect(() => { const match = p.variants.find(v => (color && (v.family || p.colorFamily) === color) || (query && v.name.toLowerCase().includes(query.toLowerCase()))); if (match) setSelected(match); }, [p, color, query]);
  const { favorites, toggleFavorite, add } = useShop();
  return <article className="product-card"><div className={`product-photo ${p.contain || selected.contain ? 'contain-photo' : ''}`}>
    <Link to={`/produk/${p.slug}`} aria-label={`Lihat ${p.name}`}><img src={imageUrl(selected.image)} srcSet={imageSet(selected.image)} sizes="(max-width: 700px) 45vw, 24vw" alt={`${p.name}, ${selected.name}`} width="600" height="800" loading="lazy" decoding="async" />{p.images[1] && !p.variants.some(v => v.image === p.images[1]) && selected.id === p.variants[0].id && <img className="hover-photo" src={imageUrl(p.images[1])} srcSet={imageSet(p.images[1])} sizes="(max-width: 700px) 45vw, 24vw" alt={`${p.name}, tampilan lain`} width="600" height="800" loading="lazy" />}</Link>
    <span className="card-label">{p.category}</span><button className={`favorite-button ${favorites.includes(p.id) ? 'is-favorite' : ''}`} aria-label={`Simpan ${p.name}`} aria-pressed={favorites.includes(p.id)} onClick={() => toggleFavorite(p.id)}><Heart size={17} strokeWidth={1.3} /></button>
    <button className="card-quick" onClick={() => add(p.id, selected.id, 1)}><span>Tambahkan ke tas</span><Plus size={17} strokeWidth={1.2} /></button>
  </div><div className="product-meta"><span className="product-material">{p.material || p.category}</span><Link to={`/produk/${p.slug}`} className="product-name">{p.name}<ArrowUpRight size={16} strokeWidth={1.2} /></Link><div className="product-bottom"><span className="product-price">{priceLabel(p)}</span><div className="card-swatches" aria-label={`Pilihan varian ${p.name}`}>{p.variants.slice(0, 4).map(v => <button key={v.id} title={v.name} aria-label={`${p.name}: ${v.name}`} aria-pressed={selected.id === v.id} style={{ '--swatch': v.hex } as React.CSSProperties} onClick={() => setSelected(v)} />)}{p.variants.length > 4 && <Link to={`/produk/${p.slug}`} aria-label={`Lihat ${p.variants.length} varian ${p.name}`}>+{p.variants.length - 4}</Link>}</div></div></div></article>;
}
