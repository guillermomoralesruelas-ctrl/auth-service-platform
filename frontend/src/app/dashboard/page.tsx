'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '../../lib/axios';
import { LogOut, User as UserIcon, Settings, Activity } from 'lucide-react';

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
        // Middleware should have caught this, but just in case
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
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-12 glass rounded-2xl p-4 px-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Auth Platform
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
              <UserIcon className="text-primary" size={20} />
            </div>
            <div>
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-white/50">{user?.roles?.map((r: any) => r.name).join(', ')}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-accent" />
              <h2 className="text-xl font-semibold">Overview</h2>
            </div>
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
              <p className="text-white/40">Activity Chart Placeholder</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-white/70" />
              <h2 className="text-xl font-semibold">Profile Summary</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium bg-white/5 p-3 rounded-lg border border-white/10">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">User ID</p>
                <p className="font-mono text-xs text-white/70 bg-black/20 p-3 rounded-lg border border-white/10 truncate">
                  {user?.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-green-400">Active</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/profile')}
              className="mt-8 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-medium"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
