// src/components/Taproom.tsx
import React, { useEffect, useState, useRef } from "react";
import Table from "./Table";
import type { TableStatus } from "./Table";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  query
} from "firebase/firestore";


const BASE_WIDTH = 750;
const BASE_HEIGHT = 400;
const GRID_SIZE = 10;

interface TableType {
  id: number;
  dimensions: { width: number; height: number };
  shape?: "rect" | "circle";
}

interface TableData {
  id: number;
  name: string;
  x: number;
  y: number;
  status?: TableStatus;
  typeId: number;
}

interface Line {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width: number;
  height: number;
}

const tableTypes: TableType[] = [
  { id: 1, dimensions: { width: 40, height: 60 } },
  { id: 2, dimensions: { width: 40, height: 40 } },
  { id: 3, dimensions: { width: 40, height: 40 }, shape: "circle" },
  { id: 4, dimensions: { width: 100, height: 40 } },
  { id: 5, dimensions: { width: 30, height: 30 }, shape: "circle" },
];

const initialTables: TableData[] = [
  { id: 1, name: "101", x: 680, y: 10, typeId: 2 },
  { id: 2, name: "102", x: 610, y: 10, typeId: 2 },
  { id: 3, name: "103", x: 540, y: 10, typeId: 2 },
  { id: 4, name: "104", x: 470, y: 10, typeId: 2 },
  { id: 5, name: "105", x: 400, y: 10, typeId: 2 },
  { id: 6, name: "106", x: 320, y: 10, typeId: 2 },
  // Circle tables
  { id: 7, name: "108", x: 220, y: 10, typeId: 3 },
  { id: 8, name: "109", x: 150, y: 10, typeId: 3 },
  { id: 9, name: "110", x: 80, y: 10, typeId: 3 },
  { id: 10, name: "111", x: 10, y: 10, typeId: 3 },
  { id: 11, name: "112", x: 10, y: 70, typeId: 3 },
  { id: 12, name: "113", x: 80, y: 70, typeId: 3 },
  { id: 13, name: "114", x: 250, y: 100, typeId: 3 },
  
  { id: 14, name: "201", x: 680, y: 80, typeId: 1 },
  { id: 15, name: "202", x: 620, y: 80, typeId: 1 },
  { id: 16, name: "203", x: 560, y: 100, typeId: 1 },
  { id: 17, name: "204", x: 500, y: 100, typeId: 1 },

  { id: 18, name: "205", x: 410, y: 230, typeId: 3 },
  { id: 19, name: "206", x: 340, y: 230, typeId: 3 },

  { id: 20, name: "207", x: 500, y: 190, typeId: 1 },
  { id: 21, name: "208", x: 560, y: 190, typeId: 1 },
  { id: 22, name: "209", x: 620, y: 190, typeId: 1 },
  { id: 23, name: "210", x: 680, y: 190, typeId: 1 },

  { id: 24, name: "301", x: 650, y: 280, typeId: 2 },
  { id: 25, name: "302", x: 590, y: 280, typeId: 2 },
  { id: 26, name: "303", x: 530, y: 280, typeId: 2 },

  { id: 27, name: "401", x: 650, y: 340, typeId: 1 },
  { id: 28, name: "402", x: 590, y: 340, typeId: 1 },

  { id: 29, name: "501", x: 430, y: 370, typeId: 5 },
  { id: 30, name: "502", x: 380, y: 370, typeId: 5 },
  { id: 31, name: "503", x: 330, y: 370, typeId: 5 },
  { id: 32, name: "504", x: 280, y: 370, typeId: 5 },
  { id: 33, name: "505", x: 230, y: 370, typeId: 5 },

  { id: 34, name: "506", x: 265, y: 190, typeId: 1 },

  { id: 35, name: "507",  x: 170, y: 190, typeId: 3 },
  { id: 36, name: "508",  x: 40, y: 360, typeId: 3 },
  { id: 37, name: "509",  x: 140, y: 300, typeId: 3 },

  { id: 39, name: "511",  x: 10, y: 300, typeId: 4 }

];

const floorLines: Line[] = [
  // Walls
  { left: 0,   top: 160, width: 220, height: 4   },
  { left: 260, top: 160, width: 60,  height: 4   },
  { left: 460, top: 160, width: 280, height: 4   },
  // Stairs
  { left: 0, top: 118, width: 180, height: 40 },
  { right: 0, bottom: 0, width: 180, height: 60 },
  // Bar
  { left: 220, bottom: 0, width: 280, height: 80 },
];

