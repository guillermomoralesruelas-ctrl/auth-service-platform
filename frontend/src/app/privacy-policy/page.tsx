import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  // Read the text file directly from the filesystem during Server-Side Rendering
  const filePath = path.join(process.cwd(), 'public', 'privacy-policy.txt');
  let content = '';
  
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading privacy policy file:', error);
    content = 'Privacy policy content is currently unavailable.';
  }

  return (
    <main className="min-h-dvh bg-[#0a0a14] px-6 py-12 relative overflow-hidden font-sans">
      {/* Aurora glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#0a0a14_80%)]" />

      {/* Grid texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to registration
          </Link>
        </div>

        <div className="backdrop-blur-2xl bg-[#161722]/60 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-[10px] bg-[#0a0a14] flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-violet-400 to-cyan-300" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Please read these terms carefully before using our service.
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed bg-transparent border-none p-0 overflow-x-hidden">
              {content}
            </pre>
          </div>
        </div>

        <p className="text-[10px] text-zinc-600 text-center mt-12 tracking-[0.2em]">
          PROTECTED BY AES-256 ENCRYPTION
        </p>
      </div>
    </main>
  );
}
