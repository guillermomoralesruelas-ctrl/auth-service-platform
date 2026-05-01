'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { api } from '../../lib/axios';
import { LogOut, User as UserIcon, Settings, Mail, Fingerprint, Edit3, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/users/me');
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      localStorage.removeItem('user_id');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0c14]">
        <div className="page-bg" />
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="page-bg" />
      <div className="page-glow" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="icon-box !w-10 !h-10 !m-0">
            <div className="dot-icon !w-2 !h-2" />
          </div>
          <span className="logo-text">Portfolio</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="user-chip">
            <div className="avatar-box">
              <UserIcon size={18} />
            </div>
            <div className="user-info-text">
              <h4>{user?.firstName} {user?.lastName}</h4>
              <p>{user?.roles?.map((r: any) => r.name).join(', ')}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center w-full px-4">
        <div className="auth-card !min-h-0 !py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="avatar-box !bg-transparent !border-none !w-auto !h-auto">
              <Settings className="text-[#60a5fa]" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Profile Summary</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={14} className="text-[#64748b]" />
                <label className="label-text !m-0 !text-[11px] uppercase tracking-widest font-bold">Email</label>
              </div>
              <div className="input-container !m-0">
                <input 
                  type="text" 
                  value={user?.email || ''} 
                  readOnly 
                  className="input-styled input-readonly !pl-6" 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint size={14} className="text-[#64748b]" />
                <label className="label-text !m-0 !text-[11px] uppercase tracking-widest font-bold">User ID</label>
              </div>
              <div className="input-container !m-0">
                <input 
                  type="text" 
                  value={user?.id || ''} 
                  readOnly 
                  className="input-styled input-readonly !pl-6 !text-[12px] font-mono" 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full border border-[#64748b] flex items-center justify-center">
                   <div className="w-1 h-1 bg-[#64748b] rounded-full" />
                </div>
                <label className="label-text !m-0 !text-[11px] uppercase tracking-widest font-bold">Status</label>
              </div>
              <div className="badge-active">
                <div className="dot-pulse" />
                Active
              </div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/profile')}
            className="btn-submit !mt-10 flex items-center justify-center gap-2"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>
      </main>

      <p className="aes-text !fixed !bottom-10">Protected by AES-256 Encryption</p>
    </div>
  );
}
