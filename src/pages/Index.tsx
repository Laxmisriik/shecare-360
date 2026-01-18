import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import FlowerBackground from "@/components/FlowerBackground";

import { Button } from "@/components/ui/button";
import {
  Heart,
  Calendar,
  Baby,
  Activity,
  Droplets,
  BookOpen,
  Utensils,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import HamsterAnimation from "@/components/HamsterAnimation";

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setStatsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* HEADER */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-6 py-6 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-soft">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FemCare
            </h1>
            <p className="text-sm text-muted-foreground">
              Your wellness companion
            </p>
          </div>
        </div>
      </header>

      {/* HERO */}
        <section className="container mx-auto px-6 py-16 text-center relative overflow-hidden">
        <FlowerBackground />
        <div className="max-w-4xl mx-auto relative z-10">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-bounce">
              <Sparkles className="w-4 h-4" />
              All-in-one women wellness dashboard
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                background:
                  "linear-gradient(to right, hsl(320,65%,75%), hsl(340,75%,85%), hsl(180,60%,80%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Take Control of Your Wellness Journey
            </h2>

            <p className="text-lg text-muted-foreground mb-10">
              Mental health, menstrual care, pregnancy insights and nutrition —
              beautifully organized in one place.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE DASHBOARD */}
      <section className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Animation */}
          <div className="flex justify-center">
            <HamsterAnimation />
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={<BookOpen />}
              title="Mental Health Journal"
              desc="AI chat • Mood tracking • Reflections"
              onClick={() => navigate("/mental-health-journal")}
            />

            <FeatureCard
              icon={<Calendar />}
              title="Period Tracker"
              desc="Cycles • Symptoms • Predictions"
              onClick={() => navigate("/period-tracker")}
            />

            <FeatureCard
              icon={<Baby />}
              title="Pregnancy Tracker"
              desc="Weekly milestones • Baby growth"
              onClick={() => navigate("/pregnancy")}
            />

            <FeatureCard
              icon={<Utensils />}
              title="Diet & Nutrition"
              desc="Hormone-friendly food guidance"
              onClick={() => navigate("/diet")}
            />
          </div>
        </div>
      </section>

      {/* QUICK STATS STRIP */}
      <section className="container mx-auto px-6 py-16">
        <div
          className={`transition-all duration-1000 ${
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Droplets />}
              title="Cycle Prediction"
              value="Smart & Adaptive"
            />
            <StatCard
              icon={<Activity />}
              title="Health Metrics"
              value="Daily Insights"
            />
            <StatCard
              icon={<Heart />}
              title="Wellness Score"
              value="Personalized"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const FeatureCard = ({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) => (
  <Card
    onClick={onClick}
    className="cursor-pointer p-6 bg-card/80 backdrop-blur border-border/50 rounded-2xl hover:shadow-glow hover:scale-[1.02] transition"
  >
    <div className="flex items-center gap-4 mb-3">
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <ArrowRight className="ml-auto text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </Card>
);

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <Card className="p-6 text-center bg-gradient-to-br from-card to-card/80 border-border/50 shadow-soft">
    <div className="mx-auto mb-3 p-3 w-fit rounded-xl bg-primary/10 text-primary">
      {icon}
    </div>
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-lg font-bold">{value}</p>
  </Card>
);

export default Index;
