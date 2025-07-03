import React, { useState } from "react";
import Table from "./Table";

type TableStatus = "available" | "unavailable";

interface TableData {
  id: number;
  name: string;
  x: number;
  y: number;
  status: TableStatus;
  dimensions: { width: number; height: number };
  shape?: "rect" | "circle";
}

const tableTypes = [
  { id: 1, dimensions: { width: 50, height: 80 } },
  { id: 2, dimensions: { width: 50, height: 50 }, shape: "circle" },
  { id: 3, dimensions: { width: 100, height: 50 } },
];

const initialTables: TableData[] = [
  { id: 1, name: "101", x: 320, y: 10, ...tableTypes[0], status: "available" },
  { id: 2, name: "102", x: 250, y: 10, ...tableTypes[0], status: "unavailable" },
  { id: 3, name: "103", x: 200, y: 10, ...tableTypes[0], status: "available" },
  { id: 4, name: "104", x: 200, y: 200, ...tableTypes[0], status: "available" },
];

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
            dimensions={{ width: table.dimensions.width, height: table.dimensions.height }}
            position={{ top: table.y, left: table.x }}
            shape={table.shape}
            onClick={() => handleTableClick(table.id)}
          />
        ))}
        <div className="absolute left-0 top-[120px] w-[100px] h-[4px] bg-gray-300"></div>
        <div className="absolute left-[120px] top-[120px] w-[20px] h-[4px] bg-gray-300"></div>
        <div className="absolute right-0 top-[120px] w-[170px] h-[4px] bg-gray-300"></div>
        <div className="absolute left-[120px] bottom-[0px] w-[170px] h-[40px] bg-gray-300"></div>
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
