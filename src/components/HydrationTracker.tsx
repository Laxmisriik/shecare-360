import { useState } from "react";
import { Droplets, Plus, Minus } from "lucide-react";

export const HydrationTracker = () => {
  const [count, setCount] = useState(3);
  const target = 8;

  return (
    <div className="rounded-2xl border p-5 shadow-card">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Droplets /> Hydration
        </h3>
        <span>{count}/{target}</span>
      </div>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: target }).map((_, i) => (
          <div
            key={i}
            className={`h-8 w-8 rounded-full ${
              i < count ? "bg-sage" : "bg-sage-light"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={() => setCount(Math.max(0, count - 1))}>
          <Minus />
        </button>
        <button onClick={() => setCount(count + 1)}>
          <Plus />
        </button>
      </div>
    </div>
  );
};
