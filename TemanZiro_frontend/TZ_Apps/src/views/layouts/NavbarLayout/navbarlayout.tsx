import { Outlet } from "react-router-dom";
import BottomNavbar from "@/views/components/Navbar/navbar";
import { useAuth } from "@/controllers/hooks/useAuth";
import LoadingScreen from "@/views/components/LoadingScreen/loadingscreen";

export default function NavbarLayout() {
  const { role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Map role from AuthContext to navbar role
  const navbarRole =
    role === "booker" ? "user" : role === "companion" ? "companion" : "user"; // default to user if null

  return (
    <>
      <Outlet />
      <BottomNavbar role={navbarRole} />
    </>
  );
}
