import { Link } from "react-router-dom";
import { BookOpen, CalendarHeart, Utensils, AlertTriangle, Sparkles, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const timeEmoji = hour < 12 ? "🌸" : hour < 17 ? "☀️" : "🌙";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Figtree:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: #FAF7F4;
          font-family: 'Figtree', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 { width: 520px; height: 520px; background: #F26B8A1E; top: -140px; right: -120px; }
        .blob-2 { width: 420px; height: 420px; background: #7C6AF71A; bottom: -60px; left: -100px; }
        .blob-3 { width: 280px; height: 280px; background: #3DB88B14; top: 45%; left: 42%; }

        .grain {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.032;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 180px;
        }

        .db-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 56px 32px 80px;
        }

        .db-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 56px; gap: 20px; flex-wrap: wrap;
        }
        .db-greeting {
          font-size: 12.5px; font-weight: 500; letter-spacing: 0.09em;
          text-transform: uppercase; color: #A89B8C; margin-bottom: 12px;
        }
        .db-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 700; line-height: 1.1;
          color: #1C1612; letter-spacing: -0.02em;
        }
        .db-title em { font-style: italic; color: #F26B8A; }
        .db-sub {
          margin-top: 14px;
          font-size: 14.5px; font-weight: 300; color: #A89B8C; line-height: 1.65;
          max-width: 340px;
        }

        .db-avatar-cluster {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-top: 8px;
        }
        .db-spark {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 99px;
          background: #fff; border: 1px solid #EDE8E1;
          font-size: 12px; font-weight: 500; color: #A89B8C;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); white-space: nowrap;
        }
        .db-avatar-ring {
          width: 46px; height: 46px; border-radius: 50%;
          background: linear-gradient(135deg, #F26B8A, #7C6AF7);
          padding: 2.5px; flex-shrink: 0;
        }
        .db-avatar-inner {
          width: 100%; height: 100%; border-radius: 50%;
          background: #FAF7F4;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; color: #1C1612; font-size: 15px;
        }

        .db-divider {
          display: flex; align-items: center; gap: 16px; margin-bottom: 28px;
        }
        .db-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, #EDE8E1, transparent);
        }
        .db-divider-text {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: #C4B8AB; font-weight: 500;
        }

        /* ---- GRID ---- */
        .db-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 18px;
        }

        .db-card {
          background: #fff;
          border-radius: 22px;
          padding: 30px 30px 56px;
          border: 1px solid #EDE8E1;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02);
          text-decoration: none; color: inherit; display: block;
          transition: transform 0.3s cubic-bezier(0.23,1,0.32,1),
                      box-shadow 0.3s cubic-bezier(0.23,1,0.32,1);
          position: relative; overflow: hidden;
        }
        .db-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.09), 0 4px 14px rgba(0,0,0,0.05);
        }

        /* Asymmetric layout */
        .card-journal { grid-column: span 7; }
        .card-period  { grid-column: span 5; }
        .card-diet    { grid-column: span 5; }
        .card-sos     { grid-column: span 7; }

        @media (max-width: 820px) {
          .card-journal, .card-period, .card-diet, .card-sos { grid-column: span 12; }
        }

        /* Background splash circle */
        .card-splash {
          position: absolute; top: -50px; right: -50px;
          width: 190px; height: 190px; border-radius: 50%;
          opacity: 0.2; pointer-events: none;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .db-card:hover .card-splash { opacity: 0.32; transform: scale(1.08); }

        .card-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 99px;
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em;
          text-transform: uppercase; margin-bottom: 18px;
        }
        .card-tag-dot { width: 5px; height: 5px; border-radius: 50%; }

        .card-icon {
          width: 50px; height: 50px; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }

        .card-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 700; line-height: 1.18;
          color: #1C1612; margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .card-label-lg { font-size: 1.95rem; }

        .card-desc {
          font-size: 13.5px; font-weight: 300; color: #A89B8C; line-height: 1.65;
        }

        /* Hover-reveal arrow */
        .card-arrow {
          position: absolute; bottom: 24px; right: 24px;
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: #F5F0EB; border: 1px solid #EDE8E1;
          opacity: 0; transform: translate(6px, -6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .db-card:hover .card-arrow { opacity: 1; transform: translate(0, 0); }

        .db-footer-note {
          text-align: center; margin-top: 52px;
          font-size: 13px; color: #C4B8AB; font-weight: 300; letter-spacing: 0.02em;
        }

        /* Stagger fade-up */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { animation: fadeUp 0.65s cubic-bezier(0.23,1,0.32,1) both; }
        .d1 { animation-delay: 0.04s; }
        .d2 { animation-delay: 0.12s; }
        .d3 { animation-delay: 0.20s; }
        .d4 { animation-delay: 0.28s; }
        .d5 { animation-delay: 0.36s; }
        .d6 { animation-delay: 0.44s; }
        .d7 { animation-delay: 0.52s; }
      `}</style>

      <div className="db-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grain" />

        <div className="db-inner">

          {/* Header */}
          <div className="db-header anim d1">
            <div>
              <p className="db-greeting">{timeEmoji} Good {timeOfDay}</p>
              <h1 className="db-title">
                Your wellness,<br />
                <em>your way.</em>
              </h1>
              <p className="db-sub">
                Everything you need for mental &amp; menstrual well-being — all in one place.
              </p>
            </div>
            <div className="db-avatar-cluster">
              <div className="db-spark">
                <Sparkles size={12} color="#F26B8A" />
                All good today
              </div>
              <div className="db-avatar-ring">
                <div className="db-avatar-inner">U</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="db-divider anim d2">
            <div className="db-divider-line" />
            <span className="db-divider-text">Your features</span>
            <div className="db-divider-line" />
          </div>

          {/* Card Grid */}
          <div className="db-grid">

            {/* Mental Health Journal — LARGE LEFT */}
            <Link to="/mental-health-journal" className="db-card card-journal anim d3">
              <div className="card-splash" style={{ background: "#7C6AF7" }} />
              <div className="card-tag" style={{ background: "#EEEAFF", color: "#7C6AF7" }}>
                <span className="card-tag-dot" style={{ background: "#7C6AF7" }} />
                AI-powered
              </div>
              <div className="card-icon" style={{ background: "#EEEAFF" }}>
                <BookOpen size={23} color="#7C6AF7" />
              </div>
              <h2 className="card-label card-label-lg">Mental Health Journal</h2>
              <p className="card-desc" style={{ maxWidth: 320 }}>
                Chat with AI, track your emotions, and reflect daily. Your safe space to feel and heal.
              </p>
              <div className="card-arrow">
                <ArrowUpRight size={15} color="#7C6AF7" />
              </div>
            </Link>

            {/* Period Tracker — RIGHT */}
            <Link to="/period-tracker" className="db-card card-period anim d3">
              <div className="card-splash" style={{ background: "#F26B8A" }} />
              <div className="card-tag" style={{ background: "#FFE8EF", color: "#F26B8A" }}>
                <span className="card-tag-dot" style={{ background: "#F26B8A" }} />
                Cycle sync
              </div>
              <div className="card-icon" style={{ background: "#FFE8EF" }}>
                <CalendarHeart size={23} color="#F26B8A" />
              </div>
              <h2 className="card-label">Period Tracker</h2>
              <p className="card-desc">
                Log cycles, symptoms &amp; predict your next period with ease.
              </p>
              <div className="card-arrow">
                <ArrowUpRight size={15} color="#F26B8A" />
              </div>
            </Link>

            {/* Diet Tracker — LEFT */}
            <Link to="/diet-tracker" className="db-card card-diet anim d4">
              <div className="card-splash" style={{ background: "#3DB88B" }} />
              <div className="card-tag" style={{ background: "#E0F7EF", color: "#3DB88B" }}>
                <span className="card-tag-dot" style={{ background: "#3DB88B" }} />
                Nutrition
              </div>
              <div className="card-icon" style={{ background: "#E0F7EF" }}>
                <Utensils size={23} color="#3DB88B" />
              </div>
              <h2 className="card-label">Diet Tracker</h2>
              <p className="card-desc">
                Hormone-friendly meals &amp; smart recommendations tailored for you.
              </p>
              <div className="card-arrow">
                <ArrowUpRight size={15} color="#3DB88B" />
              </div>
            </Link>

            {/* Emergency SOS — LARGE RIGHT */}
            <Link to="/emergency-sos" className="db-card card-sos anim d4">
              <div className="card-splash" style={{ background: "#F06A4A" }} />
              <div className="card-tag" style={{ background: "#FFEEE9", color: "#F06A4A" }}>
                <span className="card-tag-dot" style={{ background: "#F06A4A" }} />
                Always on
              </div>
              <div className="card-icon" style={{ background: "#FFEEE9" }}>
                <AlertTriangle size={23} color="#F06A4A" />
              </div>
              <h2 className="card-label card-label-lg">Emergency SOS</h2>
              <p className="card-desc" style={{ maxWidth: 320 }}>
                Quick access to mental health helplines &amp; crisis support. You're never alone.
              </p>
              <div className="card-arrow">
                <ArrowUpRight size={15} color="#F06A4A" />
              </div>
            </Link>

          </div>

          {/* Footer */}
          <p className="db-footer-note anim d7">bloom · your personal wellness companion 🌸</p>

        </div>
      </div>
    </>
  );
};

export default Dashboard;