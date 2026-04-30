'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { api } from '../../lib/axios';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      Cookies.set('access_token', data.access_token);
      Cookies.set('refresh_token', data.refresh_token);
      
      // Fetch user profile to get userId
      const userRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      localStorage.setItem('user_id', userRes.data.id);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 font-sans">
      {/* Dynamic Background Components */}
      <div className="bg-mesh" />
      <div className="bg-grid opacity-30" />
      
      <div className="w-full max-w-[420px] animate-fade-in">
        <div className="glass-card relative overflow-hidden flex flex-col gap-8">
          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-inner">
              <Lock className="text-primary" size={28} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-muted text-base">Please sign in to your workspace</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center gap-2 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="input-field pl-12 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Password</label>
                <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="input-field pl-12 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary h-12 flex items-center justify-center mt-2" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="text-sm uppercase tracking-widest font-bold">Sign In</span>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
              <span className="bg-[#0a0a0b] px-4">Secure Social Access</span>
            </div>
          </div>

          <button onClick={handleGoogleLogin} className="btn-secondary h-12 group">
            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <span className="text-sm font-semibold group-hover:text-white transition-colors">Continue with Google</span>
          </button>

          <p className="text-center text-sm mt-2">
            <span className="text-muted">Don't have an account? </span>
            <Link href="/register" className="text-primary hover:text-white transition-colors font-bold decoration-primary/30 decoration-2 underline-offset-4">
              Sign up free
            </Link>
          </p>
        </div>
        
        <p className="text-center mt-12 text-white/10 text-[10px] uppercase tracking-[0.3em] font-medium">
          Protected by AES-256 Encryption
        </p>
      </div>
    </div>
  );
  );
}
