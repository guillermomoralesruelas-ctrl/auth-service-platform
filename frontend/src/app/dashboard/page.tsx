'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '../../lib/axios';
import { LogOut, User as UserIcon, Settings, Activity, Shield, Globe, Terminal } from 'lucide-react';

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
    <div className="min-h-screen pb-20 flex flex-col items-center">
      <div className="page-bg" />
      <div className="page-glow" />

      {/* Navigation */}
      <header className="w-full max-w-7xl px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="icon-box !m-0 !w-[42px] !h-[42px] !rounded-xl">
            <div className="dot-icon !w-1.5 !h-1.5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Portfolio</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1b26]/60 backdrop-blur-md border border-white/5 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="text-white/70" size={16} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">
                {user?.roles?.map((r: any) => r.name).join(', ')}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center bg-[#1a1b26]/60 backdrop-blur-md border border-white/5 rounded-xl text-white/50 hover:text-white transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content - Concentrated for the "Profile Summary" look */}
      <main className="w-full max-w-lg px-6 mt-10">
        <div className="auth-card !min-h-0 !py-10">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="text-accent" size={20} />
            <h2 className="text-lg font-bold text-white">Profile Summary</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="text-muted" size={14} />
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Email</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-sm font-medium text-white/90 truncate">{user?.email}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-muted" size={14} />
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">User ID</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-[11px] text-white/50 truncate font-mono">
                  {user?.id}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-muted" size={14} />
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Status</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-[10px] font-bold text-green-400">Active</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/profile')}
            className="btn-submit mt-10 !flex items-center justify-center gap-2"
          >
            <Settings size={18} />
            Edit Profile
          </button>
        </div>

        <p className="aes-text !mt-12">Protected by AES-256 Encryption</p>
      </main>
    </div>
  );
}
