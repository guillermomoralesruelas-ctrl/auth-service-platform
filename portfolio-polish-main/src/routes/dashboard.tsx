import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, LogOut, User, Mail, Fingerprint, CircleDot, Pencil } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — Portfolio" },
      { name: "description", content: "Your portfolio workspace overview." },
    ],
  }),
});

function DashboardPage() {
  const navigate = useNavigate();

  // Mock user data — replace with real auth state when backend is wired
  const user = {
    name: "Guillermo Morales Ruelas",
    role: "USER",
    email: "guillermomoralesruelas@gmail.com",
    id: "85524f0a-8b57-4b61-916e-14244bfa10b7",
    status: "Active",
  };

  const handleLogout = () => {
    navigate({ to: "/" });
  };

  return (
    <main className="min-h-dvh bg-[#0a0a14] relative overflow-hidden font-sans text-white">
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

      <div className="relative z-10">
        {/* Top bar */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full rounded-[7px] bg-[#0a0a14] flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-violet-400 to-cyan-300" />
                </div>
              </div>
              <span className="text-sm font-semibold tracking-tight">Portfolio</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/40 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-medium text-white">{user.name}</div>
                  <div className="text-[10px] text-zinc-500 tracking-wider">{user.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Sign out"
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 flex items-center justify-center transition"
              >
                <LogOut className="w-4 h-4 text-zinc-300" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center">
          {/* Profile Summary — centered */}
          <section className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-4 h-4 text-cyan-300" />
              <h2 className="text-sm font-semibold tracking-tight">Profile Summary</h2>
            </div>

            <div className="space-y-4">
              <Field icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={user.email} mono />
              <Field icon={<Fingerprint className="w-3.5 h-3.5" />} label="User ID" value={user.id} mono small />
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  <CircleDot className="w-3.5 h-3.5" />
                  Status
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]" />
                  <span className="text-xs font-medium text-emerald-300">{user.status}</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-400 text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-lg shadow-violet-500/30 transition flex items-center justify-center gap-2">
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </section>

          <p className="text-[10px] text-zinc-600 text-center mt-10 tracking-[0.2em]">
            PROTECTED BY AES-256 ENCRYPTION
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({
  icon,
  label,
  value,
  mono,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
        {icon}
        {label}
      </div>
      <div
        className={`px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-200 ${
          mono ? "font-mono" : ""
        } ${small ? "text-[11px]" : "text-xs"} truncate`}
      >
        {value}
      </div>
    </div>
  );
}
