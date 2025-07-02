
// Table component that takes in the top down dimensions of table, whether it's circle or square, and positioning of the table


interface TableProps {
  dimensions: { width: number; height: number };
  shape: string;
  position: { top: number; left: number };
}

const Table: React.FC<TableProps> = ({ dimensions, shape, position }) => {
  return (
    <div
      className={`table ${shape} h-[${dimensions.height}px] w-[${dimensions.width}px] absolute top-[${position.top}px] left-[${position.left}px}]`}
    >
      Table
    </div>
  );
};

export default Table;