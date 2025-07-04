import React from "react";

export type TableStatus = "available" | "unavailable";

export interface TableDimensions {
  width: number;
  height: number;
}

export interface TablePosition {
  top: number;
  left: number;
}

export interface TableProps {
  name: string;
  status: TableStatus;
  dimensions: TableDimensions;
  /** rectangle by default */
  shape?: "rect" | "circle" | string;
  position: TablePosition;
  onClick?: () => void;
}

const Table: React.FC<TableProps> = ({
  name,
  status,
  dimensions,
  shape = "rect",
  position,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`absolute flex items-center justify-center font-bold text-white ${
        shape === "circle" ? "rounded-full" : "rounded"
      }`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        top: position.top,
        left: position.left,
        backgroundColor: status === "available" ? "#4caf50" : "#f44336",
        cursor: "pointer",
      }}
    >
      {name}
    </div>
  );
};

export default Table;
