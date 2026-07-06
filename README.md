# TemanZiro Spec Driven Development (SDD)
### Q1: User *booking* companion untuk sebuah aktivitas
- **S1:** User mengisi form booking
    - **F1:** User memilih tipe aktivitas
    - **F2:** User mengisi detail booking
    - **F3:** User submit booking request
    - **F4:** Matching function berjalan untuk mengirimkan notifikasi kepada companion (dikirim ke companion berbeda tiap 10 detik, jika sudah ada companion yang *terima* maka notif tersebut disable di companion lainnya)
- **S2:** Companion menerima/menolak request booking
    - **F1:** Companion menerima notifikasi request booking
    - **F2:** Companion menerima/menolak request booking

### RQ2: Pembayaran
- **S1:** User memiliki saldo yang cukup, sesuai dengan nilai booking
    - **F1:** Function memotong saldo user sejumlah nilai booking
    - **F2:** Function mengkalkulasikan fee yang di terima companion dan potongan mitra
    - **F3:** Saldo companion terhold hingga booking telah selesai
- **S2:** User tidak memiliki saldo yang cukup
    - **F1:** User mengisi form top-up
    - **F2:** Admin mengkonfirmasi saldo top-up
    - **F3:** User dapat kembali ke halaman booking untuk melakukan booking

### RQ3: Notification
- **S1:** Companion dapat menerima/menolak request booking
    - **F1:** Function dari match request diterima oleh companion (companion yang menerima notif adalah companion yang belum memiliki jadwal booking pada hari dan jam tersebut)
    - **F2:** Companion dapat menerima request booking tersebut dan akan masuk ke halaman detail booking
    - **F3:** Companion dapat menolak request booking
- **S2:** Companion mendapatkan notif berkaitan dengan withdrawal
    - **F1:** Setelah melakukan request withdrawal, companion mendapatkan notif, sesuai dengan status requestnya
- **S3:** Companion mendapatkan notif status booking
    - **F1:** Companion mendapatkan notif saat mendekati jadwal booking
    - **F2:** Companion mendapatkan notif hasil review User saat booking selesai
- **S4:** User mendapatkan notif berkaitan dengan booking
    - **F1** User mendapatkan notif ketika user mendapatkan companion yang menerima request booking
    - **F2** User mendapatkan notif saat mendekati jadwal booking
    - **F3** User mendapatkan notif untuk mengisi reflection setelah booking selesai
- **S5:** Notifikasi KYC
    - **F1:** User/Companion mengisi KYC
    - **F2:** User/Companion mendapatkan notifikasi mengenai KYC

### RQ4: Withdrawal Companion
- **S1:** Companion ingin menarik saldo yang sudah cair
    - **F1:** Function berkerja saat session booking telah berakhir, expected income berubah menjadi saldo yang dapat ditarik
    - **F2:** Companion ingin menarik saldo tersebut melalui input nilai yang ingin ditarik di form withdraw beserta detail bank tujuan
    - **F3:** Admin mengonfirmasi withdrawal request, jika di terima, maka admin akan mengirimkan saldo tersebut ke bank yang telah di cantumkan dan mengurangi saldo yang tertera dalam aplikasi
    - **F4:** Jika admin menolak request tersebut akan ada pesan alasan ditolak

### RQ5: KYC User
- **S1:** User belum mengisi KYC saat pertama kali register
    - **F1:** User dapat masuk ke dashboard tetapi tidak bisa melakukan booking
    - **F2:** User dapat melakukan edit profile
- **S2:** User telah mengisi KYC
    - **F1:** Admin mengecek KYC User, jika diterima maka User dapat menggunakan seluruh fitur aplikasi sebagai User
    - **F2:** Jika ditolak, maka User perlu melakukan revisi data KYC


### RQ6: KYC Companion
- **S1:** Companion belum mengisi KYC saat pertama kali register
    - **F1:** Companion dapat masuk ke dashboard tetapi tidak bisa mendapatkan request booking
    - **F2:** Companion dapat melakukan edit profile
