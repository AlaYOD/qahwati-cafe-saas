import React from "react";
import { Users, Utensils, Calendar } from "lucide-react";

export type TableStatus = "available" | "occupied" | "reserved";

export interface TableInfo {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  currentTotal?: number;
  elapsedTime?: string;
  scheduledTime?: string;
  customerName?: string;
}

export function TableCard({ table }: { table: TableInfo }) {
  const isAvailable = table.status === "available";
  const isOccupied = table.status === "occupied";
  const isReserved = table.status === "reserved";

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      {/* Status Bar Indicator */}
      <div 
        className={`absolute top-0 left-0 w-1.5 h-full ${
          isAvailable ? "bg-emerald-500" : isOccupied ? "bg-rose-500" : "bg-amber-500"
        }`}
      />

      {/* Header icon and status label */}
      <div className="flex justify-between items-start mb-5">
        <div 
          className={`size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
            isAvailable ? "bg-emerald-50 text-emerald-600" : 
            isOccupied ? "bg-rose-50 text-rose-600" : 
            "bg-amber-50 text-amber-600"
          }`}
        >
          {isAvailable && <Utensils className="size-6" />}
          {isOccupied && <Utensils className="size-6" />}
          {isReserved && <Calendar className="size-6" />}
        </div>
        <span 
          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isAvailable ? "text-emerald-700 bg-emerald-100" : 
            isOccupied ? "text-rose-700 bg-rose-100" : 
            "text-amber-700 bg-amber-100"
          }`}
        >
          {table.status}
        </span>
      </div>

      <div className="flex items-center justify-between mb-1">
        <h3 className="text-slate-900 font-bold text-xl tracking-tight">{table.name}</h3>
      </div>
      
      <p className="text-slate-500 text-sm mb-5 flex items-center gap-1.5 font-medium">
        <Users className="size-4 text-slate-400" /> Capacity: {table.capacity}
      </p>

      {/* Dynamic Content based on Status */}
      {isOccupied && (
        <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-medium">Current Total</p>
            <p className="text-sm font-bold text-slate-900">${table.currentTotal?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-medium">Elapsed Time</p>
            <p className="text-xs font-bold text-rose-600">{table.elapsedTime}</p>
          </div>
        </div>
      )}

      {isReserved && (
        <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-medium">Scheduled</p>
            <p className="text-sm font-bold text-slate-900">{table.scheduledTime}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-medium">Customer</p>
            <p className="text-xs font-bold text-amber-600 truncate max-w-[100px]">{table.customerName}</p>
          </div>
        </div>
      )}

      {isAvailable && <div className="flex-1" />}

      {/* Action Button */}
      <button 
        className={`w-full mt-auto py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${
          isAvailable 
            ? "bg-slate-100 text-slate-700 hover:bg-primary hover:text-white" 
            : isOccupied
            ? "bg-primary text-white hover:bg-primary/95 shadow-lg shadow-primary/20"
            : "bg-slate-100 text-slate-700 hover:bg-amber-500 hover:text-white"
        }`}
      >
        {isAvailable ? "Assign Table" : isOccupied ? "View Order" : "Check-in"}
      </button>
    </div>
  );
}
