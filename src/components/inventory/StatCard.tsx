import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  subtitleIcon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  alert?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, subtitleIcon: SubIcon, trend, alert }: StatCardProps) {
  return (
    <div 
      className={`bg-white p-6 rounded-2xl border ${
        alert ? "border-rose-500 shadow-sm" : "border-slate-200"
      } relative overflow-hidden group`}
    >
      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity ${
        alert ? "text-rose-500" : "text-slate-900"
      }`}>
        <Icon className="size-32" />
      </div>
      <div className="flex flex-col gap-1.5 relative z-10">
        <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">{title}</p>
        <h3 className={`text-4xl font-black ${alert ? "text-rose-600" : "text-slate-900"}`}>
          {value}
        </h3>
        <div className={`flex items-center gap-1.5 text-xs font-bold mt-2 ${
          trend === "up" ? "text-emerald-600" : 
          alert ? "text-rose-600" : 
          "text-slate-500"
        }`}>
          <SubIcon className="size-4" />
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