const Taproom: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [editMode, setEditMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);


  // 1️⃣ Subscribe to Firestore “tables” collection
  useEffect(() => {
    const q = query(collection(db, "tables"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({
        ...(d.data() as TableData),
        id: Number(d.id),            // doc.id is string
        status: (d.data() as TableData).status || "available"
      }));
      if (docs.length === 0) {
        // 2️⃣ Seed initial data on first run
        initialTables.forEach((t) =>
          setDoc(doc(db, "tables", String(t.id)), {
            ...t,
            status: t.status || "available"
          })
        );
      } else {
        setTables(docs);
      }
    });

    return unsubscribe;
  }, []);

  // 3️⃣ Toggle status in Firestore
  const handleTableClick = async (id: number) => {
    if (editMode) return;
    const table = tables.find((t) => t.id === id);
    if (!table) return;
    const current = table.status || "available";
    const next: TableStatus = current === "available" ? "unavailable" : "available";
    await updateDoc(doc(db, "tables", String(id)), { status: next });
    // UI will auto-update via onSnapshot
  };

  const handlePointerDown = (
  e: React.PointerEvent,
  t: TableData
): void => {
  if (!editMode || !containerRef.current) return;
  e.preventDefault();

  const rect = containerRef.current.getBoundingClientRect();
  const startX = t.x;
  const startY = t.y;
  const startClientX = e.clientX;
  const startClientY = e.clientY;

  // move handler closes over startX/startY/startClientX/startClientY/rect
  const onPointerMove = (ev: PointerEvent) => {
    const dxClient = ev.clientX - startClientX;
    const dyClient = ev.clientY - startClientY;
    const dx = (dxClient / rect.width) * BASE_WIDTH;
    const dy = (dyClient / rect.height) * BASE_HEIGHT;

    // snap while dragging
      const rawX = startX + dx;
      const rawY = startY + dy;
      const snappedX =
        Math.round(rawX / GRID_SIZE) * GRID_SIZE;
      const snappedY =
        Math.round(rawY / GRID_SIZE) * GRID_SIZE;

      setTables((prev) =>
        prev.map((tbl) =>
          tbl.id === t.id
            ? { ...tbl, x: snappedX, y: snappedY }
            : tbl
        )
      );
  };

  // up handler now uses ev to compute final position and _then_ persists
  const onPointerUp = async (ev: PointerEvent) => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);

    const dxClient = ev.clientX - startClientX;
    const dyClient = ev.clientY - startClientY;
    const dx = (dxClient / rect.width) * BASE_WIDTH;
    const dy = (dyClient / rect.height) * BASE_HEIGHT;
    const rawX = startX + dx;
    const rawY = startY + dy;
    const finalX =
      Math.round(rawX / GRID_SIZE) * GRID_SIZE;
    const finalY =
      Math.round(rawY / GRID_SIZE) * GRID_SIZE;


    // write the final coords to Firestore
    await updateDoc(doc(db, "tables", String(t.id)), {
      x: finalX,
      y: finalY,
    });
  };

  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup",   onPointerUp);
};



  return (
    <div className="p-2 flex flex-col items-center justify-center ">
      <div className="flex w-full items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Taproom Floorplan</h2>
        <button
          onClick={() => setEditMode((v) => !v)}
          className={`px-3 py-1 rounded ${
            editMode ? "bg-red-600 text-white" : "bg-blue-600 text-white"
          }`}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>
      <div ref={containerRef} className="relative w-full aspect-[750/400] max-w-[750px] border border-gray-300 rounded overflow-hidden">
        {/* 1) The SVG with just shapes */}
        <svg
          viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}
          preserveAspectRatio="xMinYMin meet"
          className="absolute inset-0 w-full h-full"
        >
          {floorLines.map((L, i) => {
            const x = L.left ?? BASE_WIDTH - L.width - (L.right ?? 0);
            const y = L.top  ?? BASE_HEIGHT - L.height - (L.bottom ?? 0);
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={L.width}
                height={L.height}
                fill="#D1D5DB"
              />
            );
          })}

          {tables.map((t) => {
            const type = tableTypes.find((x) => x.id === t.typeId)!;
            return (
              <Table
                key={t.id}
                id={t.id}
                status={t.status}
                dimensions={type.dimensions}
                shape={type.shape}
                position={{ x: t.x, y: t.y }}
                onClick={handleTableClick}
              />
            );
          })}
        </svg>

        {/* HTML labels + drag handles */}
        {tables.map((t) => {
          const type = tableTypes.find((x) => x.id === t.typeId)!;
          const leftPct =
            ((t.x + type.dimensions.width / 2) / BASE_WIDTH) * 100;
          const topPct =
            ((t.y + type.dimensions.height / 2) / BASE_HEIGHT) * 100;

          return (
            <div
              key={t.id}
              // allow pointer events only in edit mode
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: "translate(-50%, -50%)",
                cursor: editMode ? "grab" : "default",
                pointerEvents: editMode ? "auto" : "none",
                touchAction: "none",
              }}
              onPointerDown={(e) => handlePointerDown(e, t)}
            >
              <span className="font-bold text-white text-sm pointer-events-none select-none">
                {t.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-6">
        <span className="flex items-center">
          <span className="inline-block w-4 h-4 bg-green-600 rounded mr-1" />
          Available
        </span>
        <span className="flex items-center">
          <span className="inline-block w-4 h-4 bg-red-600 rounded mr-1" />
          Unavailable
        </span>
      </div>
    </div>
  );
};

export default Taproom;
