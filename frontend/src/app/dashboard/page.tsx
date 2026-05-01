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
    <div className="min-h-screen pb-20 flex flex-col items-center relative">
      <div className="page-bg" />
      <div className="page-glow" />

      {/* Navigation */}
      <header className="w-full max-w-[1400px] px-12 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="icon-box !m-0 !w-[42px] !h-[42px] !rounded-xl !bg-[#1e1f2e]/80">
            <div className="dot-icon !w-2 !h-2" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Portfolio</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 px-5 py-2.5 bg-[#1a1b26]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
            <div className="w-9 h-9 rounded-full bg-[#3b3c54] flex items-center justify-center border border-white/5">
              <UserIcon className="text-white/80" size={18} />
            </div>
            <div className="pr-2">
              <p className="text-[14px] font-bold text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">
                {user?.roles?.map((r: any) => r.name).join(', ')}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-11 h-11 flex items-center justify-center bg-[#1a1b26]/80 backdrop-blur-xl border border-white/10 rounded-xl text-white/40 hover:text-white transition-all shadow-xl hover:bg-white/5"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content - Concentrated for the "Profile Summary" look */}
      <main className="w-full max-w-[560px] px-6 mt-16 z-10">
        <div className="auth-card !w-full !min-h-0 !py-12 !px-10 !bg-[#161722]/80 !rounded-[32px] !border-white/10">
          <div className="flex items-center gap-3 mb-10">
            <Settings className="text-[#60a5fa]" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">Profile Summary</h2>
          </div>

          <div className="space-y-8">
            <div className="group">
              <div className="flex items-center gap-2.5 mb-3">
                <Mail className="text-white/30 group-hover:text-[#60a5fa] transition-colors" size={15} />
                <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-black">Email</p>
              </div>
              <div className="bg-[#1e1f2e]/60 p-4.5 px-6 rounded-2xl border border-white/5 group-hover:border-[#60a5fa]/20 transition-all">
                <p className="text-[15px] font-medium text-white/90 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="group">
              <div className="flex items-center gap-2.5 mb-3">
                <Fingerprint className="text-white/30 group-hover:text-[#60a5fa] transition-colors" size={15} />
                <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-black">User ID</p>
              </div>
              <div className="bg-[#1e1f2e]/60 p-4.5 px-6 rounded-2xl border border-white/5 group-hover:border-[#60a5fa]/20 transition-all">
                <p className="text-[12px] text-white/40 truncate font-mono tracking-wider">
                  {user?.id}
                </p>
              </div>
            </div>

            <div className="group">
              <div className="flex items-center gap-2.5 mb-3">
                <Circle className="text-white/30 group-hover:text-[#10b981] transition-colors" size={15} />
                <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-black">Status</p>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full w-fit">
                <span className="w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]" />
                <span className="text-[11px] font-black text-[#10b981] tracking-wide uppercase">Active</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/profile')}
            className="btn-submit !h-[60px] !mt-12 !flex items-center justify-center gap-3 !rounded-2xl !text-[16px] !font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_10px_25px_rgba(147,51,234,0.3)]"
          >
            <Pencil size={20} />
            Edit Profile
          </button>
        </div>

        <div className="w-full flex justify-center mt-16">
          <p className="aes-text !m-0">Protected by AES-256 Encryption</p>
        </div>
      </main>
    </div>
  );
}
