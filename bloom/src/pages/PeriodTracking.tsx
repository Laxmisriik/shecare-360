import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BloomLogo from "@/components/BloomLogo";
import { ArrowLeft, Flower2, Droplets, Sun, Moon, Sparkles } from "lucide-react";

const phases = [
  {
    id: "period",
    name: "Period",
    days: "1-5",
    description: "Your body is shedding the uterine lining. You may feel tired and need extra rest.",
    tips: ["Rest when you need to", "Stay hydrated", "Gentle stretching helps", "Iron-rich foods are beneficial"],
    icon: Droplets,
    gradient: "gradient-peach",
    energy: "Low to Medium",
    mood: "May feel introspective",
  },
  {
    id: "follicular",
    name: "Follicular",
    days: "6-11",
    description: "Estrogen rises as your body prepares to release an egg. Energy starts to increase!",
    tips: ["Great time for new projects", "Try challenging workouts", "Social activities feel easier", "Creativity peaks"],
    icon: Sun,
    gradient: "gradient-mint",
    energy: "Rising",
    mood: "Optimistic & motivated",
  },
  {
    id: "ovulation",
    name: "Ovulation",
    days: "12-16",
    description: "Peak fertility window. You're at your most confident and energetic!",
    tips: ["Perfect for important meetings", "High-intensity workouts", "Communication flows easily", "Most fertile time"],
    icon: Sparkles,
    gradient: "gradient-lavender",
    energy: "Peak",
    mood: "Confident & social",
  },
  {
    id: "luteal",
    name: "Luteal",
    days: "17-28",
    description: "Progesterone rises. You may notice PMS symptoms as your body prepares for menstruation.",
    tips: ["Practice self-compassion", "Comfort foods are okay", "Slow down your pace", "Prioritize sleep"],
    icon: Moon,
    gradient: "gradient-peach",
    energy: "Decreasing",
    mood: "May feel emotional",
  },
];

const PeriodTracking = () => {
  const [currentDay] = useState(14);
  const currentPhase = phases[2]; // Ovulation for demo

  return (
    <div className="min-h-screen gradient-soft">
      {/* Header */}
      <header className="glass border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <BloomLogo size="sm" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-8 relative">
              <div className={`absolute top-0 right-0 w-64 h-64 ${currentPhase.gradient} opacity-40 blur-3xl`} />
              
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  className={`w-32 h-32 rounded-full ${currentPhase.gradient} flex items-center justify-center shadow-card`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground">Day</div>
                    <div className="text-5xl font-bold text-foreground">{currentDay}</div>
                  </div>
                </motion.div>

                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <currentPhase.icon className="w-6 h-6 text-primary-deep" />
                    <span className="text-lg font-medium text-primary-deep">{currentPhase.name} Phase</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold mb-3">
                    {currentPhase.description}
                  </h1>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="px-4 py-2 rounded-full bg-card shadow-soft">
                      <span className="text-sm text-muted-foreground">Energy: </span>
                      <span className="font-medium">{currentPhase.energy}</span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-card shadow-soft">
                      <span className="text-sm text-muted-foreground">Mood: </span>
                      <span className="font-medium">{currentPhase.mood}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips for today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold mb-4">Tips for Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPhase.tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card variant="feature" className="h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <Flower2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="font-medium">{tip}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cycle phases overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-display font-bold mb-4">Your Cycle Phases</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  variant={phase.id === currentPhase.id ? "gradient" : "default"}
                  className={`text-center p-4 ${phase.id === currentPhase.id ? "ring-2 ring-primary" : ""}`}
                >
                  <div className={`w-12 h-12 rounded-full ${phase.gradient} flex items-center justify-center mx-auto mb-3`}>
                    <phase.icon className="w-6 h-6 text-foreground/80" />
                  </div>
                  <h3 className="font-display font-bold mb-1">{phase.name}</h3>
                  <p className="text-xs text-muted-foreground">Days {phase.days}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PeriodTracking;
