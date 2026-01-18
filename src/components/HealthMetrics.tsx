import { Card } from "@/components/ui/card";
import { Activity, Heart, Thermometer, Moon, Droplet, Zap } from "lucide-react";

export const HealthMetrics = () => {
  const metrics = [
    {
      icon: Heart,
      label: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "normal",
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      icon: Activity,
      label: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "optimal",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Thermometer,
      label: "Basal Temp",
      value: "97.8",
      unit: "°F",
      status: "normal",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Moon,
      label: "Sleep Quality",
      value: "8.2",
      unit: "hours",
      status: "good",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Droplet,
      label: "Hydration",
      value: "6",
      unit: "glasses",
      status: "target",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      icon: Zap,
      label: "Energy Level",
      value: "85",
      unit: "%",
      status: "high",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Health Vitals</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.label}
              className="p-5 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted/50 text-muted-foreground capitalize">
                  {metric.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-bold">
                  {metric.value}
                  <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
