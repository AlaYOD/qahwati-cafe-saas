// Server Component — no 'use client' needed
// Left side is static; form is a client component

import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login — Qahwati',
  description: 'Sign in to your Qahwati cafe management account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#f7f7f7] dark:bg-[#1a1818] text-slate-900 dark:text-slate-100 font-display">

      {/* ── Left: Coffee hero image + quote ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">

        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-80"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2vv8FZb7Z6FwLC65FjkFrpVcPS9saK7NqSIPOaSPnPS_nGQBi7Il2rHsRwsq5rX2fHrglHlJPXuyhLvEavJtpSiY6jwx7IBJhZc7xz8NICVP2FHDBrixdqMXlvpnvGBxx-pzNq5c05kxIALdUBSo-sGhCHkqCEZ-MDIGupNHeKq1ZeLuZ-6QRYbjBNH-6jCo1ASS_S9jhxdpd16rm6zJR7GnVEkvMjI2j9in6e87fZiSGWnroYjz182p_QXLitBK39L0D1arc15M')",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1818]/80 via-[#1a1818]/20 to-transparent z-10" />

        {/* Quote */}
        <div className="relative z-20 flex flex-col justify-end p-20 w-full">
          <div className="max-w-md">
            <h2 className="text-4xl font-black text-white leading-tight mb-4 italic">
              &ldquo;Manage your coffee smartly&rdquo;
            </h2>
            <div className="h-1.5 w-20 bg-primary rounded-full" />
            <p className="mt-6 text-slate-200 text-lg font-medium">
              Elevate your daily ritual with precision and passion.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Login form ───────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-24 bg-[#f7f7f7] dark:bg-[#1a1818]">
        <LoginForm />
      </div>

    </div>
  )
}
