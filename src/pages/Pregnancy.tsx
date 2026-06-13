import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Baby, Calendar } from "lucide-react";
import { authedFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PregnancyStatus {
  has_pregnancy: boolean;
  last_menstrual_period?: string;
  expected_due_date?: string | null;
  current_week?: number;
  trimester?: string;
  weeks_remaining?: number;
}

export default function Pregnancy() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState<PregnancyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lmp, setLmp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await authedFetch("/api/pregnancy/status");
      if (res.status === 401) { navigate("/auth"); return; }
      setStatus(await res.json());
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleAdd = async () => {
    if (!lmp) { toast({ title: "Please select your last menstrual period date", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const res = await authedFetch("/api/pregnancy/add", {
        method: "POST",
        body: JSON.stringify({ last_menstrual_period: lmp }),
      });
      if (res.status === 401) { navigate("/auth"); return; }
      if (!res.ok) throw new Error();
      toast({ title: "Pregnancy started 🌸" });
      setLmp("");
      fetchStatus();
    } catch {
      toast({ title: "Could not save. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = status?.current_week != null ? Math.min(100, (status.current_week / 40) * 100) : 0;

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
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EEEAFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Baby size={22} color="#7C6AF7" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1C1612", margin: 0 }}>Pregnancy Journey</h1>
            <p style={{ fontSize: 13, color: "#A89B8C", margin: 0 }}>Track your week and trimester</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "#A89B8C" }}>Loading…</p>
        ) : status?.has_pregnancy ? (
          /* ── STATUS VIEW ── */
          <div style={{ background: "#fff", border: "1px solid #EDE8E1", borderRadius: 18, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#1C1612" }}>Week {status.current_week}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#7C6AF7" }}>{status.trimester} Trimester</span>
            </div>
            <p style={{ fontSize: 13, color: "#A89B8C", marginBottom: 16 }}>
              {status.weeks_remaining} weeks remaining of 40
            </p>

            <div style={{ height: 10, background: "#F1EDF9", borderRadius: 99, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#7C6AF7,#F26B8A)", borderRadius: 99, transition: "width .4s ease" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#FAF7F4", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#A89B8C", fontSize: 12, marginBottom: 4 }}>
                  <Calendar size={13} /> Last period (LMP)
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1612" }}>{status.last_menstrual_period}</div>
              </div>
              <div style={{ background: "#FAF7F4", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#A89B8C", fontSize: 12, marginBottom: 4 }}>
                  <Calendar size={13} /> Estimated due date
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1612" }}>{status.expected_due_date ?? "—"}</div>
              </div>
            </div>
          </div>
        ) : (
          /* ── ADD FORM ── */
          <div style={{ background: "#fff", border: "1px solid #EDE8E1", borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1C1612", marginBottom: 4 }}>Start tracking</h2>
            <p style={{ fontSize: 13, color: "#A89B8C", marginBottom: 16 }}>
              Enter the first day of your last menstrual period (LMP). We'll calculate your week, trimester, and due date.
            </p>

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B5E52", marginBottom: 6 }}>
              Last menstrual period
            </label>
            <input
              type="date"
              value={lmp}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setLmp(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #EDE8E1", fontSize: 14, color: "#1C1612", outline: "none", marginBottom: 16 }}
            />

            <button
              onClick={handleAdd}
              disabled={submitting}
              style={{ width: "100%", padding: 12, borderRadius: 10, background: submitting ? "#B7A9F5" : "#7C6AF7", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Saving…" : "Start pregnancy tracking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
