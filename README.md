# TemanZiro Requirement
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


# TemanZiro Spec Driven Development (SDD)  
```text
TemanZiro/
├── app/
│   ├── auth/
│   │   └── AuthCall.tsx
│   ├── verification/
│   │   ├── 
│   ├── onboarding/
│   │   ├── 
│   ├── user/
│   │   ├── 
│   ├── companion/
│   │   ├── 
│   ├── _layout.tsx
│   └── index.tsx
├── assets/
├── constants/
│   ├── BookingDetails.ts
│   ├── CompanionRating.ts
│   ├── MoneyDetails.ts
│   ├── Notification.ts
│   ├── UserDetails.ts
│   └── Theme.ts
├── controllers/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── MapContext.tsx
│   │   ├── PresenceContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── UserProfileContext.tsx
│   └── hooks/
│       ├── useAuth.ts
│       ├── useMaps.ts
│       ├── useMapLocation.ts
│       ├── usePresence.ts
│       ├── useTheme.ts
│       └── useUserProfile.ts
├── data/
│   ├── config/
│   │   └──FirebaseConfig.ts
│   └── repositories/
│       ├── utils/
│       │   └── UploadFiles.ts
│       ├── BookingRepository.ts
│       ├── ChatRepository.ts    
│       ├── CompanionRepository.ts
│       ├── CvRepository.ts
│       ├── KycRepository.ts
│       ├── LoginRepository.ts
│       ├── MapRepository.ts
│       ├── NotificationRepository.ts
│       ├── PreferenceRepository.ts
│       ├── SessionRepository.ts
│       ├── TopUpRepository.ts
│       ├── UserRepository.ts
│       └── WithdrawalRepository.ts
├── domain/
│   └── models/
│       ├── BookingModel.ts
│       ├── ChatModel.ts
│       ├── CompanionModel.ts
│       ├── NotificationModel.ts
│       ├── PreferenceModel.ts
│       ├── TopUpModel.ts
│       ├── UserModel.ts
│       └── WithdrawalModel.ts
├── views/
│   ├──components/
│   │    ├──ActivityBoooking/
│   │    │  ├──ActivityBooking.tsx
│   │    │  └──ActivityBooking.styles.ts
│   │    ├──ActivityListView/
│   │    │  ├──ActivityListView.tsx
│   │    │  └──ActivityListView.styles.ts
│   │    ├──ActivityTag/
│   │    │  ├──ActivityTag.tsx
│   │    │  └──ActivityTag.styles.ts
│   │    ├──ActivityTagList/
│   │    │  ├──ActivityTagList.tsx
│   │    │  └──ActivityTagList.styles.ts
│   │    ├──Badge/
│   │    │  ├──Badge.tsx
│   │    │  └──Badge.styles.ts
│   │    ├──BalanceModal/
│   │    │  ├──BalanceModal.tsx
│   │    │  └──BalanceModal.styles.ts
│   │    ├──BottomBar/
│   │    │  ├──BottomBar.tsx
│   │    │  └──BottomBat.styles.ts
│   │    ├──ScanQRCamera/
│   │    │  ├──ScanQRCamera.tsx
│   │    │  └──ScanQRCamera.styles.ts
│   │    ├──ChatItem/
│   │    │  ├──ChatItem.tsx
│   │    │  └──ChatItem.styles.ts
│   │    ├──CheckInButton/
│   │    │  ├──CheckInButton.tsx
│   │    │  └──CheckInButton.styles.ts
│   │    ├──DatePicker/
│   │    │  ├──DatePicker.tsx
│   │    │  └──DatePicker.styles.ts
│   │    ├──FriendList/
│   │    │  ├──FriendList.tsx
│   │    │  └──FriendList.styles.ts
│   │    ├──GenderToggle/
│   │    │  ├──GenderToggle.tsx
│   │    │  └──GenderToggle.styles.ts
│   │    ├──GeneralButton/
│   │    │  ├──GeneralButton.tsx
│   │    │  └──GeneralButton.styles.ts
│   │    ├──ImagePreviewCard/
│   │    │  ├──ImagePreviewCard.tsx
│   │    │  └──ImagePreviewCard.styles.ts
│   │    ├──InProgressCard/
│   │    │  ├──InProgressCard.tsx
│   │    │  └──InProgressCard.styles.ts
│   │    ├──InterestSelector/
│   │    │  ├──InterestSelector.tsx
│   │    │  └──InterestSelector.styles.ts
│   │    ├──KYCCard/
│   │    │  ├──KYCCard.tsx
│   │    │  └──KYCCard.styles.ts
│   │    ├──LoadingScreen/
│   │    │  ├──LoadingScreen.tsx
│   │    │  └──LoadingScreen.styles.ts
│   │    ├──LocationCard/
│   │    │  ├──LocationCard.tsx
│   │    │  └──LocationCard.styles.ts
│   │    ├──LoginContent/
│   │    │  ├──LoginContent.tsx
│   │    │  └──LoginContent.styles.ts
│   │    ├──MoneyButtonNavigate/
│   │    │  ├──MoneyButtonNavigate.tsx
│   │    │  └──MoneyButtonNavigate.styles.ts
│   │    ├──NotificationCard/
│   │    │  ├──NotificationCard.tsx
│   │    │  └──NotificationCard.styles.ts
│   │    ├──OnBoardingScreen/
│   │    │  ├──OnBoardingScreen.tsx
│   │    │  └──OnBoardingScreen.styles.ts
│   │    ├──PhilopsophyCard/
│   │    │  ├──PhilosophyCard.tsx
│   │    │  └──PhilosophyCard.styles.ts
│   │    ├──ProgressBar/
│   │    │  ├──ProgressBar.tsx
│   │    │  └──ProgressBar.styles.ts
│   │    ├──Profile/
│   │    │  ├──Profile.tsx
│   │    │  └──Profile.styles.ts
│   │    ├──QRCodeModal/
│   │    │  ├──QRCodeModal.tsx
│   │    │  └──QRCodeModal.styles.ts
│   │    ├──RangeAgeBooking/
│   │    │  ├──RangeAgeBooking.tsx
│   │    │  └──RangeAgeBooking.styles.ts
│   │    ├──RatingReview/
│   │    │  ├──RatingReview.tsx
│   │    │  └──RatingReview.styles.ts
│   │    ├──ReviewCard/
│   │    │  ├──ReviewCard.tsx
│   │    │  └──ReviewCard.styles.ts
│   │    ├──RoleCardToggle/
│   │    │  ├──RoleCardToggle.tsx
│   │    │  └──RoleCardToggle.styles.ts
│   │    ├──ScheduledCard/
│   │    │  ├──ScheduledCard.tsx
│   │    │  └──ScheduledCard.styles.ts
│   │    ├──SOSButton/
│   │    │  ├──SOSButton.tsx
│   │    │  └──SOSButton.styles.ts
│   │    ├──SearchBar/
│   │    │  ├──SearchBar.tsx
│   │    │  └──SearchBar.styles.ts
│   │    ├──TimeSelector/
│   │    │  ├──TimeSelector.tsx
│   │    │  └──TimeSelector.styles.ts
│   │    ├──TimePicker/
│   │    │  ├──TimePicker.tsx
│   │    │  └──TimePicker.styles.ts
│   │    ├──UploadIMG/
│   │    │  ├──UploadIMG.tsx
│   │    │  └──UploadIMG.styles.ts
│   │    ├──VerifiedBadge/
│   │    │  ├──VerifiedBadge.tsx
│   │    │  └──VerifiedBadge.styles.ts
│   │    ├──WalletCard/
│   │    │  ├──WalletCard.tsx
│   │    │  └──WalletCard.styles.ts
│   │    ├──TopupRequestModal/
│   │    │  ├──TopupRequestModal.tsx
│   │    │  └──TopupRequestModal.styles.ts
│   │    └──UI/
│   │       ├──IconLabel/
│   │       │  ├──IconLabel.tsx
│   │       │  └──IconLabel.styles.ts
│   │       └──
│   ├──layouts/
│   │     ├──AuthLayout/
│   │     │  ├──AuthLayout.tsx
│   │     │  └──AuthLayout.styles.ts
│   └──screens/
│        ├──Auth/
│        │  ├──AuthScreen.tsx
│        │  └──AuthScreen.styles.ts
│        ├──Verification/
│        │  ├──ChooseRoleScreen/
│        │  │    ├──ChooseRoleScreen.tsx
│        │  │    └──ChooseRoleScreen.style.ts
│        │  ├──UploadKTPScreen/
│        │  │    ├──UploadKTPScreen.tsx
│        │  │    └──UploadKTPScreen.style.ts
│        │  └──UploadSelfieKTPScreen/
│        │       ├──UploadSelfieKTPScreen.tsx
│        │       └──UploadSelfieKTPScreen.style.ts
│        ├──Onboarding/
│        │  ├──OnBoarding1Screen.tsx
│        │  ├──OnBoarding2Screen.tsx
│        │  ├──OnBoarding3Screen.tsx
│        │  └──OnBoarding.styles.ts
│        ├──Common/
│        │  ├──ChatMassageScreen/
│        │  │    ├──ChatMassageScreen.tsx
│        │  │    └──ChatMassageScreen.style.ts
│        │  ├──ListTemanJalanScreen/
│        │  │    ├──ListTemanJalanScreen.tsx
│        │  │    └──ListTemanJalanScreen.style.ts
│        │  ├──TemanJalanScreen/
│        │  │    ├──TemanJalanScreen.tsx
│        │  │    └──TemanJalanScreen.style.ts
│        │  └──MoneyScreen/
│        │       ├──MoneyScreen.tsx
│        │       └──MoneyScreen.style.ts
│        ├──User/
│        │  ├──VerificationDataUserScreen/
│        │  │    ├──VerificationDataUserScreen.tsx
│        │  │    └──VerificationDataUserScreen.style.ts
│        │  ├──DashboardUserScreen/
│        │  │    ├──DashboardUserScreen.tsx
│        │  │    └──DashboardUserScreen.style.ts
│        │  ├──BookingTemanJalanScreen/
│        │  │    ├──BookingTemanJalanScreen.tsx
│        │  │    └──BookingTemanJalanScreen.style.ts
│        │  ├──ViewProfileTemanJalanScreen/
│        │  │    ├──ViewProfileTemanJalanScreenn.tsx
│        │  │    └──ViewProfileTemanJalanScreen.style.ts
│        │  ├──PendingSessionScreen/
│        │  │    ├──PendingSessionScreen.tsx
│        │  │    └──PendingSessionScreen.style.ts
│        │  ├──FindSessionScreen/
│        │  │    ├──FindSessionScreen.tsx
│        │  │    └──FindSessionScreen.style.ts
│        │  ├──ConfirmationSessionScreen/
│        │  │    ├──ConfirmationSessionScreen.tsx
│        │  │    └──ConfirmationSessionScreen.style.ts
│        │  ├──OngoingSessionScreen/
│        │  │    ├──OngoingSessionScreen.tsx
│        │  │    └──OngoingSessionScreen.style.ts
│        │  ├──CompletedSessionScreen/
│        │  │    ├──CompletedSessionScreen.tsx
│        │  │    └──CompletedSessionScreen.style.ts
│        │  ├──ReflectionSession/
│        │  │    ├──ReflectionSession.tsx
│        │  │    └──ReflectionSession.style.ts
│        │  ├──CanceledSessionScreen/
│        │  │    ├──CanceledSessionScreen.tsx
│        │  │    └──CanceledSessionScreen.style.ts
│        │  ├──EditProfileUserScreen/
│        │  │    ├──EditProfileUserScreen.tsx
│        │  │    └──EditProfileUserScreen.style.ts
│        │  ├──FormTopUpMoneyUserScreen/
│        │  │    ├──FormTopUpMoneyUserScreen.tsx
│        │  │    └──FormTopUpMoneyUserScreen.style.ts
│        │  ├──MatchRequestScreen/
│        │  │    ├──MatchRequestScreen.tsx
│        │  │    └──MatchRequestScreen.style.ts
│        │  ├──MatchFoundScreen/
│        │  │    ├──MatchFoundScreen.tsx
│        │  │    └──MatchFoundScreen.style.ts
│        │  ├──ProfileUserScreen/
│        │  │    ├──ProfileUserScreen.tsx
│        │  │    └──ProfileUserScreen.style.ts
│        │  ├──TemanJalanSuccesFoundScreen/
│        │  │    ├──TemanJalanSuccesFoundScreen.tsx
│        │  │    └──TemanJalanSuccesFoundScreen.style.ts
│        │  ├──MoneyTopupScreen/
│        │  │    ├──MoneyTopupScreen.tsx
│        │  │    └──MoneyTopupScreen.style.ts
│        │  └──TopupHistoryScreen/
│        │       ├──TopupHistoryScreen.tsx
│        │       └──TopupHistoryScreen.style.ts
│        └──Companion/
│           ├──VerificationDataCompanionScreen/
│           │    ├──VerificationDataCompanionScreen.tsx
│           │    └──VerificationDataCompanionScreen.style.ts
│           ├──DashboardCompanionScreen/
│           │    ├──DashboardCompanionScreen.tsx
│           │    └──DashboardCompanionScreen.style.ts
│           ├──PendingSessionScreen/
│           │    ├──PendingSessionScreen.tsx
│           │    └──PendingSessionScreen.style.ts
│           ├──EditProfileCompanionScreen/
│           │    ├──EditProfileCompanionScreen.tsx
│           │    └──EditProfileCompanionScreen.style.ts
│           ├──FormWithdrawalScreen/
│           │    ├──FormWithdrawalScreen.tsx
│           │    └──FormWithdrawalScreen.style.ts
│           ├──NotificationScreen/
│           │    ├──NotificationScreen.tsx
│           │    └──NotificationScreen.style.ts
│           ├──WithdrawalHistoryScreen/
│           │    ├──WithdrawalHistoryScreen.tsx
│           │    └──WithdrawalHistoryScreen.style.ts
│           └──ProfileCompanionScreen/
│                ├──ProfileCompanionScreen.tsx
│                └──ProfileCompanionScreen.style.ts
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```
