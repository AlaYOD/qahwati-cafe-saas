/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { CircleHelp, Package, MonitorSpeaker, Eye } from 'lucide-react';



export default function LoginPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
{/*  Left Side: Hero Illustration  */}
<div className="relative hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-primary overflow-hidden">
<div className="absolute inset-0 opacity-20 pointer-events-none">
<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
</div>
<div className="relative z-10 w-full max-w-lg text-center">
<div className="mb-8 flex justify-center">
<div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
<CircleHelp className="text-white text-6xl" />
</div>
</div>
<h1 className="text-white text-5xl font-extrabold leading-tight mb-6">Qahwati</h1>
<p className="text-white/90 text-2xl font-medium mb-8">Smart Management for Your Café</p>
<div className="w-full aspect-video rounded-xl bg-cover bg-center shadow-2xl border border-white/10" data-alt="Modern cozy cafe interior with warm lighting and wooden furniture">
</div>
<div className="mt-12 flex items-center justify-center gap-6">
<div className="flex flex-col items-center">
<Package className="text-white/70 mb-2" />
<span className="text-white/60 text-xs">Inventory</span>
</div>
<div className="h-8 w-px bg-white/20"></div>
<div className="flex flex-col items-center">
<MonitorSpeaker className="text-white/70 mb-2" />
<span className="text-white/60 text-xs">Point of Sale</span>
</div>
<div className="h-8 w-px bg-white/20"></div>
<div className="flex flex-col items-center">
<CircleHelp className="text-white/70 mb-2" />
<span className="text-white/60 text-xs">Analytics</span>
</div>
</div>
</div>
{/*  Floating Decorative Coffee Beans Icons  */}
<CircleHelp className="absolute top-20 left-20 text-white/5 text-9xl" />
<CircleHelp className="absolute bottom-20 right-20 text-white/5 text-9xl rotate-45" />
</div>
{/*  Right Side: Login Form  */}
<div className="flex w-full lg:w-1/2 flex-col justify-center bg-white dark:bg-background-dark p-8 md:p-16 lg:p-24">
<div className="mx-auto w-full max-w-md">
{/*  Mobile Header  */}
<div className="lg:hidden flex items-center gap-3 mb-10">
<div className="size-10 bg-primary rounded-lg flex items-center justify-center">
<CircleHelp className="text-white text-2xl" />
</div>
<h2 className="text-primary dark:text-slate-100 text-2xl font-bold">Qahwati</h2>
</div>
<div className="mb-10">
<h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold mb-2">Welcome Back</h2>
<p className="text-slate-500 dark:text-slate-400">Log in to manage your café operations</p>
</div>
<form className="space-y-6" suppressHydrationWarning>
<div>
<label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Email Address</label>
<div className="relative">
<CircleHelp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
<input suppressHydrationWarning className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="name@cafe.com" type="email" />
</div>
</div>
<div>
<label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Password</label>
<div className="relative">
<CircleHelp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
<input suppressHydrationWarning className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="••••••••" type="password" />
<button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" type="button">
<Eye  />
</button>
</div>
</div>
<div className="flex items-center justify-between">
<label className="flex items-center gap-2 cursor-pointer group">
<input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 transition-all" type="checkbox" />
<span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Remember me</span>
</label>
<a className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Forgot password?</a>
</div>
<div className="space-y-4 pt-2">
<button suppressHydrationWarning className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2" type="submit">
<span>Sign In</span>
<CircleHelp className="text-sm" />
</button>
<div className="relative flex items-center py-2">
<div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
<span className="flex-shrink mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">or continue with</span>
<div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
</div>
<button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3" type="button">
<svg className="w-5 h-5" viewBox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
</svg>
<span>Sign in with Google</span>
</button>
</div>
</form>
<div className="mt-10 text-center">
<p className="text-slate-500 dark:text-slate-400">
                        Don't have an account? 
                        <a className="text-primary font-bold hover:underline ml-1" href="#">Register your café</a>
</p>
</div>
</div>
{/*  Footer credits  */}
<div className="mt-auto pt-10 text-center lg:text-left">
<p className="text-slate-400 dark:text-slate-600 text-xs">
                    © 2024 Qahwati POS. All rights reserved. 
                    <span className="mx-2">|</span>
<a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
</p>
</div>
</div>
</div>
    </div>
  );
}
