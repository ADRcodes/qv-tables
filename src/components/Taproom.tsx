import React, { useEffect, useRef, useState } from "react";
import Table from "./Table";
import type { TableDimensions, TableProps, TableStatus } from "./Table";

const BASE_WIDTH = 400;
const BASE_HEIGHT = 300;

interface TableType {
  id: number;
  dimensions: TableDimensions;
  shape?: TableProps["shape"];
}

interface TableData {
  id: number;
  name: string;
  x: number;
  y: number;
  status: TableStatus;
  typeId: number;
}

const tableTypes: TableType[] = [
  { id: 1, dimensions: { width: 50, height: 80 } },
  { id: 2, dimensions: { width: 50, height: 50 }, shape: "circle" },
  { id: 3, dimensions: { width: 100, height: 50 } },
];

const initialTables: TableData[] = [
  { id: 1, name: "101", x: 320, y: 10, typeId: 1, status: "available" },
  { id: 2, name: "102", x: 250, y: 10, typeId: 1, status: "unavailable" },
  { id: 3, name: "103", x: 200, y: 10, typeId: 1, status: "available" },
  { id: 4, name: "104", x: 200, y: 200, typeId: 1, status: "available" },
];

interface Line {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width: number;
  height: number;
}

const floorLines: Line[] = [
  { left: 0, top: 120, width: 100, height: 4 },
  { left: 120, top: 120, width: 20, height: 4 },
  { right: 0, top: 120, width: 170, height: 4 },
  { left: 120, bottom: 0, width: 170, height: 40 },
];

const Taproom: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const xScale = clientWidth / BASE_WIDTH;
      const yScale = clientHeight / BASE_HEIGHT;
      setScale(Math.min(xScale, yScale));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    const node = containerRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

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
      <div ref={containerRef} className="relative w-full h-full border border-gray-300 rounded overflow-hidden">
        <div style={{ position: "relative", width: BASE_WIDTH * scale, height: BASE_HEIGHT * scale }}>
          {tables.map((table) => {
            const type = tableTypes.find((t) => t.id === table.typeId);
            if (!type) return null;
            return (
              <Table
                key={table.id}
                name={table.name}
                status={table.status}
                dimensions={type.dimensions}
                position={{ top: table.y, left: table.x }}
                shape={type.shape}
                scale={scale}
                onClick={() => handleTableClick(table.id)}
              />
            );
          })}
          {floorLines.map((line, idx) => (
            <div
              key={idx}
              className="absolute bg-gray-300"
              style={{
                width: line.width * scale,
                height: line.height * scale,
                top: line.top !== undefined ? line.top * scale : undefined,
                left: line.left !== undefined ? line.left * scale : undefined,
                right: line.right !== undefined ? line.right * scale : undefined,
                bottom: line.bottom !== undefined ? line.bottom * scale : undefined,
              }}
            />
          ))}
        </div>
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
