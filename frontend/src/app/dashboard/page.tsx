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
    <div className="min-h-screen pb-20">
      <div className="page-bg" />
      <div className="page-glow" />

      {/* Navigation */}
      <header className="max-w-7xl mx-auto p-6">
        <nav className="glass-nav flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.5)]">
              <Shield size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AuthCentral</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-white/10">
              <div className="text-right">
                <p className="text-sm font-semibold text-white leading-none mb-1">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                  {user?.roles?.map((r: any) => r.name).join(', ')}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center overflow-hidden">
                <UserIcon className="text-white/70" size={20} />
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xl transition-all duration-200"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column - Stats & Overview */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Activity className="text-accent" size={20} />
                </div>
                <h2 className="text-lg font-bold text-white">System Overview</h2>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  GATEWAY OPERATIONAL
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-xs text-muted font-medium mb-1">API Requests</p>
                <p className="text-2xl font-bold text-white">12.4k</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-xs text-muted font-medium mb-1">Active Users</p>
                <p className="text-2xl font-bold text-white">1,204</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-xs text-muted font-medium mb-1">Uptime</p>
                <p className="text-2xl font-bold text-white">99.9%</p>
              </div>
            </div>

            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-black/20">
              <Globe className="text-white/10 mb-4" size={48} />
              <p className="text-white/30 text-sm font-medium">Real-time Traffic Monitor coming soon</p>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Terminal className="text-primary" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Security Events</h2>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/8 transition-colors cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-white">Successful login from New Device</p>
                      <p className="text-[10px] text-muted">Chrome on Windows • 192.168.1.1{i}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted font-mono">{10 + i}:24 AM</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - User Profile */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white/5 rounded-lg">
                <Settings className="text-white/60" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Profile Identity</h2>
            </div>

            <div className="space-y-6">
              <div className="group">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 group-hover:text-primary transition-colors">Registered Email</p>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Mail className="text-white/20" size={18} />
                  <p className="text-sm font-medium text-white/90 truncate">{user?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2">Account ID</p>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5 font-mono text-[11px] text-white/50 break-all leading-relaxed">
                  {user?.id}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="text-primary" size={18} />
                  <span className="text-xs font-bold text-white/80">AES-256 Protection</span>
                </div>
                <span className="text-[10px] font-bold text-primary">ENABLED</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/profile')}
              className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              Configure Profile
            </button>
          </div>

          <div className="glass-card relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={120} className="text-white" />
            </div>
            <h3 className="text-white font-bold mb-2">Platform Documentation</h3>
            <p className="text-xs text-muted leading-relaxed mb-6">Explore our API and SDKs to integrate authentication into your apps.</p>
            <Link href="/api/docs" className="text-[10px] font-bold text-primary hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2">
              View API Docs
              <Terminal size={14} />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
