# VOLONTÀ — Wear the Time

Website statis untuk GitHub Pages. Foto tersedia di `assets/`.

## Ulasan terbuka (memerlukan Supabase)

Siapa pun dapat mengirim ulasan tanpa kode pembelian. Supaya semua pengunjung melihat daftar ulasan yang sama, data disimpan di Supabase. Kiriman baru berstatus `pending`; admin menyetujui isinya sebelum tampil publik.

1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` melalui Dashboard → SQL Editor.
3. Isi `supabase-config.js` dengan Project URL dan Publishable key. Publishable key boleh masuk ke website publik dengan RLS aktif; jangan pernah pakai Secret/service-role key di frontend.
4. Commit dan push file ke GitHub. Pastikan GitHub Pages menggunakan branch `main` dan folder `/(root)`.
5. Untuk memoderasi, jalankan query daftar pending yang dicantumkan di `supabase/schema.sql`; ubah status ulasan yang layak menjadi `approved`.

Tabel hanya mengizinkan pengunjung membaca ulasan berstatus `approved` dan mengirim ulasan baru berstatus `pending`. Pengunjung tidak dapat menyetujui atau menghapus ulasan melalui website.

## Fitur website

- Desain Dark Luxury responsif, katalog produk, panduan ukuran S–XL, keranjang, dan checkout WhatsApp.
- Pengiriman, retur/refund, Hard Box, Certificate Artist Edition, kontak Instagram dan email.
- Ulasan bersama lintas pengunjung setelah Supabase dikonfigurasi.

Estimasi ukuran dan kebijakan layanan di halaman merupakan draf yang perlu ditinjau sebelum dipublikasikan.
