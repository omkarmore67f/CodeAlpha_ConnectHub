import { useMutation } from '@tanstack/react-query';
import { LogOut, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authApi, userApi } from '../api/queries';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    skills: user?.skills?.join(', ') || ''
  });

  const update = useMutation({
    mutationFn: async () => {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, key === 'skills' ? JSON.stringify(value.split(',').map((item) => item.trim()).filter(Boolean)) : value));
      const file = avatarRef.current?.files?.[0];
      if (file) body.append('avatar', file);
      return (await userApi.update(body)).data.user;
    },
    onSuccess: (nextUser) => {
      setSession(nextUser);
      toast.success('Profile updated');
    },
    onError: (error) => toast.error(error.message)
  });

  const logout = async () => {
    await authApi.logout();
    clearSession();
    navigate('/auth');
  };

  const deleteAccount = async () => {
    await userApi.deleteAccount();
    clearSession();
    navigate('/auth');
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    update.mutate();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-ink">Settings</h1>
      <form onSubmit={submit} className="panel space-y-4 p-5">
        <div className="flex items-center gap-4">
          <Avatar user={user} size="lg" />
          <input ref={avatarRef} type="file" accept="image/*" className="text-sm" />
        </div>
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-sm font-bold capitalize text-stone-700">{key}</span>
            {key === 'bio' ? (
              <textarea value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="input min-h-28" />
            ) : (
              <input value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="input" />
            )}
          </label>
        ))}
        <button disabled={update.isPending} className="primary-button"><Save className="h-4 w-4" />Save profile</button>
      </form>
      <section className="panel p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-moss" />
          <div>
            <h2 className="font-black text-ink">Privacy and security</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">Secure cookies, JWT auth, rate limits, sanitized input, and password hashing are enforced by the API.</p>
          </div>
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <button onClick={logout} className="secondary-button"><LogOut className="h-4 w-4" />Logout</button>
        <button onClick={deleteAccount} className="secondary-button text-ember"><Trash2 className="h-4 w-4" />Delete account</button>
      </div>
    </div>
  );
}
