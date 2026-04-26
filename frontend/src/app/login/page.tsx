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
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent -z-10" />
      
      <div className="glass-card w-full max-w-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-white/40" size={20} />
            <input 
              type="email" 
              placeholder="Email address" 
              className="input-glass pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-white/40" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-glass pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="my-8 flex items-center gap-4 before:flex-1 before:border-t before:border-white/10 after:flex-1 after:border-t after:border-white/10">
          <span className="text-white/40 text-sm">or continue with</span>
        </div>

        <button onClick={handleGoogleLogin} className="btn-social mb-6">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <p className="text-center text-white/60 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-white transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
