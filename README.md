# VOLONTÀ — Wear the Time

Website statis untuk GitHub Pages. Foto tersedia di `assets/`.

## Ulasan terbuka (memerlukan Supabase)

Siapa pun dapat mengirim ulasan tanpa kode pembelian. Supaya semua pengunjung melihat daftar ulasan yang sama, data disimpan di Supabase. Ulasan baru langsung tampil setelah dikirim.

1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` melalui Dashboard → SQL Editor.
3. Isi `supabase-config.js` dengan Project URL dan Publishable key. Publishable key boleh masuk ke website publik dengan RLS aktif; jangan pernah pakai Secret/service-role key di frontend.
4. Commit dan push file ke GitHub. Pastikan GitHub Pages menggunakan branch `main` dan folder `/(root)`.
5. Untuk menyembunyikan ulasan yang tidak layak, admin dapat mengubah statusnya menjadi `hidden` melalui SQL Editor.

Jika project sudah menggunakan schema lama dengan moderasi `pending`, jalankan `supabase/auto-approve-reviews.sql` untuk mengaktifkan persetujuan otomatis.

Tabel hanya mengizinkan pengunjung membaca ulasan berstatus `approved` dan mengirim ulasan baru berstatus `approved`. Pengunjung tidak dapat mengubah atau menghapus ulasan melalui website.

## Pesanan dan halaman admin

Checkout mewajibkan akun pembeli. Pembeli dapat mendaftar/masuk melalui `account.html`, lalu checkout menyimpan pesanan ke tabel `orders` dengan UUID akun dan membuka WhatsApp dengan nomor pesanan. Di halaman akun, pembeli dapat melihat status dan nomor resi pesanan miliknya. Jalankan ulang `supabase/schema.sql` di SQL Editor untuk menambahkan kolom akun dan kebijakan akses pesanan. Akun pembeli hanya dapat membaca pesanan miliknya sendiri; akun di `order_admins` tetap dapat mengelola seluruh pesanan.

1. Aktifkan pendaftaran email/password di Supabase Authentication → Settings agar pembeli dapat membuat akun. Buat akun admin di Authentication → Users (gunakan invite atau buat user dengan email admin); akun baru tidak memperoleh akses admin secara otomatis.
2. Salin UUID user tersebut dari daftar Users.
3. Di SQL Editor, jalankan `insert into public.order_admins (user_id) values ('UUID-USER-ADMIN');` dengan UUID akun admin.
4. Buka `/admin.html` di website dan masuk menggunakan email/password akun tersebut.

Di halaman admin, ubah `Baru` ke `Menunggu pembayaran` setelah stok dan ongkir dikonfirmasi. Setelah pembayaran diterima, ubah ke `Dibayar`, lalu `Diproses`, `Dikirim` (isi nomor resi), dan `Selesai`. Subtotal ditampilkan ulang dari katalog di admin; verifikasi stok dan ongkir sebelum mengirim total akhir ke pembeli.

Untuk langsung mengaktifkan akun tanpa menunggu email, matikan **Confirm email** pada Supabase Dashboard → Authentication → Sign In / Providers → Email. Dengan konfirmasi email nonaktif, Supabase otomatis menandai email akun baru sebagai terkonfirmasi; pembeli dapat langsung masuk setelah daftar. Alamat email yang belum diverifikasi tidak dicek kepemilikannya.

## Fitur website

- Desain Dark Luxury responsif, katalog produk, panduan ukuran S–XL, keranjang, dan checkout WhatsApp.
- Pengiriman, retur/refund, Hard Box, Certificate Artist Edition, kontak Instagram dan email.
- Ulasan bersama lintas pengunjung setelah Supabase dikonfigurasi.

Estimasi ukuran dan kebijakan layanan di halaman merupakan draf yang perlu ditinjau sebelum dipublikasikan.
