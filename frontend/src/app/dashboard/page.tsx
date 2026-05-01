'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '../../lib/axios';
import { LogOut, User as UserIcon, Settings, Mail, Shield, Pencil, Fingerprint, Circle } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="page-bg" />
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c14] relative overflow-hidden flex flex-col items-center">
      <div className="page-bg" />
      <div className="page-glow" />

      {/* Navigation */}
      <header className="w-full max-w-[1440px] px-12 py-10 flex justify-between items-start z-50">
        <div className="flex items-center gap-4">
          <div className="w-[44px] h-[44px] bg-[#1a1b26]/80 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center shadow-2xl">
            <div className="w-2.5 h-2.5 bg-[#60a5fa] rounded-full shadow-[0_0_15px_#60a5fa]" />
          </div>
          <span className="text-[20px] font-bold text-white tracking-tight">Portfolio</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 pl-5 pr-6 py-2.5 bg-[#1a1b26]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <div className="w-9 h-9 rounded-full bg-[#3b3c54] flex items-center justify-center border border-white/5">
              <UserIcon className="text-white/80" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-white leading-none mb-1">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-none">
                {user?.roles?.map((r: any) => r.name).join(', ')}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-11 h-11 flex items-center justify-center bg-[#1a1b26]/80 backdrop-blur-xl border border-white/10 rounded-xl text-white/40 hover:text-white transition-all shadow-2xl hover:bg-white/5 active:scale-95"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-lg px-6 flex flex-col items-center mt-6 z-10">
        <div className="w-full bg-[#161722]/60 backdrop-blur-[32px] border border-white/10 rounded-[32px] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 mb-12">
            <Settings className="text-[#60a5fa]" size={26} />
            <h2 className="text-[22px] font-bold text-white tracking-tight">Profile Summary</h2>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 ml-1">
                <Mail className="text-white/20" size={16} />
                <span className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-black">Email</span>
              </div>
              <div className="bg-[#0b0c14]/40 p-5 px-7 rounded-2xl border border-white/5 shadow-inner">
                <p className="text-[15px] font-medium text-white/90 truncate tracking-wide">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 ml-1">
                <Fingerprint className="text-white/20" size={16} />
                <span className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-black">User ID</span>
              </div>
              <div className="bg-[#0b0c14]/40 p-5 px-7 rounded-2xl border border-white/5 shadow-inner">
                <p className="text-[12px] text-white/40 truncate font-mono tracking-wider">
                  {user?.id}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 ml-1">
                <Circle className="text-white/20" size={16} />
                <span className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-black">Status</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full w-fit shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <div className="w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_12px_#10b981]" />
                <span className="text-[11px] font-black text-[#10b981] tracking-widest uppercase">Active</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/profile')}
            className="w-full h-[64px] mt-14 bg-gradient-to-r from-[#9333ea] to-[#06b6d4] rounded-2xl flex items-center justify-center gap-3 text-[16px] font-bold text-white shadow-[0_15px_30px_rgba(147,51,234,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Pencil size={20} />
            Edit Profile
          </button>
        </div>

        <div className="mt-16 opacity-20">
          <p className="text-[10px] text-white font-black tracking-[0.3em] uppercase">
            Protected by AES-256 Encryption
          </p>
        </div>
      </main>
    </div>
  );
}
