
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Droplets, Thermometer,
  Zap, Moon, Heart, Wind, Plus, X, Check, Info
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
interface LoggedPeriod { start: string; end: string; }
interface DayLog { date: string; symptoms: string[]; flow: string; mood: string; }

/* ─── Constants ─────────────────────────────────────── */
const SYMPTOMS = ["Cramps", "Headache", "Bloating", "Fatigue", "Nausea", "Back Pain", "Mood Swings", "Tender Breasts"];
const FLOWS    = ["Light", "Medium", "Heavy", "Spotting"];
const MOODS    = [
  { label: "Happy",   emoji: "😊" },
  { label: "Sad",     emoji: "😢" },
  { label: "Anxious", emoji: "😰" },
  { label: "Irritable", emoji: "😠" },
  { label: "Calm",    emoji: "😌" },
  { label: "Tired",   emoji: "😴" },
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ─── Helpers ───────────────────────────────────────── */
const toKey = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const parseDate = (s: string) => new Date(s + "T00:00:00");

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/* ─── Component ─────────────────────────────────────── */
const PeriodTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const today = new Date();
  const [viewYear, setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [cycleLength, setCycleLength]   = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  /* Logged periods: [{start, end}] */
  const [periods, setPeriods]   = useState<LoggedPeriod[]>([]);
  /* Day logs: {date: {symptoms, flow, mood}} */
  const [dayLogs, setDayLogs]   = useState<Record<string, DayLog>>({});

  /* Selection state */
  const [selecting, setSelecting]     = useState(false);
  const [selectStart, setSelectStart] = useState<string | null>(null);
  const [selectEnd, setSelectEnd]     = useState<string | null>(null);

  /* Log panel */
  const [logPanelDate, setLogPanelDate]   = useState<string | null>(null);
  const [panelSymptoms, setPanelSymptoms] = useState<string[]>([]);
  const [panelFlow, setPanelFlow]         = useState("");
  const [panelMood, setPanelMood]         = useState("");

  /* Active tab */
  const [tab, setTab] = useState<"calendar"|"insights">("calendar");

  /* ── Computed: which dates are "period" days ── */
  const periodDays = useMemo(() => {
    const set = new Set<string>();
    for (const p of periods) {
      let cur = parseDate(p.start);
      const end = parseDate(p.end);
      while (cur <= end) { set.add(toKey(cur)); cur = addDays(cur, 1); }
    }
    return set;
  }, [periods]);

  /* ── Computed: predictions from last period ── */
  const predictions = useMemo(() => {
    if (periods.length === 0) return null;
    const last = periods[periods.length - 1];
    const lastStart = parseDate(last.start);
    const nextStart   = addDays(lastStart, cycleLength);
    const nextEnd     = addDays(nextStart, periodLength - 1);
    const ovulation   = addDays(lastStart, cycleLength - 14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd   = addDays(ovulation, 1);
    return { nextStart, nextEnd, ovulation, fertileStart, fertileEnd };
  }, [periods, cycleLength, periodLength]);

  /* ── Computed: which dates are predicted / fertile / ovulation ── */
  const predictedDays  = useMemo(() => {
    if (!predictions) return new Set<string>();
    const set = new Set<string>();
    let cur = predictions.nextStart;
    while (cur <= predictions.nextEnd) { set.add(toKey(cur)); cur = addDays(cur, 1); }
    return set;
  }, [predictions]);

  const fertileDays = useMemo(() => {
    if (!predictions) return new Set<string>();
    const set = new Set<string>();
    let cur = predictions.fertileStart;
    while (cur <= predictions.fertileEnd) { set.add(toKey(cur)); cur = addDays(cur, 1); }
    return set;
  }, [predictions]);

  /* ── Calendar navigation ── */
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); };

  /* ── Selection logic ── */
  const handleDayClick = (key: string) => {
    if (!selecting) {
      // open log panel
      const log = dayLogs[key] || { date: key, symptoms: [], flow: "", mood: "" };
      setLogPanelDate(key);
      setPanelSymptoms(log.symptoms);
      setPanelFlow(log.flow);
      setPanelMood(log.mood);
      return;
    }
    if (!selectStart) { setSelectStart(key); setSelectEnd(null); }
    else if (!selectEnd) {
      const a = selectStart < key ? selectStart : key;
      const b = selectStart < key ? key : selectStart;
      setSelectEnd(b); setSelectStart(a);
    } else {
      setSelectStart(key); setSelectEnd(null);
    }
  };

  const confirmPeriod = () => {
    if (!selectStart) return;
    const end = selectEnd || selectStart;
    setPeriods(p => [...p, { start: selectStart, end }]);
    setSelectStart(null); setSelectEnd(null); setSelecting(false);
    toast({ title: "Period logged 🌸", description: `${selectStart} → ${end}` });
  };

  const cancelSelect = () => { setSelecting(false); setSelectStart(null); setSelectEnd(null); };

  /* ── Save day log ── */
  const saveLog = () => {
    if (!logPanelDate) return;
    setDayLogs(prev => ({ ...prev, [logPanelDate]: { date: logPanelDate, symptoms: panelSymptoms, flow: panelFlow, mood: panelMood } }));
    toast({ title: "Day logged ✓" });
    setLogPanelDate(null);
  };

  /* ── Current cycle phase ── */
  const todayKey = toKey(today);
  const currentPhase = useMemo(() => {
    if (periodDays.has(todayKey)) return { label: "Menstrual", color: "#F26B8A", desc: "Your period is here. Rest and be gentle with yourself." };
    if (fertileDays.has(todayKey)) return { label: "Fertile Window", color: "#F59E0B", desc: "High chance of conception. Energy levels rising." };
    if (predictions && toKey(predictions.ovulation) === todayKey) return { label: "Ovulation", color: "#FB923C", desc: "Peak fertility day. You may feel your best today!" };
    if (predictions && today >= predictions.nextStart) return { label: "Late Luteal", color: "#A78BFA", desc: "PMS symptoms may appear. Practice self-care." };
    return { label: "Follicular", color: "#34D399", desc: "Energy rebuilding. Great time for new projects!" };
  }, [periodDays, fertileDays, predictions, todayKey]);

  /* ── Build calendar grid (always show full weeks with prev/next month days) ── */
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfWeek(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);
  const calDays: { key: string; overflow: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(viewYear, viewMonth - 1, prevMonthDays - i);
    calDays.push({ key: toKey(d), overflow: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewYear, viewMonth, i);
    calDays.push({ key: toKey(d), overflow: false });
  }
  let nextDay = 1;
  while (calDays.length % 7 !== 0) {
    const d = new Date(viewYear, viewMonth + 1, nextDay++);
    calDays.push({ key: toKey(d), overflow: true });
  }

  /* ── Day cell style logic ── */
  const getDayMeta = (key: string, overflow: boolean) => {
    const isPeriod    = periodDays.has(key);
    const isPredicted = predictedDays.has(key);
    const isFertile   = fertileDays.has(key);
    const isOvulation = predictions && toKey(predictions.ovulation) === key;
    const isToday     = key === todayKey;
    const isInSelect  = selectStart && selectEnd && key >= selectStart && key <= selectEnd;
    const isSelectStart = key === selectStart;
    const hasLog      = !!dayLogs[key];

    return { isPeriod, isPredicted, isFertile, isOvulation, isToday, isInSelect, isSelectStart, hasLog, overflow };
  };

  /* ─── Stats ─── */
  const avgCycle = cycleLength;
  const lastPeriodDate = periods.length ? periods[periods.length-1].start : null;
  const daysUntilNext = predictions
    ? Math.max(0, Math.round((predictions.nextStart.getTime() - today.getTime()) / 86400000))
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Figtree:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; overflow: hidden; }

        .pt-root {
          height: 100vh; width: 100vw;
          display: flex; flex-direction: column;
          background: #FAF7F4;
          font-family: 'Figtree', sans-serif;
          overflow: hidden; position: relative;
        }
        .blob { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
        .blob-1 { width: 500px; height: 500px; background: #F26B8A1A; top: -130px; right: -100px; }
        .blob-2 { width: 380px; height: 380px; background: #FB923C12; bottom: -80px; left: -80px; }
        .grain {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 180px;
        }

        /* HEADER */
        .pt-header {
          flex-shrink: 0; z-index: 20; position: relative;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px;
          background: rgba(250,247,244,0.92); backdrop-filter: blur(20px);
          border-bottom: 1px solid #EDE8E1;
        }
        .pt-back {
          display: flex; align-items: center; gap: 7px;
          background: none; border: none; cursor: pointer;
          font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 500; color: #A89B8C;
          padding: 6px 10px; border-radius: 99px; transition: all 0.2s;
        }
        .pt-back:hover { background: #EDE8E1; color: #1C1612; }
        .pt-header-center { display: flex; flex-direction: column; align-items: center; }
        .pt-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem; font-weight: 700; color: #1C1612;
        }
        .pt-header-sub { font-size: 11px; color: #C4B8AB; margin-top: 1px; }
        .pt-header-badge {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 99px;
          background: #FFE8EF; border: 1px solid #F9C0CF;
          font-size: 11.5px; font-weight: 500; color: #F26B8A;
        }

        /* TABS */
        .pt-tabs {
          flex-shrink: 0; z-index: 10; position: relative;
          display: flex; gap: 0;
          padding: 12px 24px 0;
          border-bottom: 1px solid #EDE8E1;
          background: rgba(250,247,244,0.9);
        }
        .pt-tab {
          padding: 8px 20px; font-size: 13px; font-weight: 500;
          border: none; background: none; cursor: pointer;
          color: #A89B8C; border-bottom: 2px solid transparent;
          font-family: 'Figtree', sans-serif;
          transition: all 0.2s; margin-bottom: -1px;
        }
        .pt-tab.active { color: #F26B8A; border-bottom-color: #F26B8A; }

        /* BODY */
        .pt-body {
          flex: 1; overflow: hidden; position: relative; z-index: 1;
          display: flex; gap: 0;
        }

        /* LEFT PANEL */
        .pt-left {
          width: 340px; flex-shrink: 0;
          border-right: 1px solid #EDE8E1;
          display: flex; flex-direction: column;
          overflow: hidden;
          background: #fff;
        }

        /* Phase pill */
        .pt-phase {
          padding: 14px 20px;
          border-bottom: 1px solid #EDE8E1;
          display: flex; align-items: center; gap: 12px;
        }
        .pt-phase-dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        }
        .pt-phase-label { font-size: 13px; font-weight: 600; }
        .pt-phase-desc  { font-size: 12px; color: #A89B8C; margin-top: 1px; }

        /* Settings */
        .pt-settings {
          padding: 16px 20px;
          border-bottom: 1px solid #EDE8E1;
          display: flex; flex-direction: column; gap: 12px;
        }
        .pt-settings-title { font-size: 11px; font-weight: 600; color: #C4B8AB; letter-spacing: 0.07em; text-transform: uppercase; }
        .pt-slider-row { display: flex; flex-direction: column; gap: 6px; }
        .pt-slider-label {
          display: flex; justify-content: space-between;
          font-size: 12.5px; color: #6B5E52; font-weight: 500;
        }
        .pt-slider-val {
          font-weight: 600; color: #F26B8A;
        }
        .pt-slider {
          -webkit-appearance: none; width: 100%; height: 4px;
          background: #EDE8E1; border-radius: 99px; outline: none;
        }
        .pt-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: #F26B8A;
          cursor: pointer; box-shadow: 0 2px 8px rgba(242,107,138,0.4);
        }

        /* Legend */
        .pt-legend {
          padding: 14px 20px;
          border-bottom: 1px solid #EDE8E1;
          display: flex; flex-direction: column; gap: 8px;
        }
        .pt-legend-title { font-size: 11px; font-weight: 600; color: #C4B8AB; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 2px; }
        .pt-legend-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6B5E52; }
        .legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }

        /* Stats */
        .pt-stats {
          padding: 14px 20px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; flex: 1; align-content: start;
        }
        .stat-box {
          background: #FAF7F4; border: 1px solid #EDE8E1;
          border-radius: 14px; padding: 12px;
        }
        .stat-val { font-size: 1.35rem; font-weight: 700; color: #1C1612; line-height: 1; }
        .stat-lbl { font-size: 11px; color: #A89B8C; margin-top: 4px; }

        /* RIGHT — CALENDAR */
        .pt-right {
          flex: 1; overflow: hidden;
          display: flex; flex-direction: column;
          padding: 20px 24px;
        }

        /* Month nav */
        .cal-nav {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .cal-nav-btn {
          width: 34px; height: 34px; border-radius: 10px;
          background: #fff; border: 1px solid #EDE8E1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: #6B5E52;
        }
        .cal-nav-btn:hover { background: #EDE8E1; }
        .cal-month {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 700; color: #1C1612; letter-spacing: -0.01em;
        }

        /* Action buttons */
        .cal-actions {
          display: flex; gap: 8px; margin-bottom: 16px;
        }
        .cal-btn {
          flex: 1; padding: 9px 14px; border-radius: 11px;
          font-family: 'Figtree', sans-serif; font-size: 12.5px; font-weight: 500;
          border: 1px solid #EDE8E1; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .cal-btn-primary {
          background: linear-gradient(135deg, #F26B8A, #F99BB4);
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 14px rgba(242,107,138,0.3);
        }
        .cal-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(242,107,138,0.38); }
        .cal-btn-secondary { background: #fff; color: #6B5E52; }
        .cal-btn-secondary:hover { background: #EDE8E1; }
        .cal-btn-danger { background: #FFEEE9; color: #F06A4A; border-color: #FFC9B8; }

        /* Day labels */
        .cal-days-header {
          display: grid; grid-template-columns: repeat(7, 1fr);
          gap: 4px; margin-bottom: 6px;
        }
        .cal-day-label {
          text-align: center; font-size: 11px; font-weight: 600;
          color: #C4B8AB; letter-spacing: 0.05em; padding: 4px 0;
        }

        /* Grid */
        .cal-grid {
          display: grid; grid-template-columns: repeat(7, 1fr);
          gap: 4px; flex: 1;
        }
        .cal-cell {
          aspect-ratio: 1;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          user-select: none;
        }
        .cal-cell:hover { filter: brightness(0.93); }
        .cal-cell.empty { cursor: default; }
        .cal-cell.empty:hover { filter: none; }
        .cal-cell-log-dot {
          position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%; background: #A89B8C;
        }

        /* LOG PANEL OVERLAY */
        .log-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(28,22,18,0.35); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .log-panel {
          background: #fff; border-radius: 24px;
          width: 420px; max-width: calc(100vw - 40px);
          padding: 28px; box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          animation: slideUp 0.25s cubic-bezier(0.23,1,0.32,1);
          max-height: 80vh; overflow-y: auto;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .log-panel::-webkit-scrollbar { width: 4px; }
        .log-panel::-webkit-scrollbar-thumb { background: #EDE8E1; border-radius: 99px; }

        .log-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 700; color: #1C1612;
          margin-bottom: 20px;
        }
        .log-section-label {
          font-size: 11px; font-weight: 600; color: #C4B8AB;
          letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 8px;
        }
        .log-section { margin-bottom: 20px; }

        /* Symptom chips */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip {
          padding: 6px 13px; border-radius: 99px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          border: 1px solid #EDE8E1; background: #FAF7F4; color: #6B5E52;
          transition: all 0.15s;
        }
        .chip.active { background: #FFE8EF; border-color: #F9C0CF; color: #F26B8A; }

        /* Flow buttons */
        .flow-row { display: flex; gap: 8px; }
        .flow-btn {
          flex: 1; padding: 8px; border-radius: 10px; border: 1px solid #EDE8E1;
          background: #FAF7F4; font-size: 12px; font-weight: 500; color: #6B5E52;
          cursor: pointer; text-align: center; transition: all 0.15s;
        }
        .flow-btn.active { background: #FFE8EF; border-color: #F26B8A; color: #F26B8A; }

        /* Mood */
        .mood-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .mood-btn {
          padding: 8px 12px; border-radius: 10px; border: 1px solid #EDE8E1;
          background: #FAF7F4; font-size: 13px; cursor: pointer;
          transition: all 0.15s; display: flex; flex-direction: column;
          align-items: center; gap: 2px; min-width: 56px;
        }
        .mood-btn span { font-size: 10px; color: #A89B8C; font-weight: 500; }
        .mood-btn.active { background: #FEF3C7; border-color: #FCD34D; }

        /* Save btn */
        .log-save-btn {
          width: 100%; padding: 13px; border-radius: 14px;
          background: linear-gradient(135deg, #F26B8A, #F99BB4);
          color: #fff; border: none; font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          box-shadow: 0 4px 14px rgba(242,107,138,0.3);
          transition: all 0.2s; margin-top: 4px;
        }
        .log-save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(242,107,138,0.38); }

        /* INSIGHTS TAB */
        .insights-body {
          flex: 1; overflow-y: auto; padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .insights-body::-webkit-scrollbar { width: 4px; }
        .insights-body::-webkit-scrollbar-thumb { background: #EDE8E1; border-radius: 99px; }
        .insight-card {
          background: #fff; border: 1px solid #EDE8E1;
          border-radius: 18px; padding: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .insight-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 700; color: #1C1612; margin-bottom: 12px;
        }
        .cycle-bar {
          height: 16px; border-radius: 99px; width: 100%;
          display: flex; overflow: hidden; margin-bottom: 10px;
        }
        .cycle-seg { height: 100%; }
        .cycle-legend { display: flex; flex-wrap: wrap; gap: 10px; }
        .cycle-legend-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #6B5E52; }
        .cycle-legend-dot { width: 10px; height: 10px; border-radius: 3px; }

        .tip-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid #FAF7F4; }
        .tip-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tip-text { font-size: 13px; color: #6B5E52; line-height: 1.5; }
        .tip-label { font-size: 11px; font-weight: 600; color: #A89B8C; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>

      <div className="pt-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grain" />

        {/* ── HEADER ── */}
        <header className="pt-header">
          <button className="pt-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="pt-header-center">
            <h1 className="pt-header-title">Period Tracker</h1>
            <p className="pt-header-sub">Track · Predict · Understand</p>
          </div>
          <div className="pt-header-badge">
            <Droplets size={12} />
            {periods.length} cycles logged
          </div>
        </header>

        {/* ── TABS ── */}
        <div className="pt-tabs">
          <button className={`pt-tab ${tab === "calendar" ? "active" : ""}`} onClick={() => setTab("calendar")}>Calendar</button>
          <button className={`pt-tab ${tab === "insights" ? "active" : ""}`} onClick={() => setTab("insights")}>Insights</button>
        </div>

        {/* ── BODY ── */}
        <div className="pt-body">

          {/* ── LEFT SIDEBAR ── */}
          <div className="pt-left">
            {/* Current phase */}
            <div className="pt-phase">
              <div className="pt-phase-dot" style={{ background: currentPhase.color }} />
              <div>
                <div className="pt-phase-label" style={{ color: currentPhase.color }}>{currentPhase.label}</div>
                <div className="pt-phase-desc">{currentPhase.desc}</div>
              </div>
            </div>

            {/* Sliders */}
            <div className="pt-settings">
              <div className="pt-settings-title">Cycle Settings</div>
              <div className="pt-slider-row">
                <div className="pt-slider-label">
                  <span>Cycle Length</span>
                  <span className="pt-slider-val">{cycleLength}d</span>
                </div>
                <input type="range" min={21} max={45} value={cycleLength}
                  onChange={e => setCycleLength(+e.target.value)} className="pt-slider" />
              </div>
              <div className="pt-slider-row">
                <div className="pt-slider-label">
                  <span>Period Length</span>
                  <span className="pt-slider-val">{periodLength}d</span>
                </div>
                <input type="range" min={2} max={10} value={periodLength}
                  onChange={e => setPeriodLength(+e.target.value)} className="pt-slider" />
              </div>
            </div>

            {/* Legend */}
            <div className="pt-legend">
              <div className="pt-legend-title">Legend</div>
              {[
                { color: "#F26B8A", label: "Period (logged)" },
                { color: "#FFC5D4", label: "Predicted period" },
                { color: "#FB923C", label: "Ovulation day" },
                { color: "#FEF3C7", label: "Fertile window" },
              ].map(l => (
                <div key={l.label} className="pt-legend-row">
                  <div className="legend-dot" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="pt-stats">
              <div className="stat-box">
                <div className="stat-val">{avgCycle}d</div>
                <div className="stat-lbl">Avg cycle</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{periodLength}d</div>
                <div className="stat-lbl">Period length</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{daysUntilNext !== null ? `${daysUntilNext}d` : "—"}</div>
                <div className="stat-lbl">Until next</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{periods.length}</div>
                <div className="stat-lbl">Cycles logged</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: CALENDAR or INSIGHTS ── */}
          {tab === "calendar" ? (
            <div className="pt-right">
              {/* Month nav */}
              <div className="cal-nav">
                <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
                <span className="cal-month">{MONTHS[viewMonth]} {viewYear}</span>
                <button className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
              </div>

              {/* Action buttons */}
              <div className="cal-actions">
                {!selecting ? (
                  <button className="cal-btn cal-btn-primary" onClick={() => setSelecting(true)}>
                    <Plus size={14} /> Log Period
                  </button>
                ) : (
                  <>
                    <button className="cal-btn cal-btn-primary" onClick={confirmPeriod} disabled={!selectStart}>
                      <Check size={14} /> {selectStart ? "Confirm" : "Select start date"}
                    </button>
                    <button className="cal-btn cal-btn-secondary" onClick={cancelSelect}>
                      <X size={14} /> Cancel
                    </button>
                  </>
                )}
                {periods.length > 0 && !selecting && (
                  <button className="cal-btn cal-btn-danger" onClick={() => setPeriods(p => p.slice(0,-1))}>
                    Undo Last
                  </button>
                )}
              </div>

              {selecting && (
                <div style={{ marginBottom: 10, padding: "8px 14px", background: "#FFF8F0", border: "1px solid #FCD34D", borderRadius: 10, fontSize: 12, color: "#92400E" }}>
                  {!selectStart ? "Click a day to mark period start" : !selectEnd ? "Click another day to mark period end (or Confirm for single day)" : "Click Confirm to save"}
                </div>
              )}

              {/* Day labels */}
              <div className="cal-days-header">
                {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
              </div>

              {/* Calendar grid */}
              <div className="cal-grid">
                {calDays.map(({ key, overflow }, idx) => {
                  const dayNum = new Date(key + "T00:00:00").getDate();
                  const { isPeriod, isPredicted, isFertile, isOvulation, isToday, isInSelect, isSelectStart, hasLog } = getDayMeta(key, overflow);

                  // Cell background (the full cell)
                  let cellBg = "transparent";
                  if (!overflow && (isInSelect || isSelectStart)) cellBg = "#FFDDE6";
                  else if (!overflow && isFertile && !isPeriod) cellBg = "#FFF8E6";

                  // The inner circle/pill color
                  let circleBg = "transparent";
                  let circleColor = overflow ? "#C4B8AB" : "#1C1612";
                  let circleSize = "32px";
                  let circleFontWeight = "400";
                  let circleStyle: React.CSSProperties = {};

                  if (isPeriod) {
                    circleBg = "#F26B8A";
                    circleColor = "#fff";
                    circleFontWeight = "700";
                    circleStyle = { boxShadow: "0 3px 10px rgba(242,107,138,0.55)" };
                  } else if (isPredicted) {
                    circleBg = "#FFC5D4";
                    circleColor = "#B0304F";
                    circleFontWeight = "600";
                    circleStyle = { border: "2px dashed #F26B8A" };
                  } else if (isOvulation) {
                    circleBg = "#FB923C";
                    circleColor = "#fff";
                    circleFontWeight = "700";
                    circleStyle = { boxShadow: "0 3px 10px rgba(251,146,60,0.5)" };
                  } else if (isToday && !overflow) {
                    circleBg = "#1C1612";
                    circleColor = "#FAF7F4";
                    circleFontWeight = "700";
                  } else if (overflow) {
                    circleColor = "#D4C8BC";
                  }

                  return (
                    <div
                      key={`${key}-${idx}`}
                      onClick={() => !overflow && handleDayClick(key)}
                      style={{
                        background: cellBg,
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: overflow ? "default" : "pointer",
                        transition: "all 0.15s",
                        position: "relative",
                        padding: "4px 0",
                        minHeight: 44,
                      }}
                    >
                      {/* Fertile window underline bar */}
                      {isFertile && !isPeriod && !overflow && (
                        <div style={{ position: "absolute", bottom: 4, left: "20%", right: "20%", height: 3, borderRadius: 99, background: "#FCD34D", opacity: 0.8 }} />
                      )}

                      {/* Main circle */}
                      <div style={{
                        width: circleSize, height: circleSize,
                        borderRadius: "50%",
                        background: circleBg,
                        color: circleColor,
                        fontWeight: circleFontWeight,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13,
                        fontFamily: "'Figtree', sans-serif",
                        transition: "all 0.15s",
                        ...circleStyle,
                      }}>
                        {isPeriod ? "🩸" : dayNum}
                      </div>

                      {/* Log dot */}
                      {hasLog && !overflow && (
                        <div style={{
                          width: 4, height: 4, borderRadius: "50%",
                          background: isPeriod ? "rgba(255,255,255,0.7)" : "#F26B8A",
                          marginTop: 2,
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <p style={{ fontSize: 11, color: "#C4B8AB", textAlign: "center", marginTop: 10 }}>
                Tap any day to log symptoms, flow & mood
              </p>
            </div>
          ) : (
            /* ── INSIGHTS ── */
            <div className="insights-body">

              {/* Cycle bar */}
              <div className="insight-card">
                <div className="insight-card-title">Your Cycle Overview</div>
                <div className="cycle-bar">
                  <div className="cycle-seg" style={{ width: `${(periodLength/cycleLength)*100}%`, background: "#F26B8A" }} />
                  <div className="cycle-seg" style={{ width: `${(7/cycleLength)*100}%`, background: "#34D399" }} />
                  <div className="cycle-seg" style={{ width: `${(5/cycleLength)*100}%`, background: "#FEF3C7", border: "1px solid #FCD34D" }} />
                  <div className="cycle-seg" style={{ flex: 1, background: "#A78BFA22", border: "1px solid #A78BFA44" }} />
                </div>
                <div className="cycle-legend">
                  {[
                    { color: "#F26B8A", label: `Menstrual (${periodLength}d)` },
                    { color: "#34D399", label: "Follicular" },
                    { color: "#FEF3C7", label: "Fertile window" },
                    { color: "#A78BFA44", label: "Luteal" },
                  ].map(l => (
                    <div key={l.label} className="cycle-legend-item">
                      <div className="cycle-legend-dot" style={{ background: l.color }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Predictions */}
              {predictions && (
                <div className="insight-card">
                  <div className="insight-card-title">Upcoming Predictions</div>
                  {[
                    { icon: <Droplets size={15} color="#F26B8A" />, bg: "#FFE8EF", label: "Next Period", val: predictions.nextStart.toLocaleDateString("en-US",{month:"short",day:"numeric"}) },
                    { icon: <Zap size={15} color="#FB923C" />, bg: "#FFF0E6", label: "Ovulation", val: predictions.ovulation.toLocaleDateString("en-US",{month:"short",day:"numeric"}) },
                    { icon: <Heart size={15} color="#F59E0B" />, bg: "#FFFBEB", label: "Fertile Window", val: `${predictions.fertileStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${predictions.fertileEnd.toLocaleDateString("en-US",{month:"short",day:"numeric"})}` },
                  ].map(r => (
                    <div key={r.label} className="tip-row">
                      <div className="tip-icon" style={{ background: r.bg }}>{r.icon}</div>
                      <div>
                        <div className="tip-label">{r.label}</div>
                        <div className="tip-text" style={{ fontWeight: 600, color: "#1C1612" }}>{r.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Phase tips */}
              <div className="insight-card">
                <div className="insight-card-title">Phase Wellness Tips</div>
                {[
                  { icon: <Thermometer size={15} color="#F26B8A" />, bg: "#FFE8EF", label: "Menstrual", text: "Rest, use a heating pad for cramps, stay hydrated with warm drinks." },
                  { icon: <Zap size={15} color="#34D399" />, bg: "#E0F7EF", label: "Follicular", text: "Energy is rising! Great time for new workouts, creative projects." },
                  { icon: <Heart size={15} color="#FB923C" />, bg: "#FFF0E6", label: "Ovulation", text: "Peak energy & confidence. Social activities and high-intensity exercise." },
                  { icon: <Moon size={15} color="#A78BFA" />, bg: "#EEEAFF", label: "Luteal", text: "Wind down, journal, eat magnesium-rich foods to ease PMS." },
                  { icon: <Wind size={15} color="#4ECDC4" />, bg: "#E0F7F6", label: "General", text: "Track symptoms consistently for better pattern recognition over time." },
                ].map(t => (
                  <div key={t.label} className="tip-row">
                    <div className="tip-icon" style={{ background: t.bg }}>{t.icon}</div>
                    <div>
                      <div className="tip-label">{t.label}</div>
                      <div className="tip-text">{t.text}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── DAY LOG PANEL ── */}
      {logPanelDate && (
        <div className="log-overlay" onClick={() => setLogPanelDate(null)}>
          <div className="log-panel" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 className="log-title" style={{ margin: 0 }}>
                Log: {new Date(logPanelDate + "T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"long",day:"numeric"})}
              </h2>
              <button onClick={() => setLogPanelDate(null)} style={{ background: "#FAF7F4", border: "1px solid #EDE8E1", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={14} color="#A89B8C" />
              </button>
            </div>

            {/* Flow */}
            <div className="log-section">
              <div className="log-section-label">Flow Intensity</div>
              <div className="flow-row">
                {FLOWS.map(f => (
                  <button key={f} className={`flow-btn ${panelFlow === f ? "active" : ""}`} onClick={() => setPanelFlow(f)}>{f}</button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="log-section">
              <div className="log-section-label">Mood</div>
              <div className="mood-row">
                {MOODS.map(m => (
                  <button key={m.label} className={`mood-btn ${panelMood === m.label ? "active" : ""}`} onClick={() => setPanelMood(m.label)}>
                    <span style={{ fontSize: 20 }}>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="log-section">
              <div className="log-section-label">Symptoms</div>
              <div className="chips">
                {SYMPTOMS.map(s => (
                  <button key={s} className={`chip ${panelSymptoms.includes(s) ? "active" : ""}`}
                    onClick={() => setPanelSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button className="log-save-btn" onClick={saveLog}>Save Log</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PeriodTracker;