import React from "react";

type TableStatus = "available" | "unavailable";

interface TableProps {
  name: string;
  status: TableStatus;
  dimensions: { width: number; height: number };
  /** square by default */
  shape?: "square" | "circle";
  position: { top: number; left: number };
  onClick?: () => void;
}

const Table: React.FC<TableProps> = ({
  name,
  status,
  dimensions,
  shape = "square",
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
