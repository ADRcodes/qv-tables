import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface DailyInfoData {
  reservations: string;
  outOfStock: string;
  positions: string;
  date: string;
}

const emptyInfo = (date: string): DailyInfoData => ({
  reservations: "",
  outOfStock: "",
  positions: "",
  date,
});

const DailyInfo: React.FC = () => {
  const [info, setInfo] = useState<DailyInfoData | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const ref = doc(db, "dailyInfo", "current");

    const unsub = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        let data = snap.data() as DailyInfoData;
        if (data.date !== today) {
          data = emptyInfo(today);
          await setDoc(ref, data);
        }
        setInfo(data);
      } else {
        const data = emptyInfo(today);
        await setDoc(ref, data);
        setInfo(data);
      }
    });

    return unsub;
  }, []);

  const handleSave = async () => {
    if (!info) return;
    await setDoc(doc(db, "dailyInfo", "current"), info);
    setEdit(false);
  };

  if (!info) return null;

  return (
    <div className="p-4 border rounded mb-4 w-full max-w-[750px]">
      {edit ? (
        <div className="space-y-2">
          <div>
            <label className="block font-bold mb-1">Reservations</label>
            <input
              type="text"
              className="border p-1 w-full"
              value={info.reservations}
              onChange={(e) =>
                setInfo({ ...info, reservations: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Out of Stock</label>
            <input
              type="text"
              className="border p-1 w-full"
              value={info.outOfStock}
              onChange={(e) =>
                setInfo({ ...info, outOfStock: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Positions</label>
            <textarea
              className="border p-1 w-full"
              value={info.positions}
              onChange={(e) =>
                setInfo({ ...info, positions: e.target.value })
              }
            />
          </div>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="font-bold">Reservations:</span>{" "}
            {info.reservations || "None"}
          </div>
          <div>
            <span className="font-bold">Out of Stock:</span>{" "}
            {info.outOfStock || "None"}
          </div>
          <div>
            <span className="font-bold">Positions:</span>{" "}
            {info.positions || "N/A"}
          </div>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => setEdit(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyInfo;
