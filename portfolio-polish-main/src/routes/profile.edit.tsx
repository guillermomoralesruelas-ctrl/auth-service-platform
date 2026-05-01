import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, Mail, Save } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfilePage,
  head: () => ({
    meta: [
      { title: "Edit Profile — Portfolio" },
      { name: "description", content: "Update your personal information." },
    ],
  }),
});

function EditProfilePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Guillermo");
  const [lastName, setLastName] = useState("Morales Ruelas");
  const email = "guillermomoralesruelas@gmail.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-dvh bg-[#0a0a14] relative overflow-hidden font-sans text-white flex items-center justify-center px-6 py-16">
      {/* Aurora glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/25 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,#0a0a14_75%)]" />

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <section className="relative z-10 w-full max-w-2xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-2xl shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
          <Link
            to="/dashboard"
            aria-label="Back to dashboard"
            className="absolute left-6 top-6 w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 flex items-center justify-center transition"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-300" />
          </Link>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              Update your personal information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-zinc-400 text-sm font-mono cursor-not-allowed"
            />
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Email address cannot be changed.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Link
              to="/dashboard"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 text-sm font-medium text-zinc-300 text-center transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-400 text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-lg shadow-violet-500/30 transition"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
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
    <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
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
        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.05] transition"
      />
    </div>
  );
}
