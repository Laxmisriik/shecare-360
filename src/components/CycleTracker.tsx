import { Card } from "@/components/ui/card";
import { Calendar, Moon, Sun, Sunrise } from "lucide-react";

export const CycleTracker = () => {
  const cyclePhases = [
    { name: "Menstrual", icon: Moon, active: false, color: "text-red-400" },
    { name: "Follicular", icon: Sunrise, active: true, color: "text-primary" },
    { name: "Ovulation", icon: Sun, active: false, color: "text-accent" },
    { name: "Luteal", icon: Moon, active: false, color: "text-secondary" },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Menstrual Cycle</h2>
        </div>
        <span className="text-sm text-muted-foreground">28 day cycle</span>
      </div>

      {/* Cycle Visualization */}
      <div className="mb-6">
        <div className="relative w-full h-48 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-1">14</p>
                <p className="text-sm text-muted-foreground">Cycle Day</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cyclePhases.map((phase) => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.name}
              className={`text-center p-3 rounded-xl transition-all duration-300 ${
                phase.active
                  ? "bg-primary/10 border-2 border-primary shadow-soft"
                  : "bg-muted/50 border border-border/50"
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${phase.active ? phase.color : "text-muted-foreground"}`} />
              <p className={`text-xs font-medium ${phase.active ? "text-foreground" : "text-muted-foreground"}`}>
                {phase.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Predictions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
          <span className="text-sm text-muted-foreground">Next Period</span>
          <span className="text-sm font-semibold">Jan 28, 2025</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
          <span className="text-sm text-muted-foreground">Fertile Window</span>
          <span className="text-sm font-semibold">Jan 18 - 23</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
          <span className="text-sm text-muted-foreground">Ovulation Day</span>
          <span className="text-sm font-semibold">Jan 21, 2025</span>
        </div>
      </div>
    </Card>
  );
};
