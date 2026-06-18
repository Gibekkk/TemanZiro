import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/firebase_config';
import { UserSquare2 } from 'lucide-react';

export default function Login() {
  const { currentUser: user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-navy-900/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center relative z-10 border border-white/5">
        <div className="bg-primary-500 w-16 h-16 rounded-xl text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
          <span className="text-3xl font-bold font-sans tracking-tight">T</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Teman<span className="text-primary-500">Ziro</span></h1>
        <p className="text-slate-400 mb-8 text-sm">Sign in to manage the platform</p>
        
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-slate-800 px-6 py-3 rounded-lg transition-colors font-semibold shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
