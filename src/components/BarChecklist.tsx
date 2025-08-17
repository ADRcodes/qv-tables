// src/components/BarChecklist.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface BarTask {
  id: string;
  text: string;
  done: boolean;
}

const defaultTasks: BarTask[] = [
  { id: "1", text: "Clean bar top", done: false },
  { id: "2", text: "Restock napkins", done: false },
  { id: "3", text: "Check kegs", done: false },
];

const LOCAL_KEY = "barDuties";

const BarChecklist: React.FC = () => {
  const [tasks, setTasks] = useState<BarTask[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // Helper to save tasks to Firestore, fallback to localStorage
  const persistTasks = async (updated: BarTask[]) => {
    try {
      await setDoc(doc(db, "barDuties", "tasks"), { tasks: updated });
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    } catch {
      // Firestore not available; store locally
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const ref = doc(db, "barDuties", "tasks");
    try {
      const unsub = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as { tasks: BarTask[] };
            setTasks(data.tasks);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(data.tasks));
          } else {
            setDoc(ref, { tasks: defaultTasks });
            setTasks(defaultTasks);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultTasks));
          }
        },
        () => {
          // On error, fall back to localStorage
          const local = localStorage.getItem(LOCAL_KEY);
          if (local) {
            setTasks(JSON.parse(local) as BarTask[]);
          } else {
            setTasks(defaultTasks);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultTasks));
          }
        }
      );
      return unsub;
    } catch {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        setTasks(JSON.parse(local) as BarTask[]);
      } else {
        setTasks(defaultTasks);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultTasks));
      }
    }
  }, []);

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
    persistTasks(updated);
  };

  const startEdit = (task: BarTask) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, text: editingText } : t
    );
    setTasks(updated);
    setEditingId(null);
    setEditingText("");
    persistTasks(updated);
  };

  return (
    <div className="w-full lg:max-w-sm bg-white rounded-xl border border-gray-200 shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Bar Duties</h3>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between">
            <label className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="size-5"
              />
              {editingId === task.id ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <span
                  className={
                    task.done ? "line-through text-gray-400" : "text-gray-800"
                  }
                >
                  {task.text}
                </span>
              )}
            </label>
            {editingId === task.id ? (
              <button
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => saveEdit(task.id)}
              >
                Save
              </button>
            ) : (
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => startEdit(task)}
                aria-label="Edit task"
              >
                ✏️
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarChecklist;

