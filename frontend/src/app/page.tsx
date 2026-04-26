import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Server } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <main className="z-10 flex flex-col items-center max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary mb-8 animate-pulse">
          <ShieldCheck size={18} />
          <span className="text-sm font-medium tracking-wide">Enterprise-grade Security</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
          Auth Service Platform
        </h1>
        
        <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl font-light">
          A decoupled microservice architecture providing JWT, OAuth2, and RBAC through a unified API Gateway.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/login" className="btn-primary flex items-center justify-center gap-2 max-w-[200px] text-lg">
            Start Demo <ArrowRight size={20} />
          </Link>
          <a href="http://localhost:3000/api/docs" target="_blank" className="btn-social max-w-[200px] text-lg">
            API Docs
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
          <FeatureCard 
            icon={<Zap className="text-yellow-400" size={32} />}
            title="Fast & Scalable"
            description="Built with NestJS and Redis for millisecond token validation."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-primary" size={32} />}
            title="Secure by default"
            description="Bcrypt hashing, rotating refresh tokens, and rate limiting out of the box."
          />
          <FeatureCard 
            icon={<Server className="text-accent" size={32} />}
            title="Microservices"
            description="Decoupled Auth and User services routed through an HTTP Gateway."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card flex flex-col items-start text-left gap-4">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}
