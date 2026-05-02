'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/axios';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect against users arriving without a token
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing recovery token. Please request a new link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      // Redirect to login with a success parameter
      router.push('/login?reset_success=true');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-white text-center tracking-tight mb-1.5">
        Create new password
      </h1>
      <p className="text-sm text-zinc-400 text-center mb-7">
        Please enter and confirm your new password
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="password" className="text-xs font-medium text-zinc-300 mb-1.5 block">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/20 transition"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-xs font-medium text-zinc-300 mb-1.5 block">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/20 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-cyan-400 text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-lg shadow-violet-500/30 transition flex justify-center items-center h-10 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save new password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-dvh bg-[#0a0a14] flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Aurora glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#0a0a14_70%)]" />

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-[400px]">
        <div className="backdrop-blur-2xl bg-[#161722]/60 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full rounded-[10px] bg-[#0a0a14] flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-violet-400 to-cyan-300" />
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-8 pt-6 border-t border-white/10">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to login
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-zinc-600 text-center mt-8 tracking-[0.2em]">
          PROTECTED BY AES-256 ENCRYPTION
        </p>
      </div>
    </main>
  );
}
