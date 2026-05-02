'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/axios';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

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

          {!success ? (
            <>
              <h1 className="text-2xl font-semibold text-white text-center tracking-tight mb-1.5">
                Reset password
              </h1>
              <p className="text-sm text-zinc-400 text-center mb-7">
                Enter your email to receive a recovery link
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-zinc-300 mb-1.5 block">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/20 transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-cyan-400 text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-lg shadow-violet-500/30 transition flex justify-center items-center h-10 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Check your inbox</h2>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                If an account exists for <strong className="text-zinc-200">{email}</strong>, we've sent instructions on how to reset your password.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs text-violet-400 hover:text-violet-300 transition"
              >
                Try another email
              </button>
            </div>
          )}

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
