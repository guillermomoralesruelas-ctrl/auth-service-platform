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
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a14]">
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a14] relative overflow-hidden font-sans text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/25 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,#0a0a14_75%)]"></div>
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full rounded-[7px] bg-[#0a0a14] flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-violet-400 to-cyan-300"></div>
                </div>
              </div>
              <span className="text-sm font-semibold tracking-tight">Portfolio</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/40 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[10px] text-zinc-500 tracking-wider">
                    {user?.roles?.map((r: any) => r.name).join(', ') || 'USER'}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                title="Sign out"
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 flex items-center justify-center transition"
              >
                <LogOut className="w-4 h-4 text-zinc-300" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center flex-grow">
          <section className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-4 h-4 text-cyan-300" />
              <h2 className="text-sm font-semibold tracking-tight">Profile Summary</h2>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-200 font-mono text-xs truncate">
                  {user?.email}
                </div>
              </div>

              {/* User ID */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  <Fingerprint className="w-3.5 h-3.5" /> User ID
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-200 font-mono text-[11px] truncate">
                  {user?.id}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  <CircleDot className="w-3.5 h-3.5" /> Status
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]"></span>
                  <span className="text-xs font-medium text-emerald-300">Active</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push('/profile')}
              className="w-full mt-6 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-400 text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-lg shadow-violet-500/30 transition flex items-center justify-center gap-2"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Profile
            </button>
          </section>

          <p className="text-[10px] text-zinc-600 text-center mt-10 tracking-[0.2em]">
            PROTECTED BY AES-256 ENCRYPTION
          </p>
        </div>
      </div>
    </main>
  );
}
