'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '../../lib/axios';
import { LogOut, User as UserIcon, Settings, Mail, Pencil, Fingerprint, Circle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0b0c14] relative flex flex-col items-center overflow-x-hidden">
      <div className="page-bg" />
      <div className="page-glow" />

      {/* Navigation */}
      <header className="w-full max-w-[1200px] px-8 py-8 flex justify-between items-center z-50">
        {/* Left Side: Logo & Portfolio */}
        <div className="flex items-center gap-4">
          <div className="w-[42px] h-[42px] bg-[#161722]/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-2.5 h-2.5 bg-[#60a5fa] rounded-full shadow-[0_0_12px_#60a5fa]" />
          </div>
          <span className="text-[18px] font-bold text-white tracking-tight">Portfolio</span>
        </div>

        {/* Right Side: User Pill & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-3 pr-5 py-2 bg-[#161722]/40 backdrop-blur-md border border-white/10 rounded-[20px] shadow-lg">
            <div className="w-8 h-8 rounded-full bg-[#3b3c54] flex items-center justify-center border border-white/5">
              <UserIcon className="text-[#a5b4fc]" size={16} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] font-semibold text-white/90 leading-tight mb-[2px]">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-none">
                {user?.roles?.map((r: any) => r.name).join(', ') || 'USER'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-[42px] h-[42px] flex items-center justify-center bg-[#161722]/40 backdrop-blur-md border border-white/10 rounded-xl text-white/50 hover:text-white transition-all shadow-lg hover:bg-white/5 active:scale-95"
            title="Logout"
          >
            <LogOut size={18} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[580px] px-6 mt-12 flex flex-col items-center z-10">
        <div className="w-full bg-[#161722]/50 backdrop-blur-[24px] border border-white/10 rounded-[28px] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3 mb-10">
            <Settings className="text-[#60a5fa]" size={22} />
            <h2 className="text-[18px] font-bold text-white tracking-tight">Profile Summary</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 ml-1">
                <Mail className="text-white/30" size={14} />
                <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold">Email</span>
              </div>
              <div className="bg-[#1a1b26]/50 p-4 px-5 rounded-xl border border-white/5 shadow-inner">
                <p className="text-[14px] font-medium text-white/90 truncate tracking-wide">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 ml-1">
                <Fingerprint className="text-white/30" size={14} />
                <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold">User ID</span>
              </div>
              <div className="bg-[#1a1b26]/50 p-4 px-5 rounded-xl border border-white/5 shadow-inner">
                <p className="text-[12px] text-white/50 truncate font-mono tracking-wider">
                  {user?.id}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 ml-1">
                <Circle className="text-white/30" size={14} />
                <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold">Status</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full w-fit">
                <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]" />
                <span className="text-[11px] font-bold text-[#10b981] tracking-widest uppercase">Active</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/profile')}
            className="w-full h-[56px] mt-12 bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] rounded-xl flex items-center justify-center gap-2 text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
          >
            <Pencil size={18} />
            Edit Profile
          </button>
        </div>

        <div className="mt-14 opacity-30">
          <p className="text-[9px] text-white font-bold tracking-[0.25em] uppercase">
            Protected by AES-256 Encryption
          </p>
        </div>
      </main>
    </div>
  );
}
