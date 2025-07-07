// src/components/Table.tsx
import React from "react";

export type TableStatus = "available" | "unavailable";

export interface TableProps {
  id: number;
  status?: TableStatus;
  dimensions: { width: number; height: number };
  shape?: "rect" | "circle";
  position: { x: number; y: number };
  onClick: (id: number) => void;
}

const Table: React.FC<TableProps> = ({
  id,
  // default table status is available
  status = "available",
  dimensions,
  shape = "rect",
  position,
  onClick,
}) => {
  const fill = status === "available" ? "#4caf50" : "#f44336";
  const cx = position.x + dimensions.width / 2;
  const cy = position.y + dimensions.height / 2;

  return (
    <g onClick={() => onClick(id)} style={{ cursor: "pointer" }}>
      {shape === "circle" ? (
        <circle cx={cx} cy={cy} r={dimensions.width / 2} fill={fill} />
      ) : (
        <rect
          x={position.x}
          y={position.y}
          width={dimensions.width}
          height={dimensions.height}
          rx={4}
          fill={fill}
        />
      )}
    </g>
  );
};

export default Table;
