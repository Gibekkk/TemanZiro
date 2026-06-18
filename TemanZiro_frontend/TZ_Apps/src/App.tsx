import LoadingScreen from "@/views/components/LoadingScreen/loadingscreen";
import OnBoarding1Page from "./views/pages/Auth/Onboarding/onboarding1_page";
import OnBoarding2Page from "./views/pages/Auth/Onboarding/onboarding2_page";
import Dashboard from "./views/pages/User/Dashboard/dashboard";
import LoginRegistPage from "./views/pages/Auth/Login/login_page";
import DataScreenRolePage from "./views/pages/Auth/RoleDataScreen/rolescreen_page";
import DataScreenKTPPage from "./views/pages/Auth/KTPDataScreen/ktpscreen_page";
import DataScreenSelfieKTPPage from "./views/pages/Auth/SelfieKTPDataScreen/selfiektpscreen_page";
import UserDataScreenPage from "./views/pages/User/UserDataScreen/userdatascreen_page";
import SetPreferenceScreenPage from "./views/pages/User/SetPrefrence/setpreference_page";
import MatchRequestPage from "./views/pages/User/MatchRequest/matchrequest_page";
import MatchFoundPage from "./views/pages/User/MatchFound/matchfound_page";
import ListChatPage from "./views/pages/User/ListChat/listchat";
import HistoriPage from "./views/pages/User/TemanJalan/temanjalan_page";
import ProfilePage from "./views/pages/User/Profile/profile_page";
import ChatRoom from "./views/pages/User/ChatMessage/chatmessage";
import NavbarLayout from "./views/layouts/NavbarLayout/navbarlayout";
import MatchConfirmationPage from "./views/pages/User/MatchConfirmation/matchconfirm_page";
import EditProfilePage from "./views/pages/User/EditProfile/editprofil";
import ListBookingsPage from "./views/pages/User/ListBookings/listbookings";
import DetailPendPage from "./views/pages/User/DetailBookingPend/detailpend";
import DetailDonePage from "./views/pages/User/DetailBookingDone/detaildone";
import DetailDayPage from "./views/pages/User/DetailDayofSession/detailday";
import OnGoingSessionPage from "./views/pages/User/OnGoingSession/ongoingsession";
import LiveSessionPage from "./views/pages/User/LiveSession/livesession";
import ReflectionPage from "./views/pages/User/Reflection/reflection";
import { Routes, Route } from "react-router-dom";
import CompanionDataScreenPage from "./views/pages/Companion/CompanionDataScreen/companiondatascreen_page";
import DashboardCompanion from "./views/pages/Companion/Dashboard/dashboard";
import ProfileCompanionPage from "./views/pages/Companion/Profile/profile_page";
import OnBoarding3Page from "./views/pages/Auth/Onboarding/onboarding3_page";
import CompanionProfilePage1 from "./views/pages/User/CompanionProfile/companionprofile_page";
import EditProfileCompanionPage from "./views/pages/Companion/EditProfileCompanion/editprofilcompanion";
import TemanJalanCompanionPage from "./views/pages/Companion/TemanJalan/temanjalan_page";
import DetailPendCompanionPage from "./views/pages/Companion/DetailBookingPend/detailpend";
import MoneyPage from "./views/pages/Companion/Money/money";
import PencairanDonePage from "./views/pages/Companion/PencairanDone/pencairandone";
import FormPencairanPage from "./views/pages/Companion/FormPencairan/formpencairan";
import NotifciationPage from "./views/pages/Companion/Notification/notification";
import MoneyUserPage from "./views/pages/User/MoneyTopup/moneytopup";
import FormTopupMoneyPage from "./views/pages/User/FormTopup/formtopup";
import TopupDonePage from "./views/pages/User/TopupDone/topupdone";

// import EditProfilePage from ""

