import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, Plus } from "lucide-react";
import { authedFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SymptomEntry {
  id: number;
  symptom: string;
  severity: number | null;
  date: string | null;
  created_at: string | null;
}

const COMMON = ["Cramps", "Headache", "Bloating", "Fatigue", "Nausea", "Back Pain", "Mood Swings"];

export default function SymptomTracker() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [history, setHistory] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await authedFetch("/api/symptom/history");
      if (res.status === 401) { navigate("/auth"); return; }
      setHistory((await res.json()) || []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAdd = async () => {
    const s = symptom.trim();
    if (!s) { toast({ title: "Enter or pick a symptom", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const res = await authedFetch("/api/symptom/log", {
        method: "POST",
        body: JSON.stringify({ symptom: s, severity }),
      });
      if (res.status === 401) { navigate("/auth"); return; }
      if (!res.ok) throw new Error();
      toast({ title: "Symptom logged ✓" });
      setSymptom("");
      setSeverity(3);
      fetchHistory();
    } catch {
      toast({ title: "Could not save. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F4", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#A89B8C", fontSize: 14, marginBottom: 24 }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "#FFE8EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={22} color="#F26B8A" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1C1612", margin: 0 }}>Symptom Tracker</h1>
            <p style={{ fontSize: 13, color: "#A89B8C", margin: 0 }}>Log how you feel and review your history</p>
          </div>
        </div>

        {/* ── ADD FORM ── */}
        <div style={{ background: "#fff", border: "1px solid #EDE8E1", borderRadius: 18, padding: 24, marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B5E52", marginBottom: 6 }}>Symptom</label>
          <input
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="e.g. Cramps"
            style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #EDE8E1", fontSize: 14, color: "#1C1612", outline: "none", marginBottom: 10 }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {COMMON.map((s) => (
              <button
                key={s}
                onClick={() => setSymptom(s)}
                style={{ padding: "5px 12px", borderRadius: 99, border: "1px solid #EDE8E1", background: symptom === s ? "#FFE8EF" : "#FAF7F4", color: symptom === s ? "#F26B8A" : "#6B5E52", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}
              >
                {s}
              </button>
            ))}
          </div>

          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B5E52", marginBottom: 6 }}>
            Severity: <span style={{ color: "#F26B8A" }}>{severity}/5</span>
          </label>
          <input
            type="range" min={1} max={5} value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            style={{ width: "100%", marginBottom: 18 }}
          />

          <button
            onClick={handleAdd}
            disabled={submitting}
            style={{ width: "100%", padding: 12, borderRadius: 10, background: submitting ? "#F6A8BD" : "#F26B8A", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Plus size={15} /> {submitting ? "Saving…" : "Log symptom"}
          </button>
        </div>

        {/* ── HISTORY ── */}
        <div style={{ background: "#fff", border: "1px solid #EDE8E1", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDE8E1", fontSize: 14, fontWeight: 700, color: "#1C1612" }}>
            History {history.length > 0 && <span style={{ color: "#A89B8C", fontWeight: 400 }}>· {history.length} entries</span>}
          </div>
          {loading ? (
            <div style={{ padding: 24, color: "#A89B8C", fontSize: 14 }}>Loading…</div>
          ) : history.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#A89B8C", fontSize: 14 }}>
              No symptoms logged yet. Add one above.
            </div>
          ) : (
            history.map((h) => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", borderBottom: "1px solid #F7F3EE" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#1C1612" }}>{h.symptom}</div>
                  <div style={{ fontSize: 12, color: "#A89B8C" }}>{h.date}</div>
                </div>
                {h.severity != null && (
                  <span style={{ padding: "3px 10px", borderRadius: 99, background: "#FFE8EF", color: "#F26B8A", fontSize: 12, fontWeight: 600 }}>
                    {h.severity}/5
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
