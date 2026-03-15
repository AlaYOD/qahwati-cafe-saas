import React from "react";
import { TableCard, TableInfo } from "./TableCard";

const tablesData: TableInfo[] = [
  { id: "1", name: "Table 01", capacity: 2, status: "available" },
  { id: "2", name: "Table 02", capacity: 4, status: "occupied", currentTotal: 45.50, elapsedTime: "45m" },
  { id: "3", name: "Table 03", capacity: 4, status: "reserved", scheduledTime: "18:30", customerName: "S. Jackson" },
  { id: "4", name: "Table 04", capacity: 2, status: "occupied", currentTotal: 22.00, elapsedTime: "1h 20m" },
  { id: "5", name: "Table 05", capacity: 6, status: "available" },
  { id: "6", name: "Table 06", capacity: 2, status: "occupied", currentTotal: 15.75, elapsedTime: "30m" },
  { id: "7", name: "Table 07", capacity: 2, status: "available" },
  { id: "8", name: "Table 08", capacity: 8, status: "occupied", currentTotal: 120.40, elapsedTime: "2h 15m" },
];

export function TableGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tablesData.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  );
}
