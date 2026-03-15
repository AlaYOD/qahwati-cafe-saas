/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { CircleHelp, Utensils, Package, MonitorSpeaker, CheckCircle } from 'lucide-react';



export default function LandingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <header className="fixed top-0 z-50 w-full border-b border-primary/20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<div className="flex items-center gap-3 text-primary">
<CircleHelp className="text-3xl font-bold" />
<h2 className="text-xl font-extrabold tracking-tight">Qahwati</h2>
</div>
<nav className="hidden md:flex items-center gap-10">
<a className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</a>
<a className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</a>
<a className="text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
<a className="text-sm font-medium hover:text-primary transition-colors" href="#">Contact</a>
</nav>
<div className="flex items-center gap-4">
<button className="hidden sm:flex px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                    Get Started
                </button>
<button className="md:hidden material-symbols-outlined">menu</button>
</div>
</div>
</header><section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
{/*  Coffee Bean Pattern Overlay  */}
<div className="absolute inset-0 z-0 opacity-10 pointer-events-none" data-alt="Subtle geometric pattern background representing coffee beans"></div>
{/*  Gradient Background  */}
<div className="absolute inset-0 z-[-1] bg-gradient-to-br from-primary/30 via-background-dark to-background-dark"></div>
<div className="relative z-10 max-w-5xl px-6 text-center">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
<CircleHelp className="text-primary text-sm" />
<span className="text-xs font-bold uppercase tracking-widest text-primary">Now in Public Beta</span>
</div>
<h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400">
                Manage Your Traditional Café with Smart Professionalism
            </h1>
<p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                An integrated ecosystem for tables, orders, payments, inventory, and automated financial reports designed specifically for modern coffee culture.
            </p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Start Free Trial
                </button>
<button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
<CircleHelp  />
                    Watch Demo
                </button>
</div>
</div>
</section><section className="py-24 px-6 lg:px-20 bg-background-light dark:bg-[#1f1c1c]" id="features">
<div className="max-w-7xl mx-auto">
<div className="mb-16">
<h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Core Capabilities</h2>
<h3 className="text-4xl font-black mb-6">Everything you need to run your café</h3>
<p className="text-slate-500 dark:text-slate-400 max-w-xl">
                    Streamline your daily operations with our comprehensive suite of tools built for the fast-paced environment of traditional coffee shops.
                </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/*  Feature 1  */}
<div className="group p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark hover:border-primary/40 transition-all">
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
<Utensils className="text-3xl" />
</div>
<h4 className="text-xl font-bold mb-3">Table Management</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Real-time floor plans and live table status tracking. Know exactly which tables are occupied or ready for service.
                    </p>
</div>
{/*  Feature 2  */}
<div className="group p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark hover:border-primary/40 transition-all">
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
<CircleHelp className="text-3xl" />
</div>
<h4 className="text-xl font-bold mb-3">Order System</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Digital ordering system synchronized with the kitchen. Reduce wait times and eliminate communication errors.
                    </p>
</div>
{/*  Feature 3  */}
<div className="group p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark hover:border-primary/40 transition-all">
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
<CircleHelp className="text-3xl" />
</div>
<h4 className="text-xl font-bold mb-3">E-Payments</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Seamlessly accept all major cards and digital wallets with built-in security and instant transaction verification.
                    </p>
</div>
{/*  Feature 4  */}
<div className="group p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark hover:border-primary/40 transition-all">
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
<Package className="text-3xl" />
</div>
<h4 className="text-xl font-bold mb-3">Inventory</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Automated stock tracking and low-inventory alerts. Manage your coffee beans and supplies with surgical precision.
                    </p>
</div>
{/*  Feature 5  */}
<div className="group p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark hover:border-primary/40 transition-all">
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
<MonitorSpeaker className="text-3xl" />
</div>
<h4 className="text-xl font-bold mb-3">Cash Register</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        A secure, blazingly fast point-of-sale interface optimized for peak hours and heavy traffic.
                    </p>
