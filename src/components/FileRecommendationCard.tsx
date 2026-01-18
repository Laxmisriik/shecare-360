import { cn } from "@/lib/utils";

interface FoodItem {
  name: string;
  benefit: string;
  emoji: string;
}

interface Props {
  title: string;
  foods: FoodItem[];
  variant: "coral" | "sage" | "peach";
}

export const FoodRecommendationCard = ({
  title,
  foods,
  variant,
}: Props) => {
  return (
    <div className="rounded-2xl border p-5 shadow-card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {foods.map((food, i) => (
          <div
            key={i}
            className="flex gap-3 items-center bg-muted/50 rounded-xl p-3"
          >
            <span className="text-xl">{food.emoji}</span>
            <div>
              <p className="font-medium">{food.name}</p>
              <p className="text-xs opacity-70">{food.benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
