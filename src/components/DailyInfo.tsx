// src/components/DailyInfo.tsx
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
    <div className="relative mb-6 w-full lg:max-w-sm bg-white rounded-xl border border-gray-200 shadow-lg p-6">
      {/* toggle edit/view via emoji button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => setEdit((e) => !e)}
        aria-label={edit ? "Exit edit mode" : "Enter edit mode"}
      >
        <span className="text-xl select-none">
          {edit ? "❌" : "✏️"}
        </span>
      </button>

      <h3 className="text-lg font-semibold mb-3 text-gray-800">Daily Info</h3>

      {edit ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reservations
            </label>
            <textarea
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={info.reservations}
              onChange={(e) => setInfo({ ...info, reservations: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Out of Stock (86)
            </label>
            <textarea
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={info.outOfStock}
              onChange={(e) => setInfo({ ...info, outOfStock: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Positions
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={info.positions}
              onChange={(e) => setInfo({ ...info, positions: e.target.value })}
            />
          </div>
          <button
            className="mt-2 w-full bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-row md:flex-col">
            <div className="font-medium text-gray-800">Reservations:</div>
            <div className="ml-2 text-gray-600 whitespace-pre-wrap">
              {info.reservations || "None"}
            </div>
          </div>
          <div className="flex flex-row md:flex-col">
            <div className="font-medium text-gray-800">Out of Stock (86):</div>
            <div className="ml-2 text-gray-600 whitespace-pre-wrap">
              {info.outOfStock || "None"}
            </div>
          </div>
          <div className="flex flex-row md:flex-col">
            <div className="font-medium text-gray-800">Positions:</div>
            <div className="ml-2 text-gray-600 whitespace-pre-wrap">
              {info.positions || "N/A"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyInfo;
