# RUMEA

Storefront berbahasa Indonesia dengan React, TypeScript, dan Vite. Katalog statis menggunakan foto produk asli, tas belanja tersimpan di perangkat, dan pemesanan diteruskan ke WhatsApp **081318597071**. Tidak memerlukan akun pelanggan, database, atau payment gateway.

## Menjalankan

Gunakan Node.js **22.18+** (dibangun dan diperiksa dengan Node 24.11.1).

```sh
npm ci
npm run dev
```

Buka http://127.0.0.1:4173. Untuk memeriksa hasil produksi:

```sh
npm test
npm run build
npm run preview
```

Build menjalankan pemeriksaan TypeScript, bundling, lalu merender 28 halaman HTML berisi konten dan metadata. Hasil siap hosting statis berada di `dist/`. Tidak ada rahasia atau kredensial yang diperlukan untuk menjalankan storefront.

## Memperbarui katalog

- `src/data/products.json`: sumber pusat nama, kategori, material, ukuran, gambar, varian, dan `retailPrice`.
- `retailPrice: null` dan `pricingStatus: "inquiry"`: tampilkan **Tanya Harga**. Jangan mengisi harga dari kolom biaya reseller.
- `retailPrice` berupa bilangan positif dan `pricingStatus: "verified"`: harga retail dengan bukti sumber. Harga awal mengikuti kolom Ecer dan harga pelanggan dalam proyek referensi yang disediakan.
- `availabilityStatus: "confirm"`: tidak ada klaim stok. Selalu konfirmasi saat pemesanan.
- Setiap varian menunjuk foto yang benar melalui `image`. Nama warna dengan keterangan “sesuai foto” bersifat deskriptif; bukan nama shade resmi atau jaminan tersedia.
- Aset publik di `public/assets/images/`, font lokal di `public/assets/fonts/`. Jangan menaruh PDF reseller, biaya supplier, inventaris internal, atau kredensial di `public/`.
- Pengaturan brand, WhatsApp, kategori, dan origin: `src/config.ts`. Setelah mengganti domain, jalankan build lagi untuk memperbarui canonical URL dan sitemap.
- Token desain: `src/styles.css`.

Laporan [audit katalog](docs/CATALOG-AUDIT.md) menjelaskan cakupan 22 koleksi, sumber foto, dan enam harga yang belum terverifikasi. Material dan ukuran Lea/Zea belum terverifikasi. Foto tidak menyatakan seluruh inventaris warna atau stok terkini.

## Perilaku pemesanan

Tas menggabungkan produk dengan varian yang sama dan mempertahankan varian berbeda sebagai baris terpisah. Kuantitas dibatasi 1–99 sebagai batas input, bukan jumlah stok. Produk berharga konfirmasi tidak masuk subtotal numerik. Jika semua produk belum memiliki harga, subtotal berisi teks “Menunggu konfirmasi”. Data pemesan opsional tidak disimpan ke server; hanya digunakan pada draft WhatsApp saat pelanggan memilih melanjutkan.

WhatsApp dibuka dengan daftar item, warna, kuantitas, harga yang tersedia, dan permintaan konfirmasi. Membuka WhatsApp tidak mengirim pesan secara otomatis dan tidak menyelesaikan pesanan.

## Struktur

- `src/components/`: navigasi, footer, kartu produk, dialog, tas, dan kontrol kuantitas.
- `src/pages/`: beranda editorial, katalog, dan detail produk.
- `src/commerce.ts`: validasi tas, perhitungan, dan pembuatan pesan.
- `src/store.tsx`: state React, penyimpanan lokal, dan sinkronisasi tas antar tab.
- `scripts/prerender.mjs`: HTML per route, metadata produk, JSON-LD, dan sitemap.
- `scripts/optimize-images.py`: kompresi dan ukuran WebP; memerlukan Pillow jika menambahkan aset baru.
- `tests/commerce.test.mjs`: pengujian integritas data dan transaksi.

Lihat [catatan desain](docs/DESIGN.md) dan [hasil QA](docs/QA.md). Proyek sumber `C:\project-devo\porto_vuyama_labs_1` hanya dibaca dan tidak diubah.

## Hosting

Build bersifat statis. Unggah isi `dist/` ke hosting yang mendukung directory index. Route produk memiliki HTML tersendiri, sehingga dapat dibuka langsung. `404.html` tersedia untuk halaman yang tidak dikenal. Situs Sites yang terkait dicatat dalam `.openai/hosting.json` dan menggunakan akses privat pemilik; mengubah akses publik atau custom domain merupakan pengaturan hosting terpisah.
