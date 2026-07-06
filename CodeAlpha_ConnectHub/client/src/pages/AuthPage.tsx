import { useMutation } from '@tanstack/react-query';
import { AtSign, Lock, Sparkles, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { authApi } from '../api/queries';
import { useAuthStore } from '../store/authStore';

type AuthForm = { name: string; username: string; email: string; password: string };

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthForm>();
  const setSession = useAuthStore((state) => state.setSession);
  const token = useAuthStore((state) => state.token);

  const mutation = useMutation({
    mutationFn: async (values: AuthForm) => {
      if (mode === 'forgot') return authApi.forgotPassword(values.email);
      return mode === 'login' ? authApi.login(values) : authApi.register(values);
    },
    onSuccess: (response) => {
      if ('token' in response.data) setSession(response.data.user, response.data.token);
      toast.success(mode === 'forgot' ? 'Reset instructions prepared' : 'Welcome to ConnectHub');
      reset();
    },
    onError: (error) => toast.error(error.message)
  });

  if (token) return <Navigate to="/" replace />;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-line bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-ink p-10 text-white lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm text-white/80">
            <Sparkles className="h-4 w-4" />
            ConnectHub
          </div>
          <h1 className="mt-8 max-w-md text-5xl font-black leading-tight">Share ideas. Build communities.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-white/72">A focused network for posts, replies, discovery, and meaningful professional communities.</p>
          <div className="mt-10 grid grid-cols-3 gap-3 text-sm">
            {['Profiles', 'Feeds', 'Notifications'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 p-4 text-white/80">{item}</div>
            ))}
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-ink">{mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create account' : 'Reset password'}</h2>
            <p className="mt-2 text-sm text-stone-600">Launch into your community with secure JWT authentication.</p>
          </div>
          <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
            {mode === 'register' && (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Name</span>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                    <input className="input pl-11" {...register('name', { required: 'Name is required' })} />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name.message}</p>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Username</span>
                  <input className="input" {...register('username', { 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  })} />
                  {errors.username && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.username.message}</p>}
                </label>
              </>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-stone-700">Email</span>
              <div className="relative">
                <AtSign className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                <input type="email" className="input pl-11" {...register('email', { required: 'Email is required' })} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
            </label>
            {mode !== 'forgot' && (
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-stone-700">Password</span>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                  <input type="password" className="input pl-11" {...register('password', { 
                    required: 'Password is required', 
                    minLength: { value: 8, message: 'Password must be at least 8 characters' } 
                  })} />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>}
              </label>
            )}
            <button disabled={mutation.isPending} className="primary-button w-full">{mode === 'forgot' ? 'Send reset link' : mode === 'login' ? 'Login' : 'Register'}</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-marine hover:underline">
              {mode === 'login' ? 'Create an account' : 'Use existing account'}
            </button>
            <button onClick={() => setMode('forgot')} className="text-stone-500 hover:text-ink">Forgot password?</button>
          </div>
        </div>
      </section>
    </main>
  );
}
