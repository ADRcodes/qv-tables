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
  /**
   * Scale factor applied to all dimensions and positions.
   * Defaults to `1` when not provided.
   */
  scale?: number;
  onClick?: () => void;
}

const Table: React.FC<TableProps> = ({
  name,
  status,
  dimensions,
  shape = "rect",
  position,
  scale = 1,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`absolute flex items-center justify-center font-bold text-white ${
        shape === "circle" ? "rounded-full" : "rounded"
      }`}
      style={{
        width: dimensions.width * scale,
        height: dimensions.height * scale,
        top: position.top * scale,
        left: position.left * scale,
        backgroundColor: status === "available" ? "#4caf50" : "#f44336",
        cursor: "pointer",
      }}
    >
      {name}
    </div>
  );
};

export default Table;
