import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authedFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, Plus, X, ChevronRight, TrendingUp,
  Droplets, Activity, Target, Clock, AlertCircle
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
interface DietLog { meal_type: string; food_item: string; nutrients: Record<string, string>; logged_at: string; }
interface Recommendations { missing_nutrients: string[]; food_recommendations: Record<string, string[]>; }

/* ─── Constants ─────────────────────────────────────── */
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const MEAL_META: Record<string, { icon: string; color: string; bg: string; time: string }> = {
  Breakfast: { icon: "☀️", color: "#D97706", bg: "#FFFBEB", time: "7–9 AM" },
  Lunch:     { icon: "🌿", color: "#059669", bg: "#ECFDF5", time: "12–2 PM" },
  Dinner:    { icon: "🌙", color: "#6D28D9", bg: "#F5F3FF", time: "6–8 PM" },
  Snack:     { icon: "⚡", color: "#DB2777", bg: "#FDF2F8", time: "Anytime" },
};
const PHASES = [
  { key: "menstrual",  label: "Menstrual",  color: "#DB2777", light: "#FDF2F8", day: "1–5",  focus: "Iron, Magnesium, Vitamin C" },
  { key: "follicular", label: "Follicular", color: "#059669", light: "#ECFDF5", day: "6–13", focus: "Protein, Zinc, B-Vitamins" },
  { key: "ovulation",  label: "Ovulation",  color: "#D97706", light: "#FFFBEB", day: "14",   focus: "Antioxidants, Fibre, Omega-3" },
  { key: "luteal",     label: "Luteal",     color: "#6D28D9", light: "#F5F3FF", day: "15–28",focus: "Complex Carbs, Calcium, B6" },
];
const PHASE_FOODS: Record<string, string[]> = {
  menstrual:  ["Dark leafy greens", "Lentils", "Dark chocolate", "Ginger", "Turmeric"],
  follicular: ["Eggs", "Fermented yogurt", "Broccoli", "Flaxseeds", "Lean chicken"],
  ovulation:  ["Salmon", "Asparagus", "Quinoa", "Almonds", "Berries"],
  luteal:     ["Sweet potato", "Chickpeas", "Walnuts", "Chamomile", "Brown rice"],
};
const NUTRIENTS = [
  { key: "protein",  label: "Protein",  unit: "g",  target: 60,  color: "#DB2777", icon: "💪" },
  { key: "fiber",    label: "Fibre",    unit: "g",  target: 25,  color: "#059669", icon: "🌾" },
  { key: "iron",     label: "Iron",     unit: "mg", target: 18,  color: "#D97706", icon: "🩸" },
  { key: "calcium",  label: "Calcium",  unit: "mg", target: 1000,color: "#6D28D9", icon: "🦴" },
];
export default function DietTracker() {
  const navigate   = useNavigate();
  const { toast }  = useToast();
  const { userId } = useAuth();

  const [mealType, setMealType]   = useState("Breakfast");
  const [foodItem, setFoodItem]   = useState("");
  const [history, setHistory]     = useState<DietLog[]>([]);
  const [recs, setRecs]           = useState<Recommendations | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase]         = useState("follicular");
  const [water, setWater]         = useState(3);
  const [tab, setTab]             = useState<"overview"|"meals"|"insights">("overview");
  const [showModal, setShowModal] = useState(false);

  const fetchHistory = async () => {
    if (userId == null) return;
    try { const r = await authedFetch(`/api/diet/history`); setHistory(await r.json() || []); }
    catch { setHistory([]); }
  };
  const fetchRecs = async () => {
    if (userId == null) return;
    try { const r = await authedFetch(`/api/diet/recommendations`); setRecs(await r.json()); }
    catch {}
  };
  useEffect(() => { fetchHistory(); fetchRecs(); }, [userId]);

  const handleSubmit = async () => {
    if (!foodItem.trim()) { toast({ title: "Enter a food item", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      // user identity is derived from the JWT server-side, not sent in the body.
      const res = await authedFetch("/api/diet/log", {
        method: "POST",
        body: JSON.stringify({ meal_type: mealType.toLowerCase(), food_item: foodItem }),
      });
      if (res.status === 401) { navigate("/auth"); return; }
      toast({ title: "Meal logged successfully" });
      setFoodItem(""); setShowModal(false);
      fetchHistory(); fetchRecs();
    } catch { toast({ title: "Failed to log meal", variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const todayMeals  = history.filter(m => new Date(m.logged_at).toDateString() === new Date().toDateString());
  const nutrientHits: Record<string, number> = {};
  history.forEach(m => Object.keys(m.nutrients || {}).forEach(n => { nutrientHits[n] = (nutrientHits[n] || 0) + 1; }));
  const currentPhase = PHASES.find(p => p.key === phase)!;
  const calorieEst   = history.length * 180;
  const todayCal     = todayMeals.length * 180;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; overflow: hidden; }

        .dt-root {
          height: 100vh; width: 100vw;
          display: flex; flex-direction: column;
          background: #F4F6F9;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* ── HEADER ── */
        .dt-header {
          flex-shrink: 0; z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 60px;
          background: #fff;
          border-bottom: 1px solid #E5E9EF;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .dt-header-left { display: flex; align-items: center; gap: 16px; }
        .dt-back {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 500; color: #6B7280;
          padding: 6px 10px; border-radius: 8px;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s;
        }
        .dt-back:hover { background: #F3F4F6; color: #111827; }
        .dt-header-divider { width: 1px; height: 20px; background: #E5E9EF; }
        .dt-header-title {
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 700; color: #111827; letter-spacing: -0.02em;
        }
        .dt-header-right { display: flex; align-items: center; gap: 10px; }
        .dt-phase-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 6px;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.02em;
        }
        .dt-phase-dot { width: 7px; height: 7px; border-radius: 50%; }
        .dt-add-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px;
          background: #111827; color: #fff;
          border: none; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.15s;
        }
        .dt-add-btn:hover { background: #1F2937; }

        /* ── BODY ── */
        .dt-body { flex: 1; overflow: hidden; display: flex; }

        /* ── SIDEBAR ── */
        .dt-sidebar {
          width: 260px; flex-shrink: 0;
          background: #fff;
          border-right: 1px solid #E5E9EF;
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        .dt-nav { padding: 16px 12px; border-bottom: 1px solid #E5E9EF; }
        .dt-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 13.5px; font-weight: 500; color: #6B7280;
          cursor: pointer; transition: all 0.15s; margin-bottom: 2px;
          border: none; background: none; width: 100%;
          font-family: 'Inter', sans-serif; text-align: left;
        }
        .dt-nav-item:hover { background: #F9FAFB; color: #111827; }
        .dt-nav-item.active { background: #F3F4F6; color: #111827; font-weight: 600; }
        .dt-nav-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dt-nav-badge {
          margin-left: auto; padding: 1px 7px; border-radius: 99px;
          background: #111827; color: #fff; font-size: 11px; font-weight: 600;
        }

        /* Phase selector */
        .dt-phase-section { padding: 16px; border-bottom: 1px solid #E5E9EF; }
        .dt-section-label {
          font-size: 10px; font-weight: 700; color: #9CA3AF;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px;
        }
        .dt-phase-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 8px;
          cursor: pointer; transition: all 0.15s; margin-bottom: 2px;
          border: 1.5px solid transparent;
        }
        .dt-phase-item:hover { background: #F9FAFB; }
        .dt-phase-item.active { border-color: currentColor; }
        .dt-phase-marker { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
        .dt-phase-info { flex: 1; min-width: 0; }
        .dt-phase-name { font-size: 12.5px; font-weight: 600; color: #111827; }
        .dt-phase-day  { font-size: 11px; color: #9CA3AF; margin-top: 1px; }

        /* Water */
        .dt-water-section { padding: 16px; border-bottom: 1px solid #E5E9EF; }
        .dt-water-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .dt-water-num { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700; color: #111827; }
        .dt-water-denom { font-size: 12px; color: #9CA3AF; }
        .dt-water-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; }
        .dt-water-cell {
          height: 28px; border-radius: 5px; cursor: pointer; transition: all 0.15s;
          border: 1.5px solid #E5E9EF; background: #F9FAFB;
        }
        .dt-water-cell.filled { background: #DBEAFE; border-color: #3B82F6; }
        .dt-water-bar { height: 4px; background: #E5E9EF; border-radius: 99px; margin-top: 6px; overflow: hidden; }
        .dt-water-bar-fill { height: 100%; background: #3B82F6; border-radius: 99px; transition: width 0.4s ease; }

        /* Nutrients */
        .dt-nutrients-section { padding: 16px; flex: 1; overflow: hidden; }
        .dt-nutrient-item { margin-bottom: 14px; }
        .dt-nutrient-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .dt-nutrient-left { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; color: #374151; }
        .dt-nutrient-val { font-size: 11.5px; color: #9CA3AF; }
        .dt-bar { height: 5px; background: #F3F4F6; border-radius: 99px; overflow: hidden; }
        .dt-bar-fill { height: 100%; border-radius: 99px; transition: width 0.7s ease; }

        /* ── MAIN ── */
        .dt-main { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .dt-main::-webkit-scrollbar { width: 5px; }
        .dt-main::-webkit-scrollbar-thumb { background: #E5E9EF; border-radius: 99px; }

        /* Stat cards row */
        .dt-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .dt-stat-card {
          background: #fff; border: 1px solid #E5E9EF; border-radius: 12px;
          padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .dt-stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .dt-stat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .dt-stat-trend { font-size: 11px; font-weight: 500; color: #059669; display: flex; align-items: center; gap: 3px; }
        .dt-stat-val { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700; color: #111827; line-height: 1; margin-bottom: 4px; }
        .dt-stat-label { font-size: 12px; color: #6B7280; }

        /* Phase focus card */
        .dt-phase-card {
          background: #fff; border: 1px solid #E5E9EF; border-radius: 12px;
          padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border-left: 4px solid;
        }
        .dt-phase-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .dt-phase-card-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #111827; }
        .dt-phase-card-sub { font-size: 12px; color: #6B7280; margin-top: 2px; }
        .dt-focus-pills { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .dt-focus-pill {
          padding: 4px 12px; border-radius: 6px;
          font-size: 12px; font-weight: 500;
        }
        .dt-food-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .dt-food-chip {
          padding: 6px 13px; border-radius: 6px; border: 1px solid #E5E9EF;
          background: #F9FAFB; font-size: 12.5px; color: #374151; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .dt-food-chip:hover { background: #F3F4F6; border-color: #D1D5DB; }

        /* Meals section */
        .dt-meals-card {
          background: #fff; border: 1px solid #E5E9EF; border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04); overflow: hidden;
        }
        .dt-meals-header {
          padding: 16px 20px; border-bottom: 1px solid #E5E9EF;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dt-meals-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #111827; }
        .dt-meals-date  { font-size: 12px; color: #9CA3AF; }
        .dt-meal-row {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 20px; border-bottom: 1px solid #F9FAFB;
          transition: background 0.1s;
          animation: rowIn 0.3s ease both;
        }
        @keyframes rowIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .dt-meal-row:hover { background: #FAFAFA; }
        .dt-meal-row:last-child { border-bottom: none; }
        .dt-meal-type-tag {
          padding: 3px 10px; border-radius: 5px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
          flex-shrink: 0; width: 76px; text-align: center;
        }
        .dt-meal-name { font-size: 13.5px; font-weight: 500; color: #111827; flex: 1; }
        .dt-meal-nutrients-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .dt-meal-nutrient-tag {
          padding: 2px 8px; border-radius: 4px; background: #F3F4F6;
          font-size: 10.5px; font-weight: 500; color: #6B7280;
        }
        .dt-meal-time { font-size: 12px; color: #9CA3AF; flex-shrink: 0; }
        .dt-empty-meals {
          padding: 48px 20px; text-align: center; color: #9CA3AF; font-size: 13.5px;
        }
        .dt-empty-meals-icon { font-size: 32px; margin-bottom: 8px; }

        /* Recs card */
        .dt-recs-card {
          background: #fff; border: 1px solid #E5E9EF; border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04); overflow: hidden;
        }
        .dt-recs-header { padding: 16px 20px; border-bottom: 1px solid #E5E9EF; display: flex; align-items: center; justify-content: space-between; }
        .dt-recs-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #111827; }
        .dt-missing-row { padding: 12px 20px; border-bottom: 1px solid #FEF3C7; background: #FFFBEB; display: flex; align-items: center; gap: 8px; }
        .dt-missing-label { font-size: 12px; font-weight: 600; color: #92400E; }
        .dt-missing-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .dt-missing-tag { padding: 2px 9px; border-radius: 4px; background: #FDE68A; font-size: 11px; font-weight: 600; color: #92400E; }
        .dt-rec-row {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 20px; border-bottom: 1px solid #F9FAFB;
        }
        .dt-rec-row:last-child { border-bottom: none; }
        .dt-rec-name { font-size: 13.5px; font-weight: 500; color: #111827; flex: 1; }
        .dt-rec-benefit { font-size: 11.5px; color: #6B7280; margin-top: 2px; }
        .dt-rec-add {
          padding: 5px 14px; border-radius: 6px; border: 1px solid #E5E9EF;
          background: #F9FAFB; font-size: 12px; font-weight: 600; color: #374151;
          cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
          flex-shrink: 0;
        }
        .dt-rec-add:hover { background: #111827; color: #fff; border-color: #111827; }

        /* ── MODAL ── */
        .dt-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .dt-modal {
          background: #fff; border-radius: 16px;
          width: 460px; max-width: calc(100vw - 32px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.18);
          animation: slideUp 0.2s cubic-bezier(0.23,1,0.32,1);
          overflow: hidden;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .dt-modal-header {
          padding: 20px 24px 16px; border-bottom: 1px solid #E5E9EF;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dt-modal-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #111827; }
        .dt-modal-close {
          width: 28px; height: 28px; border-radius: 6px;
          background: #F3F4F6; border: none; display: flex;
          align-items: center; justify-content: center; cursor: pointer;
          transition: background 0.15s;
        }
        .dt-modal-close:hover { background: #E5E7EB; }
        .dt-modal-body { padding: 20px 24px; }
        .dt-modal-label { font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .dt-modal-section { margin-bottom: 20px; }
        .dt-type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .dt-type-btn {
          padding: 12px 8px; border-radius: 10px; border: 1.5px solid #E5E9EF;
          background: #F9FAFB; cursor: pointer; text-align: center;
          transition: all 0.15s; font-family: 'Inter', sans-serif;
        }
        .dt-type-btn:hover { border-color: #D1D5DB; background: #F3F4F6; }
        .dt-type-btn.active { border-color: #111827; background: #111827; }
        .dt-type-emoji { font-size: 20px; display: block; margin-bottom: 5px; }
        .dt-type-name { font-size: 11px; font-weight: 600; color: #374151; text-transform: capitalize; }
        .dt-type-btn.active .dt-type-name { color: #fff; }
        .dt-modal-input {
          width: 100%; padding: 11px 14px; border-radius: 8px;
          border: 1.5px solid #E5E9EF; background: #F9FAFB;
          font-family: 'Inter', sans-serif; font-size: 14px; color: #111827;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dt-modal-input:focus { border-color: #111827; background: #fff; box-shadow: 0 0 0 3px rgba(17,24,39,0.06); }
        .dt-modal-input::placeholder { color: #9CA3AF; }
        .dt-quick-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .dt-quick-pill {
          padding: 5px 12px; border-radius: 6px; border: 1px solid #E5E9EF;
          background: #F9FAFB; font-size: 12px; color: #374151; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .dt-quick-pill:hover { background: #F3F4F6; border-color: #D1D5DB; }
        .dt-modal-footer { padding: 0 24px 20px; }
        .dt-submit-btn {
          width: 100%; padding: 12px; border-radius: 8px;
          background: #111827; color: #fff; border: none;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
        }
        .dt-submit-btn:hover:not(:disabled) { background: #1F2937; }
        .dt-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Status bar */
        .dt-statusbar {
          flex-shrink: 0; height: 36px;
          border-top: 1px solid #E5E9EF; background: #fff;
          display: flex; align-items: center; gap: 24px;
          padding: 0 24px;
        }
        .dt-status-item { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #6B7280; }
        .dt-status-val { font-weight: 700; color: #111827; }
        .dt-status-sep { width: 1px; height: 14px; background: #E5E9EF; }
      `}</style>

      <div className="dt-root">

        {/* HEADER */}
        <header className="dt-header">
          <div className="dt-header-left">
            <button className="dt-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Dashboard
            </button>
            <div className="dt-header-divider" />
            <span className="dt-header-title">Nutrition Tracker</span>
          </div>
          <div className="dt-header-right">
            <div className="dt-phase-badge" style={{ background: currentPhase.light, color: currentPhase.color }}>
              <div className="dt-phase-dot" style={{ background: currentPhase.color }} />
              {currentPhase.label} Phase · Day {currentPhase.day}
            </div>
            <button className="dt-add-btn" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Log Meal
            </button>
          </div>
        </header>

        {/* BODY */}
        <div className="dt-body">

          {/* SIDEBAR */}
          <aside className="dt-sidebar">

            {/* Nav */}
            <nav className="dt-nav">
              {[
                { key: "overview", label: "Overview",  icon: <Activity size={15} />, iconBg: "#F3F4F6" },
                { key: "meals",    label: "Meal Log",  icon: "🍽",                  iconBg: "#F3F4F6", badge: todayMeals.length },
                { key: "insights", label: "Insights",  icon: <TrendingUp size={15} />, iconBg: "#F3F4F6" },
              ].map(n => (
                <button key={n.key} className={`dt-nav-item ${tab === n.key ? "active" : ""}`} onClick={() => setTab(n.key as any)}>
                  <div className="dt-nav-icon" style={{ background: n.iconBg }}>
                    {typeof n.icon === "string" ? <span style={{ fontSize: 15 }}>{n.icon}</span> : n.icon}
                  </div>
                  {n.label}
                  {n.badge ? <span className="dt-nav-badge">{n.badge}</span> : null}
                </button>
              ))}
            </nav>

            {/* Phase */}
            <div className="dt-phase-section">
              <div className="dt-section-label">Cycle Phase</div>
              {PHASES.map(p => (
                <div key={p.key}
                  className={`dt-phase-item ${phase === p.key ? "active" : ""}`}
                  style={{ color: phase === p.key ? p.color : "inherit", background: phase === p.key ? p.light : "" }}
                  onClick={() => setPhase(p.key)}
                >
                  <div className="dt-phase-marker" style={{ background: p.color }} />
                  <div className="dt-phase-info">
                    <div className="dt-phase-name">{p.label}</div>
                    <div className="dt-phase-day">Day {p.day}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Water */}
            <div className="dt-water-section">
              <div className="dt-section-label">Hydration</div>
              <div className="dt-water-top">
                <div>
                  <span className="dt-water-num">{water}</span>
                  <span className="dt-water-denom"> / 8 glasses</span>
                </div>
                <span style={{ fontSize: 11, color: "#3B82F6", fontWeight: 600 }}>{Math.round((water/8)*100)}%</span>
              </div>
              <div className="dt-water-grid">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className={`dt-water-cell ${i < water ? "filled" : ""}`}
                    onClick={() => setWater(i < water ? i : i + 1)} />
                ))}
              </div>
              <div className="dt-water-bar">
                <div className="dt-water-bar-fill" style={{ width: `${(water/8)*100}%` }} />
              </div>
            </div>

            {/* Nutrients */}
            <div className="dt-nutrients-section">
              <div className="dt-section-label">Nutrient Intake</div>
              {NUTRIENTS.map(n => {
                const curr = nutrientHits[n.key] || 0;
                const pct  = Math.min((curr / 3) * 100, 100);
                return (
                  <div key={n.key} className="dt-nutrient-item">
                    <div className="dt-nutrient-row">
                      <div className="dt-nutrient-left">
                        <span>{n.icon}</span> {n.label}
                      </div>
                      <span className="dt-nutrient-val">{curr} meals</span>
                    </div>
                    <div className="dt-bar">
                      <div className="dt-bar-fill" style={{ width: `${pct}%`, background: n.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* MAIN */}
          <main className="dt-main">

            {/* ── OVERVIEW tab ── */}
            {tab === "overview" && (<>

              {/* Stat cards */}
              <div className="dt-stats-row">
                {[
                  { label: "Calories Today", val: `${todayCal}`, unit: "kcal", icon: "🔥", iconBg: "#FEF3C7", trend: "+12%" },
                  { label: "Meals Logged",   val: `${todayMeals.length}`,  unit: "today",icon: "🍽", iconBg: "#ECFDF5", trend: null },
                  { label: "Water Intake",   val: `${water}`,   unit: "glasses", icon: "💧", iconBg: "#EFF6FF", trend: null },
                  { label: "Streak",         val: "3",          unit: "days",    icon: "⚡", iconBg: "#F5F3FF", trend: "↑ 1" },
                ].map(s => (
                  <div key={s.label} className="dt-stat-card">
                    <div className="dt-stat-header">
                      <div className="dt-stat-icon" style={{ background: s.iconBg }}>
                        <span style={{ fontSize: 16 }}>{s.icon}</span>
                      </div>
                      {s.trend && (
                        <span className="dt-stat-trend"><TrendingUp size={11} />{s.trend}</span>
                      )}
                    </div>
                    <div className="dt-stat-val">{s.val} <span style={{ fontSize: 13, fontWeight: 400, color: "#9CA3AF" }}>{s.unit}</span></div>
                    <div className="dt-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Phase focus */}
              <div className="dt-phase-card" style={{ borderLeftColor: currentPhase.color }}>
                <div className="dt-phase-card-header">
                  <div>
                    <div className="dt-phase-card-title">{currentPhase.label} Phase Nutrition</div>
                    <div className="dt-phase-card-sub">Focus nutrients for this phase of your cycle</div>
                  </div>
                  <div className="dt-phase-badge" style={{ background: currentPhase.light, color: currentPhase.color }}>
                    <div className="dt-phase-dot" style={{ background: currentPhase.color }} />
                    Active
                  </div>
                </div>
                <div className="dt-focus-pills">
                  {currentPhase.focus.split(", ").map(f => (
                    <span key={f} className="dt-focus-pill" style={{ background: currentPhase.light, color: currentPhase.color }}>{f}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Recommended foods — click to log:</div>
                <div className="dt-food-chips">
                  {PHASE_FOODS[phase].map(f => (
                    <button key={f} className="dt-food-chip" onClick={() => { setFoodItem(f); setShowModal(true); }}>{f}</button>
                  ))}
                </div>
              </div>

              {/* Today's meals inline */}
              <div className="dt-meals-card">
                <div className="dt-meals-header">
                  <span className="dt-meals-title">Today's Meals</span>
                  <span className="dt-meals-date">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                </div>
                {todayMeals.length === 0 ? (
                  <div className="dt-empty-meals">
                    <div className="dt-empty-meals-icon">🍽</div>
                    No meals logged today. Start tracking your nutrition.
                  </div>
                ) : todayMeals.map((m, i) => {
                  const meta = MEAL_META[m.meal_type.charAt(0).toUpperCase() + m.meal_type.slice(1)] || { icon: "🍽", color: "#6B7280", bg: "#F9FAFB", time: "" };
                  return (
                    <div key={i} className="dt-meal-row" style={{ animationDelay: `${i*0.05}s` }}>
                      <span className="dt-meal-type-tag" style={{ background: meta.bg, color: meta.color }}>
                        {m.meal_type}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="dt-meal-name">{m.food_item}</div>
                        <div className="dt-meal-nutrients-row">
                          {Object.keys(m.nutrients || {}).slice(0, 4).map(n => (
                            <span key={n} className="dt-meal-nutrient-tag">{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className="dt-meal-time">
                        {new Date(m.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>)}

            {/* ── MEALS tab ── */}
            {tab === "meals" && (
              <div className="dt-meals-card">
                <div className="dt-meals-header">
                  <span className="dt-meals-title">Full Meal History</span>
                  <span className="dt-meals-date">{history.length} total entries</span>
                </div>
                {history.length === 0 ? (
                  <div className="dt-empty-meals">
                    <div className="dt-empty-meals-icon">📋</div>
                    No meals logged yet. Use "Log Meal" to start.
                  </div>
                ) : history.slice(0, 20).map((m, i) => {
                  const meta = MEAL_META[m.meal_type.charAt(0).toUpperCase() + m.meal_type.slice(1)] || { icon: "🍽", color: "#6B7280", bg: "#F9FAFB", time: "" };
                  return (
                    <div key={i} className="dt-meal-row">
                      <span className="dt-meal-type-tag" style={{ background: meta.bg, color: meta.color }}>{m.meal_type}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="dt-meal-name">{m.food_item}</div>
                        <div className="dt-meal-nutrients-row">
                          {Object.keys(m.nutrients || {}).slice(0,4).map(n => (
                            <span key={n} className="dt-meal-nutrient-tag">{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className="dt-meal-time">
                        {new Date(m.logged_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                        {" · "}
                        {new Date(m.logged_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── INSIGHTS tab ── */}
            {tab === "insights" && (<>
              {recs?.missing_nutrients?.length > 0 && (
                <div className="dt-recs-card">
                  <div className="dt-recs-header">
                    <span className="dt-recs-title">Nutrient Gaps</span>
                    <AlertCircle size={15} color="#D97706" />
                  </div>
                  <div className="dt-missing-row">
                    <span className="dt-missing-label">Missing:</span>
                    <div className="dt-missing-tags">
                      {recs.missing_nutrients.map(n => (
                        <span key={n} className="dt-missing-tag">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="dt-recs-card">
                <div className="dt-recs-header">
                  <span className="dt-recs-title">AI Food Recommendations</span>
                  <span style={{ fontSize: 11.5, color: "#9CA3AF" }}>Based on your logs</span>
                </div>
                {recs ? Object.entries(recs.food_recommendations).flatMap(([nutrient, foods]) =>
                  (foods as string[]).map(food => (
                    <div key={food + nutrient} className="dt-rec-row">
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🥗</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="dt-rec-name">{food}</div>
                        <div className="dt-rec-benefit">Addresses {nutrient} deficiency</div>
                      </div>
                      <button className="dt-rec-add" onClick={() => { setFoodItem(food); setShowModal(true); }}>+ Log</button>
                    </div>
                  ))
                ) : (
                  <div className="dt-empty-meals">
                    <div className="dt-empty-meals-icon">🤖</div>
                    Log meals to receive personalised recommendations.
                  </div>
                )}
              </div>
            </>)}

          </main>
        </div>

        {/* STATUS BAR */}
        <div className="dt-statusbar">
          <div className="dt-status-item"><span className="dt-status-val">{todayMeals.length}</span> meals today</div>
          <div className="dt-status-sep" />
          <div className="dt-status-item"><span className="dt-status-val">{todayCal}</span> kcal estimated</div>
          <div className="dt-status-sep" />
          <div className="dt-status-item"><span className="dt-status-val">{water}/8</span> glasses water</div>
          <div className="dt-status-sep" />
          <div className="dt-status-item">
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: currentPhase.color }} />
            <span>{currentPhase.label} phase · Focus: {currentPhase.focus.split(",")[0]}</span>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="dt-overlay" onClick={() => setShowModal(false)}>
          <div className="dt-modal" onClick={e => e.stopPropagation()}>
            <div className="dt-modal-header">
              <span className="dt-modal-title">Log a Meal</span>
              <button className="dt-modal-close" onClick={() => setShowModal(false)}><X size={13} color="#6B7280" /></button>
            </div>
            <div className="dt-modal-body">
              <div className="dt-modal-section">
                <div className="dt-modal-label">Meal Type</div>
                <div className="dt-type-grid">
                  {MEAL_TYPES.map(t => (
                    <button key={t} className={`dt-type-btn ${mealType === t ? "active" : ""}`} onClick={() => setMealType(t)}>
                      <span className="dt-type-emoji">{MEAL_META[t].icon}</span>
                      <span className="dt-type-name">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="dt-modal-section">
                <div className="dt-modal-label">Food Item</div>
                <input className="dt-modal-input" placeholder="e.g. oats, grilled chicken, spinach salad…"
                  value={foodItem} onChange={e => setFoodItem(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()} autoFocus />
                <div className="dt-quick-pills">
                  {["Spinach", "Eggs", "Oats", "Banana", "Almonds", "Lentils", "Yogurt", "Salmon"].map(f => (
                    <button key={f} className="dt-quick-pill" onClick={() => setFoodItem(f)}>{f}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="dt-modal-footer">
              <button className="dt-submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving…" : "Save Meal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}