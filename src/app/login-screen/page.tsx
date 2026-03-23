"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(message);
      }

      toast.success('Successfully logged in!');
      router.push('/main-dashboard');
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="flex min-h-screen w-full">
        {/* Left Side: Coffee Illustration & Quote */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
          <div
            className="absolute inset-0 bg-cover bg-center z-0 opacity-80"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-background-dark/20 to-transparent z-10" />
          <div className="relative z-20 flex flex-col justify-end p-20 w-full">
            <div className="max-w-md">
              <h2 className="text-4xl font-black text-white leading-tight mb-4 italic">
                "Manage your coffee smartly"
              </h2>
              <div className="h-1.5 w-20 bg-primary rounded-full" />
              <p className="mt-6 text-slate-200 text-lg font-medium">
                Elevate your daily ritual with precision and passion.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-24 bg-background-light dark:bg-background-dark">
          <div className="w-full max-w-md space-y-8">
            {/* Logo & Heading */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <div className="size-10 flex items-center justify-center bg-primary/20 rounded-lg">
                  <LogIn className="text-primary" size={22} />
                </div>
                <h1 className="text-2xl font-black tracking-tight dark:text-slate-100">Qahwati</h1>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight dark:text-slate-100">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your credentials to access your account</p>
              </div>
            </div>

            {/* Form */}
            <form className="mt-10 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold dark:text-slate-200 ml-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-semibold dark:text-slate-200" htmlFor="password">
                      Password
                    </label>
                    <a className="text-xs font-bold text-primary hover:underline" href="#">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center px-1">
                <input
                  className="size-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent"
                  id="remember"
                  type="checkbox"
                />
                <label className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium" htmlFor="remember">
                  Remember me for 30 days
                </label>
              </div>

              <button
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <LogIn size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <a className="text-primary font-bold hover:underline" href="#">
                Sign up for free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
