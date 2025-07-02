import React, { useState } from "react";
import Table from "./Table";

type TableStatus = "available" | "unavailable";

interface TableData {
  id: number;
  name: string;
  x: number;
  y: number;
  status: TableStatus;
}

const initialTables: TableData[] = [
  { id: 1, name: "Table 1", x: 50, y: 60, status: "available" },
  { id: 2, name: "Table 2", x: 200, y: 60, status: "unavailable" },
  { id: 3, name: "Table 3", x: 50, y: 200, status: "available" },
  { id: 4, name: "Table 4", x: 200, y: 200, status: "available" },
];

const TABLE_SIZE = 60;

const Taproom: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>(initialTables);

  const handleTableClick = (id: number) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id
          ? {
              ...table,
              status: table.status === "available" ? "unavailable" : "available",
            }
          : table
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Taproom Floorplan</h2>
      <div className="relative w-[400px] h-[300px] border border-gray-300 rounded">
        {tables.map((table) => (
          <Table
            key={table.id}
            name={table.name}
            status={table.status}
            dimensions={{ width: TABLE_SIZE, height: TABLE_SIZE }}
            position={{ top: table.y, left: table.x }}
            onClick={() => handleTableClick(table.id)}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-6">
        <span className="flex items-center">
          <span className="inline-block w-4 h-4 bg-green-600 rounded mr-1" /> Available
        </span>
        <span className="flex items-center">
          <span className="inline-block w-4 h-4 bg-red-600 rounded mr-1" /> Unavailable
        </span>
      </div>
    </div>
  );
};

export default Taproom;
