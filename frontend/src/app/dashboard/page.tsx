'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '../../lib/axios';
import { LogOut, User as UserIcon, Settings, Mail, Pencil, Fingerprint, CircleDot } from 'lucide-react';

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
        <div className="w-16 h-16 border-4 border-[#60a5fa]/20 border-t-[#60a5fa] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0c14] relative overflow-hidden font-sans text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,#0b0c14_75%)]"></div>
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-[#161722]/30">
          <div className="max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-[14px] bg-[#161722] border border-white/10 flex items-center justify-center shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] shadow-[0_0_12px_#60a5fa]"></div>
              </div>
              <span className="text-[18px] font-bold tracking-tight">Portfolio</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 pl-3 pr-5 py-2 rounded-full bg-[#161722]/60 border border-white/10 backdrop-blur-md shadow-lg">
                <div className="w-8 h-8 rounded-full bg-[#3b3c54] border border-white/5 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-[#a5b4fc]" />
                </div>
                <div className="leading-tight flex flex-col justify-center">
                  <div className="text-[13px] font-semibold text-white/90 mb-[2px]">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                    {user?.roles?.map((r: any) => r.name).join(', ') || 'USER'}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                title="Sign out"
                className="w-[42px] h-[42px] rounded-[14px] bg-[#161722]/60 border border-white/10 hover:bg-white/10 hover:text-white text-white/50 flex items-center justify-center transition-all shadow-lg active:scale-95"
              >
                <LogOut className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center flex-grow w-full">
          <section className="w-full max-w-[580px] backdrop-blur-[32px] bg-[#161722]/60 border border-white/10 rounded-[28px] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3 mb-10">
              <Settings className="w-5 h-5 text-[#60a5fa]" />
              <h2 className="text-[18px] font-bold tracking-tight">Profile Summary</h2>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 ml-1 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                  <Mail className="w-3.5 h-3.5" /> Email
                </div>
                <div className="px-5 py-4 rounded-xl bg-[#0b0c14]/50 border border-white/5 text-white/90 font-medium text-[14px] truncate shadow-inner">
                  {user?.email}
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 ml-1 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                  <Fingerprint className="w-3.5 h-3.5" /> User ID
                </div>
                <div className="px-5 py-4 rounded-xl bg-[#0b0c14]/50 border border-white/5 text-white/50 font-mono text-[12px] truncate shadow-inner tracking-wider">
                  {user?.id}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 ml-1 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                  <CircleDot className="w-3.5 h-3.5" /> Status
                </div>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]"></span>
                  <span className="text-[11px] font-bold text-[#10b981] tracking-widest uppercase">Active</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push('/profile')}
              className="w-full mt-12 h-[56px] bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] text-white rounded-xl text-[15px] font-bold hover:scale-[1.01] active:scale-[0.99] shadow-[0_10px_20px_rgba(139,92,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          </section>

          <p className="text-[9px] text-white/30 font-bold text-center mt-14 tracking-[0.25em] uppercase">
            PROTECTED BY AES-256 ENCRYPTION
          </p>
        </div>
      </div>
    </main>
  );
}
