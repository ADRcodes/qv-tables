import React, { useState } from "react";

type TableStatus = "available" | "unavailable";

interface Table {
  id: number;
  name: string;
  x: number;
  y: number;
  status: TableStatus;
}

const initialTables: Table[] = [
  { id: 1, name: "Table 1", x: 50, y: 60, status: "available" },
  { id: 2, name: "Table 2", x: 200, y: 60, status: "unavailable" },
  { id: 3, name: "Table 3", x: 50, y: 200, status: "available" },
  { id: 4, name: "Table 4", x: 200, y: 200, status: "available" },
];

const TABLE_SIZE = 60;

const Taproom: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);

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
      <svg width={400} height={300} className="border border-gray-300 rounded">
        {tables.map((table) => (
          <g
            key={table.id}
            onClick={() => handleTableClick(table.id)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={table.x}
              y={table.y}
              width={TABLE_SIZE}
              height={TABLE_SIZE}
              rx={10}
              fill={table.status === "available" ? "#4caf50" : "#f44336"}
              stroke="#333"
              strokeWidth={2}
            />
            <text
              x={table.x + TABLE_SIZE / 2}
              y={table.y + TABLE_SIZE / 2}
              textAnchor="middle"
              alignmentBaseline="central"
              fill="#fff"
              fontWeight="bold"
              fontSize={16}
            >
              {table.name}
            </text>
          </g>
        ))}
      </svg>
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