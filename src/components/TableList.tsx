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
    <div className="mt-4 w-full max-w-[750px]">
      <h3 className="text-xl font-bold mb-2">Available Tables</h3>
      <ul className="space-y-1">
        {available.map((t) => (
          <li key={t.id} className="flex justify-between">
            <span>Table {t.name}</span>
            <span>{t.seats} seats</span>
            <span>{t.isOutside ? "Outside" : "Inside"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableList;
