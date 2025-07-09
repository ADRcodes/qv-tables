import React from "react";
import type { TableStatus } from "./Table";

export interface TableListProps {
  tables: {
    id: number;
    name: string;
    seats: number;
    isOutside?: boolean;
    status?: TableStatus;
  }[];
}

const TableList: React.FC<TableListProps> = ({ tables }) => {
  const available = tables.filter((t) => t.status === "available");

  return (
    <div className="mt-4 w-full">
      <h3 className="text-xl font-bold mb-2">Available Tables</h3>
      <div className="flex flex-wrap gap-2 space-y-1">
        {available.length === 0 && (<span>No available tables</span>)}
        {available.length < 16 &&
          available.map((t) => (
            <div key={t.id} className="flex gap-1 border-1 border-green-700/85 rounded-2xl overflow-hidden">
              <span className="font-bold bg-[#4caf50] text-white p-2">{t.name}</span>
              <span className="py-2">{t.seats}🪑</span>
              <span className="pr-2 py-2">{t.isOutside ? "☀️" : ""}</span>
            </div>
          ))}
        {available.length >= 16 && (<span> {available.length} available tables</span>)}
      </div>
    </div>
  );
};

export default TableList;