- **S2:** Companion telah mengisi KYC, CV dan nomor telpon
    - **F1:** Admin mengecek KYC, CV dan nomor Companion, jika diterima maka Companion akan di hubungi oleh Admin untuk interview
    - **F2:** Jika ditolak, maka Companion perlu melakukan revisi data KYC, CV maupun nomor

### RQ7: Meeting Session
- **S1:** Konfirmasi ketemu antara User dan Companion
    - **F1:** Generate QR di sisi Companion menggunakan id Booking
    - **F2:** Scan QR di sisi User
- **S2:** Melihat lokasi pertemuan
    - **F1:** User dan Companion dapat melihat maps lokasi bertemu
    - **F2:** User dan companion dapat melihat lokasi satu sama lain mendekati jadwal booking


# TemanZiro Foldering  
```text
TemanZiro/
├── app/
│   ├── (tabs)/
│   │   ├── (dashboard)/
│   │   │   ├── _layout.tsx
│   │   │   └── dashboard.tsx
│   │   ├── (listchat)/
│   │   │   ├── _layout.tsx
│   │   │   └── listchat.tsx
│   │   ├── (profile)/
│   │   │   ├── _layout.tsx
│   │   │   └── profile.tsx
│   │   ├── (temanjalan)/
│   │   │   ├── _layout.tsx
│   │   │   └── temanjalan.tsx
│   │   └── _layout.tsx
│   ├── (tabs_companion)/
│   │   ├── (dashboard)/
│   │   │   ├── _layout.tsx
│   │   │   └── dashboard.tsx
│   │   ├── (listchat)/
│   │   │   ├── _layout.tsx
│   │   │   └── listchat.tsx
│   │   ├── (profile)/
│   │   │   ├── _layout.tsx
│   │   │   └── profile.tsx
│   │   ├── (temanjalan)/
│   │   │   ├── _layout.tsx
│   │   │   └── temanjalan.tsx
│   │   └── _layout.tsx
│   ├── auth/
│   │   └── AuthScreen_Call.tsx
│   ├── common/
│   │   └── chatscreen.tsx
│   ├── companion/
│   │   └── editprofilecompanion.tsx
│   ├── verification/
│   │   ├── ChooseRoleScreen_Call.tsx
│   │   ├── UploadCVPhoneNumberScreen_Call.tsx
│   │   ├── UploadKTPScreen_Call.tsx
│   │   ├── UploadSelfieKTPScreen_Call.tsx
│   │   ├── VerificationDataCompanionScreen_Call.tsx
│   │   └── VerificationDataUserScreen_Call.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── assets/
├── constants/
│   ├── BookingDetails.ts
│   ├── CompanionRating.ts
│   ├── Config.ts
│   ├── MoneyDetails.ts
│   ├── Notification.ts
│   ├── Theme.ts
│   ├── TierDetails.ts
│   └── UserDetails.ts
├── controllers/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── MapContext.tsx
│   │   ├── PresenceContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── UserProfileContext.tsx
│   └── hooks/
│       ├── Common/
│       │   ├── useChat.ts
│       │   └── useListChat.ts
│       ├── Companion/
│       │   ├── useCompanionDashboard.ts
│       │   ├── useCompanionEditProfile.ts
│       │   └── useCompanionProfile.ts
│       ├── index.ts
│       ├── useAuth.ts
│       ├── useMap.ts
│       ├── useMapLocation.ts
│       ├── usePresence.ts
│       ├── useTheme.ts
│       └── useUserProfile.ts
├── data/
│   ├── config/
│   │   └── firebase_config.ts
│   └── repositories/
│       ├── utils/
│       │   ├── DateUtils.ts
│       │   ├── NameUtils.ts
│       │   ├── TierUtils.ts
│       │   └── UploadFileUtils.ts
│       ├── BookingRepository.ts
│       ├── ChatRepository.ts
│       ├── CompanionRepository.ts
│       ├── CvRepository.ts
│       ├── KycRepository.ts
│       ├── LoginRepository.ts
│       ├── NotificationRepository.ts
│       ├── PreferenceRepository.ts
│       ├── PresenceRepository.ts
│       ├── TransactionRepository.ts
│       └── UserRepository.ts
├── domain/
│   └── models/
│       ├── BookingModel.ts
│       ├── ChatModel.ts
│       ├── CompanionModel.ts
│       ├── NotificationModel.ts
│       ├── OnlineStatusModel.ts
│       ├── PreferenceModel.ts
│       ├── TopUpModel.ts
│       ├── UserModels.ts
│       └── WithdrawalModel.ts
├── store/
│   └── useBookingStore.ts
├── views/
│   ├── components/
│   │   ├── ActivityBooking/
│   │   │   ├── ActivityBooking.style.ts
│   │   │   └── ActivityBooking.tsx
│   │   ├── AddressInput/
│   │   │   ├── AddressInput.style.tsx
│   │   │   └── AddressInput.tsx
│   │   ├── Badge/
│   │   │   ├── Badge.style.ts
│   │   │   └── Badge.tsx
│   │   ├── ChatBubble/
│   │   │   ├── ChatBubble.style.ts
│   │   │   └── ChatBubble.tsx
│   │   ├── ChatInputBar/
│   │   │   ├── ChatInputBar.style.ts
│   │   │   └── ChatInputBar.tsx
│   │   ├── CheckInButton/
│   │   │   ├── CheckInButton.style.tsx
│   │   │   └── CheckInButton.tsx
│   │   ├── FriendList/
│   │   │   ├── FriendList.style.ts
│   │   │   └── FriendList.tsx
│   │   ├── GenderSelector/
│   │   │   ├── GenderSelector.style.ts
│   │   │   └── GenderSelector.tsx
│   │   ├── GeneralButton/
│   │   │   ├── GeneralButton.style.ts
│   │   │   └── GeneralButton.tsx
│   │   ├── InterestSelector/
│   │   │   ├── InterestSelector.style.ts
│   │   │   └── InterestSelector.tsx
│   │   ├── KycCard/
│   │   │   ├── KycCard.style.ts
│   │   │   └── KycCard.tsx
│   │   ├── LocationCard/
│   │   │   ├── LocationCard.style.ts
│   │   │   └── LocationCard.tsx
│   │   ├── NotificationBell/
│   │   │   ├── NotificationBell.style.ts
│   │   │   └── NotificationBell.tsx
│   │   ├── PersonaSelector/
│   │   │   ├── PersonaSelector.style.ts
│   │   │   └── PersonaSelector.tsx
│   │   ├── ProfilePicture/
│   │   │   ├── ProfilePicture.style.ts
│   │   │   └── ProfilePicture.tsx
│   │   ├── ProgressBar/
│   │   │   ├── ProgressBar.style.ts
│   │   │   └── ProgressBar.tsx
│   │   ├── ReviewCard/
│   │   │   ├── ReviewCard.style.ts
│   │   │   └── ReviewCard.tsx
│   │   ├── RoleCardToggle/
│   │   │   ├── RoleCardToggle.style.ts
│   │   │   └── RoleCardToggle.tsx
│   │   ├── ScheduleCard/
│   │   │   ├── ScheduleCard.style.ts
│   │   │   └── ScheduleCard.tsx
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.style.ts
│   │   │   └── SearchBar.tsx
│   │   ├── TimeInputBox/
│   │   │   ├── TimeInputBox.style.ts
│   │   │   └── TimeInputBox.tsx
│   │   ├── TimePicker/
│   │   │   ├── TimePicker.style.ts
│   │   │   └── TimePicker.tsx
│   │   ├── TimeSelector/
│   │   │   ├── TimeSelector.style.ts
│   │   │   └── TimeSelector.tsx
│   │   ├── UI/
│   │   │   ├── BookingStatusInChat/
│   │   │   │   ├── BookingStatusInChat.style.ts
│   │   │   │   └── BookingStatusInChat.tsx
│   │   │   ├── IconLabel/
│   │   │   │   ├── IconLabel.style.ts
│   │   │   │   ├── IconLabel.tsx
│   │   │   │   ├── MiniCard.style.ts
│   │   │   │   ├── MiniCard.tsx
│   │   │   │   ├── StatCard.style.ts
│   │   │   │   └── StatCard.tsx
│   │   │   ├── MoneyButton/
│   │   │   │   ├── MoneyButton.style.ts
│   │   │   │   └── MoneyButton.tsx
│   │   │   ├── StatusToggle/
│   │   │   │   ├── StatusToggle.style.ts
│   │   │   │   └── StatusToggle.tsx
│   │   │   ├── TabIcon/
│   │   │   │   └── TabIcon.tsx
│   │   │   └── UserProfile/
│   │   │       ├── UserProfile.style.ts
│   │   │       └── UserProfile.tsx
│   │   ├── UploadIMG/
│   │   │   ├── UploadIMG.style.ts
│   │   │   └── UploadIMG.tsx
│   │   ├── VerifyBadge/
│   │   │   ├── VerifyBadge.style.ts
│   │   │   └── VerifyBadge.tsx
│   │   └── WheelColumn/
│   │       ├── WheelColumn.style.ts
│   │       └── WheelColumn.tsx
│   ├── layouts/
│   │   ├── AuthLayout/
│   │   │   ├── AuthLayout.style.ts
│   │   │   └── AuthLayout.tsx
│   │   ├── ChatLayout/
│   │   │   ├── ChatLayout.style.ts
│   │   │   └── ChatLayout.tsx
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.style.ts
│   │   │   ├── MainLayout.tsx
│   │   │   └── MainLayoutCompanion.tsx
│   │   └── SecondaryLayout/
│   │       ├── SecondaryLayout.style.ts
│   │       └── SecondaryLayout.tsx
│   └── screens/
│       ├── Auth/
│       │   ├── AuthScreen.style.ts
│       │   └── AuthScreen.tsx
│       ├── Common/
│       │   ├── ChatScreen/
│       │   │   ├── ChatScreen.style.ts
│       │   │   └── ChatScreen.tsx
│       │   ├── ListChatScreen/
│       │   │   ├── ListChatScreen.style.ts
│       │   │   └── ListChatScreen.tsx
│       │   └── TemanJalan/
│       │       ├── TemanJalanScreen.style.ts
│       │       └── TemanJalanScreen.tsx
│       ├── Companion/
│       │   ├── DashboardCompanion/
│       │   │   ├── DashboardCompanion.style.ts
│       │   │   └── DashboardCompanion.tsx
│       │   ├── EditProfileCompanion/
│       │   │   ├── EditProfileCompanion.style.ts
│       │   │   └── EditProfileCompanion.tsx
│       │   ├── ProfileCompanion/
│       │   │   ├── ProfileCompanion.style.ts
│       │   │   └── ProfileCompanion.tsx
│       │   ├── UploadCVPhoneNumberScreen/
│       │   │   ├── UploadCVPhoneNumberScreen.style.ts
│       │   │   └── UploadCVPhoneNumberScreen.tsx
│       │   └── VerificationDataCompanionScreen/
│       │       ├── VerificationDataCompanionScreen.style.ts
│       │       └── VerificationDataCompanionScreen.tsx
│       ├── User/
│       │   ├── DashboardUserScreen/
│       │   │   ├── DashboardUserScreen.style.ts
│       │   │   └── DashboardUserScreen.tsx
│       │   ├── ProfileUserScreen/
│       │   │   ├── ProfileUserScreen.style.ts
│       │   │   └── ProfileUserScreen.tsx
│       │   └── VerificationDataUserScreen/
│       │       ├── VerificationDataUserScreen.style.ts
│       │       └── VerificationDataUserScreen.tsx
│       └── Verification/
│           ├── ChooseRoleScreen/
│           │   ├── ChooseRoleScreen.style.ts
│           │   └── ChooseRoleScreen.tsx
│           ├── UploadKTPScreen/
│           │   ├── UploadKTPScreen.style.ts
│           │   └── UploadKTPScreen.tsx
│           └── UploadSelfieKTPScreen/
│               ├── UploadSelfieKTPScreen.style.ts
│               └── UploadSelfieKTPScreen.tsx
├── .env.example
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── app.d.ts
├── app.json
├── declarations.d.ts
├── eslint.config.js
├── metro.config.js
├── package-lock.json
├── package.json
└── tsconfig.json
```