export default function App() {
  const isLoading = false;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* <OnBoarding1Page /> */}
      {/* <OnBoarding2Page /> */}
      {/* <OnBoarding3Page /> */}
      {/* <LoginRegistPage /> */}
      {/* <DataScreenRolePage /> */}
      {/* <DataScreenKTPPage /> */}
      {/* <DataScreenSelfieKTPPage /> */}
      {/* <UserDataScreenPage /> */}
      {/* <SetPreferenceScreenPage /> */}
      {/* <MatchRequestPage /> */}
      {/* <MatchFoundPage /> */}
      {/* <CompanionProfilePage title='Profil Companion'/> */}
      {/* <MatchConfirmationPage /> */}
      {/* <SuccesPaymentPage /> */}

      {/* <DashboardLayout /> */}

      <Routes>
        <Route path="/" element={<OnBoarding1Page />} />
        <Route path="/onboarding-2" element={<OnBoarding2Page />} />
        <Route path="/onboarding-3" element={<OnBoarding3Page />} />

        {/* User */}
        <Route path="/login" element={<LoginRegistPage />} />
        <Route path="/data-screen-role" element={<DataScreenRolePage />} />
        <Route path="/data-screen-ktp" element={<DataScreenKTPPage />} />
        <Route
          path="/companion-profile"
          element={<CompanionProfilePage1 title="Profil Companion" />}
        />
        <Route
          path="/data-screen-selfie-ktp"
          element={<DataScreenSelfieKTPPage />}
        />
        <Route path="/user-data-screen" element={<UserDataScreenPage />} />
        <Route path="/set-preference" element={<SetPreferenceScreenPage />} />
        <Route path="/match-request" element={<MatchRequestPage />} />
        <Route path="/match-found" element={<MatchFoundPage />} />
        <Route path="/match-confirmation" element={<MatchConfirmationPage />} />
        <Route path="/room-chat" element={<ChatRoom />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/list-bookings" element={<ListBookingsPage />} />
        <Route path="/detail-booking-pend" element={<DetailPendPage />} />
        <Route path="/detail-booking-done" element={<DetailDonePage />} />
        <Route path="/detail-day" element={<DetailDayPage />} />
        <Route path="/ongoing-session" element={<OnGoingSessionPage />} />
        <Route path="/live-session" element={<LiveSessionPage />} />
        <Route path="/reflection" element={<ReflectionPage />} />
        <Route
          path="/companion-data-screen"
          element={<CompanionDataScreenPage />}
        />
        <Route
          path="/topup-money"
          element={<MoneyUserPage />}
        />
        <Route
          path="/form-topup-money"
          element={<FormTopupMoneyPage />}
        />
        <Route
          path="/topup-done"
          element={<TopupDonePage />}
        />

        {/* ======================================= */}
        {/* RUTE DENGAN NAVBAR KHUSUS USER          */}
        {/* ======================================= */}
        <Route element={<NavbarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/list-chat" element={<ListChatPage />} />
          <Route path="/friends-page" element={<HistoriPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/edit-profile-companion"
          element={<EditProfileCompanionPage />}
        />

        <Route
          path="/detailpend-companion"
          element={<DetailPendCompanionPage />}
        />

        <Route
          path="/money-pages"
          element={<MoneyPage />}
        />

        <Route
          path="/pencairan-done"
          element={<PencairanDonePage />}
        />

        <Route
          path="/form-pencairan"
          element={<FormPencairanPage />}
        />

        <Route
          path="/notification"
          element={<NotifciationPage />}
        />

        {/* ======================================= */}
        {/* RUTE DENGAN NAVBAR KHUSUS COMPANION     */}
        {/* ======================================= */}
        <Route element={<NavbarLayout />}>
          <Route path="/companion-dashboard" element={<DashboardCompanion />} />
          <Route
            path="/temanjalan-companion"
            element={<TemanJalanCompanionPage />}
          />
          <Route path="/profile-companion" element={<ProfileCompanionPage />} />
        </Route>
      </Routes>
    </>
  );
}
