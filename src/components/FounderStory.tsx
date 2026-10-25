export default function FounderStory({ hero = false }: { hero?: boolean }) {
  const Heading = hero ? 'h1' : 'h2';
  return <section className={`founder-story section ${hero ? 'founder-hero' : ''}`} id="meet-mei">
    <figure className="founder-portrait"><img src="/assets/images/mei-founder.jpeg" alt="Mei, pendiri Rumea Store, mengenakan hijab dusty pink" width="1086" height="1448" loading={hero ? 'eager' : 'lazy'} /><figcaption>MEI / THE HEART BEHIND RUMEA</figcaption></figure>
    <div className="founder-copy"><span className="eyebrow">THE STORY OF RUMEA</span><Heading>Meet Mei <span className="founder-heart">💕</span></Heading><h3>The Heart Behind Rumea Store</h3>
      <p>Hai, aku Mei!</p>
      <p>Rumea lahir dari mimpi kecilku untuk membangun usaha sendiri, dengan cinta dan dukungan keluarga.</p>
      <p>Nama RUMEA punya arti spesial, gabungan nama orang-orang tersayang: RU dari Rulli, ME dari Meilina, dan A dari Athalla.</p>
      <p>Melalui Rumea, aku ingin menghadirkan produk-produk pilihan yang cantik, berkualitas, dan tetap ramah di kantong.</p>
      <p>Karena buatku, Rumea bukan sekadar toko, tapi cerita tentang cinta, keluarga, dan sebuah mimpi.</p>
      <div className="founder-signature"><span>With love,</span><span>Mei</span></div>
    </div>
  </section>;
}
