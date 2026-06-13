import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { authedFetch } from "@/lib/api";

interface Insights {
  has_data: boolean;
  cycles_logged?: number;
  average_cycle_length?: number;
  period_length?: number;
  last_period_start?: string;
  next_period_start?: string;
  next_period_end?: string;
  ovulation_day?: string;
  fertile_window_start?: string;
  fertile_window_end?: string;
}

const fmt = (iso?: string) =>
  iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

/**
 * Compact, backend-backed cycle insights card.
 * Reads GET /api/period/insights (JWT-scoped) and shows next period,
 * ovulation and fertile window derived from the user's logged cycles.
 */
export default function CycleInsights() {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authedFetch("/api/period/insights");
        if (res.ok) setData(await res.json());
      } catch {
        /* network/backend down — render nothing */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !data || !data.has_data) return null;

  const items = [
    { label: "Next period", value: fmt(data.next_period_start), color: "#F26B8A", bg: "#FFE8EF" },
    { label: "Ovulation", value: fmt(data.ovulation_day), color: "#FB923C", bg: "#FFF0E6" },
    {
      label: "Fertile window",
      value: `${fmt(data.fertile_window_start)} – ${fmt(data.fertile_window_end)}`,
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
    { label: "Avg cycle", value: `${data.average_cycle_length} days`, color: "#7C6AF7", bg: "#EEEAFF" },
  ];

  return (
    <div style={{ background: "#fff", border: "1px solid #EDE8E1", borderRadius: 18, padding: 20, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Sparkles size={15} color="#F26B8A" />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1612" }}>Cycle Insights</span>
        <span style={{ fontSize: 12, color: "#A89B8C" }}>· from {data.cycles_logged} logged cycle{data.cycles_logged === 1 ? "" : "s"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {items.map((it) => (
          <div key={it.label} style={{ background: it.bg, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11.5, color: "#6B5E52", marginBottom: 4 }}>{it.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: it.color }}>{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
