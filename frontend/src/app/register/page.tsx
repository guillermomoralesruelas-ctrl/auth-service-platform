'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/axios';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent -z-10" />
      
      <div className="glass-card w-full max-w-md relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/60">Join the platform today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-white/40" size={20} />
              <input 
                type="text" 
                placeholder="First Name" 
                className="input-glass pl-12"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Last Name" 
                className="input-glass px-4"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-white/40" size={20} />
            <input 
              type="email" 
              placeholder="Email address" 
              className="input-glass pl-12"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-white/40" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-glass pl-12"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength={6}
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center text-white/60 text-sm mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-white transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
