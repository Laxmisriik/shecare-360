import { cn } from "@/lib/utils";

type Phase = "menstrual" | "follicular" | "ovulatory" | "luteal";

interface CyclePhaseCardProps {
  currentPhase: Phase;
  dayInCycle: number;
}

const phaseConfig = {
  menstrual: {
    title: "Menstrual Phase",
    description: "Focus on iron-rich foods & rest",
    color: "bg-coral-light border-coral",
    icon: "🌸",
    days: "Days 1–5",
  },
  follicular: {
    title: "Follicular Phase",
    description: "Light foods & fresh energy",
    color: "bg-sage-light border-sage",
    icon: "🌱",
    days: "Days 6–14",
  },
  ovulatory: {
    title: "Ovulatory Phase",
    description: "Peak vitality & confidence",
    color: "bg-peach-light border-peach",
    icon: "✨",
    days: "Days 15–17",
  },
  luteal: {
    title: "Luteal Phase",
    description: "Slow down & nourish",
    color: "bg-lavender-light border-lavender",
    icon: "🌙",
    days: "Days 18–28",
  },
};

export const CyclePhaseCard = ({
  currentPhase,
  dayInCycle,
}: CyclePhaseCardProps) => {
  const config = phaseConfig[currentPhase];

  return (
    <div
      className={cn(
        "rounded-3xl border-2 p-6 shadow-card transition-all",
        config.color
      )}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-3xl">{config.icon}</span>
            {config.title}
          </h2>
          <p className="text-sm opacity-70">{config.days}</p>
          <p className="mt-2 text-sm">{config.description}</p>
        </div>

        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
            {dayInCycle}
          </div>
          <span className="text-xs">Day</span>
        </div>
      </div>
    </div>
  );
};
