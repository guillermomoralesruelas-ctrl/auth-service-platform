'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Notice: For a full implementation, you would need an endpoint to update user data in user-service.
  // We'll just mock the visual update for now since the backend was focused on Auth and Roles.

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/users/me');
        setUser(data);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Mock save delay
    setTimeout(() => {
      setSaving(false);
      alert('Profile updated successfully (Visual Demo)');
    }, 1000);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="glass-card w-full max-w-2xl relative">
        <Link href="/dashboard" className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-white/50 mt-2">Update your personal information</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">First Name</label>
              <input 
                type="text" 
                className="input-glass"
                value={user?.firstName || ''}
                onChange={(e) => setUser({...user, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Last Name</label>
              <input 
                type="text" 
                className="input-glass"
                value={user?.lastName || ''}
                onChange={(e) => setUser({...user, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Email</label>
            <input 
              type="email" 
              className="input-glass bg-white/2"
              value={user?.email || ''}
              disabled
            />
            <p className="text-xs text-white/40 mt-2">Email address cannot be changed.</p>
          </div>

          <button type="submit" className="btn-primary mt-8" disabled={saving}>
            {saving ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
