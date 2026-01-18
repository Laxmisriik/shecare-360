import { Card } from "@/components/ui/card";
import { Baby, Heart, Scale, Ruler } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const PregnancyTracker = () => {
  const weekProgress = (12 / 40) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10">
            <Baby className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="text-xl font-semibold">Pregnancy Journey</h2>
        </div>
        <span className="text-sm text-muted-foreground">2nd Trimester</span>
      </div>

      {/* Week Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Week Progress</span>
          <span className="text-sm font-semibold">Week 12 of 40</span>
        </div>
        <Progress value={weekProgress} className="h-3" />
      </div>

      {/* Baby Development */}
      <div className="bg-gradient-to-br from-secondary/10 to-primary/5 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-secondary/20">
            <Baby className="w-8 h-8 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Your Baby This Week</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your baby is now about the size of a plum! All major organs are formed and they're starting to practice swallowing and kicking.
            </p>
          </div>
        </div>
      </div>

      {/* Baby Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
          <div className="p-2 rounded-lg bg-accent/10">
            <Ruler className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Length</p>
            <p className="text-sm font-semibold">2.5 inches</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="text-sm font-semibold">0.5 oz</p>
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-card">
            <Heart className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium">Next Checkup</p>
            <p className="text-xs text-muted-foreground">Dr. Smith - Ultrasound</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-secondary">Jan 30</span>
      </div>
    </Card>
  );
};