</div>
{/*  Feature 6  */}
<div className="group p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark hover:border-primary/40 transition-all">
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
<CircleHelp className="text-3xl" />
</div>
<h4 className="text-xl font-bold mb-3">Smart Reports</h4>
<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Gain deep insights into your business performance with automated financial analytics and sales trends.
                    </p>
</div>
</div>
</div>
</section><section className="py-24 px-6 lg:px-20 bg-background-light dark:bg-background-dark" id="pricing">
<div className="max-w-7xl mx-auto">
<div className="text-center mb-16">
<h2 className="text-4xl font-black mb-4">Simple, transparent pricing</h2>
<p className="text-slate-500 dark:text-slate-400">Choose the plan that fits your café's growth.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/*  Free Plan  */}
<div className="flex flex-col p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark">
<h4 className="text-lg font-bold mb-2">Free</h4>
<div className="flex items-baseline gap-1 mb-6">
<span className="text-4xl font-black">$0</span>
<span className="text-slate-500 text-sm">/month</span>
</div>
<p className="text-sm text-slate-500 mb-8">Perfect for small kiosks or side-businesses starting out.</p>
<div className="space-y-4 mb-8 flex-grow">
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Basic table tracking
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            50 orders/month
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Single user
                        </div>
</div>
<button className="w-full py-3 border border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors">
                        Get Started
                    </button>
</div>
{/*  Pro Plan  */}
<div className="flex flex-col p-8 rounded-2xl border-2 border-primary bg-primary/5 relative scale-105 shadow-2xl shadow-primary/10">
<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full">
                        Most Popular
                    </div>
<h4 className="text-lg font-bold mb-2">Pro</h4>
<div className="flex items-baseline gap-1 mb-6">
<span className="text-4xl font-black">$49.99</span>
<span className="text-slate-500 text-sm">/month</span>
</div>
<p className="text-sm text-slate-500 mb-8">Comprehensive toolset for established professional cafes.</p>
<div className="space-y-4 mb-8 flex-grow">
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Unlimited tables
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Unlimited orders
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Advanced reports
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            E-payments integrated
                        </div>
</div>
<button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                        Go Pro
                    </button>
</div>
{/*  Enterprise Plan  */}
<div className="flex flex-col p-8 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark">
<h4 className="text-lg font-bold mb-2">Enterprise</h4>
<div className="flex items-baseline gap-1 mb-6">
<span className="text-4xl font-black">$99.99</span>
<span className="text-slate-500 text-sm">/month</span>
</div>
<p className="text-sm text-slate-500 mb-8">Scale your operations across multiple locations globally.</p>
<div className="space-y-4 mb-8 flex-grow">
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Multi-location support
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Custom integrations
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            24/7 priority support
                        </div>
<div className="flex items-center gap-3 text-sm">
<CheckCircle className="text-primary" />
                            Advanced inventory mgmt
                        </div>
</div>
<button className="w-full py-3 border border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors">
                        Contact Sales
                    </button>
</div>
</div>
</div>
</section><section className="py-20 px-6 lg:px-20">
<div className="max-w-4xl mx-auto rounded-3xl p-12 md:p-20 bg-primary/10 border border-primary/20 text-center relative overflow-hidden">
<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-64 bg-primary/20 rounded-full blur-3xl"></div>
<h2 className="text-4xl font-black mb-6 relative z-10">Ready to modernize your café?</h2>
<p className="text-lg text-slate-500 dark:text-slate-400 mb-10 relative z-10">
                Join hundreds of café owners who trust Qahwati for their daily operations. Start your 14-day free trial today.
            </p>
<div className="relative z-10">
<button className="px-10 py-5 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                    Get Started Now
                </button>
</div>
</div>
</section><footer className="py-12 px-6 lg:px-20 border-t border-primary/10">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex items-center gap-2 text-primary">
<CircleHelp className="text-2xl" />
<span className="font-extrabold text-lg">Qahwati</span>
</div>
<div className="flex gap-8 text-sm text-slate-500">
<a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="hover:text-primary transition-colors" href="#">Help Center</a>
</div>
<p className="text-sm text-slate-500">© 2024 Qahwati Systems. All rights reserved.</p>
</div>
</footer>
    </div>
  );
}
