import { cn } from "@/lib/utils";

interface FoodItem {
  name: string;
  benefit: string;
  emoji: string;
}

interface FoodRecommendationCardProps {
  title: string;
  foods: FoodItem[];
  variant: "coral" | "sage" | "peach";
}

const variantStyles = {
  coral: {
    bg: "bg-card",
    accent: "bg-coral-light text-coral",
    border: "border-coral/20",
  },
  sage: {
    bg: "bg-card",
    accent: "bg-sage-light text-sage",
    border: "border-sage/20",
  },
  peach: {
    bg: "bg-card",
    accent: "bg-peach-light text-peach",
    border: "border-peach/20",
  },
};

export const FoodRecommendationCard = ({
  title,
  foods,
  variant,
}: FoodRecommendationCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-card transition-all duration-300 hover:shadow-elevated animate-fade-in",
        styles.bg,
        styles.border
      )}
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {foods.map((food, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl p-3 bg-muted/50 transition-colors hover:bg-muted"
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-xl",
                styles.accent
              )}
            >
              {food.emoji}
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">
                {food.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {food.benefit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
