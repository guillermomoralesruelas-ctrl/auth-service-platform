'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/axios';
import { ArrowLeft, User, Mail, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/users/me');
        setUser(data);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
      } catch (err) {
        console.error('Failed to fetch user', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/me', { firstName, lastName });
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0c14]">
        <div className="w-16 h-16 border-4 border-[#60a5fa]/20 border-t-[#60a5fa] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0c14] relative overflow-hidden font-sans text-white flex items-center justify-center px-6 py-16">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,#0b0c14_75%)]" />

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <section className="relative z-10 w-full max-w-[580px] backdrop-blur-[32px] bg-[#161722]/60 border border-white/10 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="relative px-10 pt-10 pb-8 border-b border-white/5">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="absolute left-8 top-10 w-[42px] h-[42px] rounded-[14px] bg-[#161722]/60 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-white/50 hover:text-white transition-colors" />
          </Link>

          <div className="text-center">
            <h1 className="text-[22px] font-bold tracking-tight text-white">
              Edit Profile
            </h1>
            <p className="mt-2 text-[13px] text-white/40">
              Update your personal information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-10 py-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field
              label="First Name"
              icon={<User className="w-3.5 h-3.5" />}
              value={firstName}
              onChange={setFirstName}
            />
            <Field
              label="Last Name"
              icon={<User className="w-3.5 h-3.5" />}
              value={lastName}
              onChange={setLastName}
            />
          </div>

          <div>
            <Label icon={<Mail className="w-3.5 h-3.5" />}>Email</Label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full mt-1.5 px-5 py-4 rounded-xl bg-[#0b0c14]/50 border border-white/5 text-white/50 text-[14px] font-mono cursor-not-allowed shadow-inner"
            />
            <p className="mt-2.5 text-[11px] text-white/30 font-medium tracking-wide">
              Email address cannot be changed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <Link
              href="/dashboard"
              className="w-full sm:flex-1 h-[56px] flex items-center justify-center rounded-xl bg-[#161722]/60 border border-white/10 hover:bg-white/10 text-[15px] font-bold text-white/70 hover:text-white transition-all shadow-lg active:scale-95"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-[1.5] h-[56px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] text-white rounded-xl text-[15px] font-bold hover:scale-[1.01] active:scale-[0.99] shadow-[0_10px_20px_rgba(139,92,246,0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Label({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 ml-1 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
      {icon}
      {children}
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label icon={icon}>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 px-5 py-4 rounded-xl bg-[#0b0c14]/50 border border-white/5 text-white/90 text-[14px] font-medium focus:outline-none focus:border-[#60a5fa]/50 focus:bg-[#0b0c14]/80 transition-all shadow-inner"
      />
    </div>
  );
}
