# Perubahan — DataTable, Email dari Firebase Auth, Search & Profile Popup

Ringkasan perubahan yang diminta, dan cara mengaktifkannya.

## 1. Semua tabel sekarang pakai DataTable

File baru: `src/components/DataTable.tsx` (pakai `@tanstack/react-table`, headless —
jadi tampilan/warna/spacing tabel **tidak berubah sama sekali**, cuma nambah:

- Search box di atas tabel
- Sort dengan klik header kolom
- Pagination (10 baris/halaman)

Dipakai di: `Users.tsx`, `Companions.tsx`, `AdminManagement.tsx`, `TopUps.tsx`, `Withdraws.tsx`.

## 2. Email berdasarkan Firebase Auth (bukan field Firestore)

ID dokumen `profile_user/{id}` dan `profile_companion/{id}` sama dengan uid di
Firebase Auth. Untuk ambil email asli dari Auth (bukan field `email` di
Firestore yang bisa kosong/telat sync), dibutuhkan Admin SDK — client SDK
tidak bisa baca data Auth user lain.

**File baru:**
- `functions/src/index.ts` — Cloud Function `getUserEmails` (callable, admin-only)
- `src/hooks/useAuthEmails.ts` — hook di client yang manggil function di atas
- `src/lib/firebase_config.ts` — ditambah `fetchAuthEmails()` + export `functions`

**Fallback aman:** kalau function ini belum di-deploy, hook akan diam-diam
fallback ke field `email` yang sudah ada di dokumen Firestore (seperti
perilaku sebelumnya). Tidak ada yang rusak kalau belum sempat deploy.

### Cara deploy function ini

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

Catatan:
- Butuh Firebase project di **Blaze plan** (Cloud Functions tidak jalan di Spark plan).
- Function ini hanya bisa dipanggil oleh companion yang admin_level >= 1
  (sama seperti pengecekan admin di `AuthContext.tsx`).
- `firestore.rules` **tidak diubah** sama sekali — masih rules debug yang lama.

## 3. Top Up & Withdraw: search by Request ID, full ID + copy, popup profil user

- **Search by ID:** search box di atas tabel (dari DataTable) langsung
  cocok dengan Request ID / Withdraw ID penuh, walau yang ditampilkan dipotong.
- **ID lengkap + copy:** komponen baru `src/components/CopyableId.tsx` —
  hover buat lihat ID penuh (tooltip), klik buat copy ke clipboard.
- **Kolom nama user/companion yang bisa diklik:** klik nama di tabel Top Up
  atau Withdraw akan buka popup (`src/components/UserProfileModal.tsx`)
  berisi nama lengkap, email (dari Firebase Auth), balance saat ini, dan
  **simulasi balance** setelah request itu di-accept/approve.

---

Semua perubahan di atas ada di kode frontend (`src/`). Fitur email dari Auth
butuh langkah deploy manual di atas karena melibatkan backend (Cloud Function).
