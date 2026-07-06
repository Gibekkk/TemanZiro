import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
// ✅ BUG-10: Hapus OnlineStatusProvider — duplikat logic dari AuthContext,
//    useOnlineStatus() tidak dipakai di mana pun di codebase
// import { OnlineStatusProvider } from './contexts/OnlineContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Companions from './pages/Companions';
import TopUps from './pages/TopUps';
import Withdraws from './pages/Withdraws';

export default function App() {
  return (
    <AuthProvider>
      {/* OnlineStatusProvider dihapus — online status sudah dihandle AuthContext */}
      <BrowserRouter basename="/TemanZiro">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="companions" element={<Companions />} />
            <Route path="topups" element={<TopUps />} />
            <Route path="withdraws" element={<Withdraws />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}