'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/axios';
import { Lock, Mail, User, Loader2, Eye } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <main className="flex flex-col items-center py-10">
      <div className="page-bg" />
      <div className="page-glow" />
      
      <div className="auth-card">
        <div className="text-center">
          <div className="icon-box">
            <div className="dot-icon" />
          </div>
          <h1 className="heading">Create your account</h1>
          <p className="subheading">Join the platform today</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">First name</label>
              <div className="input-container">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Jane" 
                  className="input-styled"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-text">Last name</label>
              <div className="input-container">
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="input-styled !pl-4"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label-text">Email</label>
            <div className="input-container">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="input-styled"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="label-text">Password</label>
            <div className="input-container">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="At least 8 characters" 
                className="input-styled"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={8}
              />
              <Eye 
                className="input-eye hover:text-white transition-colors" 
                size={18} 
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create account'}
          </button>
        </form>

        <div className="separator">OR</div>

        <button onClick={handleGoogleLogin} className="btn-google">
          <svg className="google-icon-small" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-[11px] text-center text-muted mt-8 leading-relaxed">
          By creating an account, you agree to our <Link href="#" className="text-white hover:underline">Terms</Link> and <Link href="#" className="text-white hover:underline">Privacy Policy</Link>.
        </p>
      </div>

      <p className="footer-text">
        Already have an account? 
        <Link href="/login" className="footer-link">Sign in</Link>
      </p>
      
      <p className="aes-text">Protected by AES-256 Encryption</p>
    </main>
  );
}
