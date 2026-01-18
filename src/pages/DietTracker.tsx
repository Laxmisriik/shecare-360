import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { CyclePhaseCard } from "@/components/CyclePhaseCard";
import { FoodRecommendationCard } from "@/pages/FoodRecommendationCard";
import { HydrationTracker } from "@/components/HydrationTracker";
import { NutrientCard } from "@/components/NutrientCard";
import { QuickAddButton } from "@/components/QuickAddButton";

import { Droplets, Apple, Moon } from "lucide-react";

interface DietLog {
  meal_type: string;
  food_item: string;
  nutrients: Record<string, string>;
  logged_at: string;
}

interface Recommendations {
  missing_nutrients: string[];
  food_recommendations: Record<string, string[]>;
}

export default function DietTracker() {
  const { toast } = useToast();

  const USER_ID = 1;

  const [mealType, setMealType] = useState("breakfast");
  const [foodItem, setFoodItem] = useState("");
  const [history, setHistory] = useState<DietLog[]>([]);
  const [recommendations, setRecommendations] =
    useState<Recommendations | null>(null);

  // ---------------- FETCH HISTORY ----------------
  const fetchHistory = async () => {
    const res = await fetch(
      `http://127.0.0.1:8001/api/diet/history/${USER_ID}`
    );
    const data = await res.json();
    setHistory(data || []);
  };

  // ---------------- FETCH SMART RECOMMENDATIONS ----------------
  const fetchRecommendations = async () => {
    const res = await fetch(
      `http://127.0.0.1:8001/api/diet/recommendations/${USER_ID}`
    );
    const data = await res.json();
    setRecommendations(data);
  };

  useEffect(() => {
    fetchHistory();
    fetchRecommendations();
  }, []);

  // ---------------- SUBMIT MEAL ----------------
  const handleSubmit = async () => {
    if (!foodItem.trim()) {
      toast({
        title: "Missing data",
        description: "Please enter a food item",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch("http://127.0.0.1:8001/api/diet/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: USER_ID,
          meal_type: mealType,
          food_item: foodItem,
        }),
      });

      toast({
        title: "Meal logged 🥗",
        description: "Nutrients analyzed successfully",
      });

      setFoodItem("");
      fetchHistory();
      fetchRecommendations();
    } catch {
      toast({
        title: "Error",
        description: "Failed to log meal",
        variant: "destructive",
      });
    }
  };

  // ---------------- DERIVE NUTRIENT SNAPSHOT ----------------
  const nutrientCount: Record<string, number> = {};
  history.forEach((meal) => {
    Object.keys(meal.nutrients || {}).forEach((n) => {
      nutrientCount[n] = (nutrientCount[n] || 0) + 1;
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40">
      <main className="container mx-auto px-6 py-8 space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Health Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered nutrition insights 🌸
          </p>
        </div>

        {/* CYCLE OVERVIEW */}
        <CyclePhaseCard currentPhase="follicular" dayInCycle={9} />

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-4">
          <QuickAddButton icon={Droplets} label="Water" />
          <QuickAddButton icon={Apple} label="Meal" />
          <QuickAddButton icon={Moon} label="Sleep" />
        </div>

        {/* HYDRATION */}
        <HydrationTracker />

        {/* SMART FOOD RECOMMENDATIONS */}
        {recommendations && (
          <FoodRecommendationCard
            title="Foods You Should Add Today"
            variant="sage"
            foods={Object.values(recommendations.food_recommendations)
              .flat()
              .map((food) => ({
                name: food,
                benefit: "Covers missing nutrients",
                emoji: "🥗",
              }))}
          />
        )}

        {/* NUTRIENT SNAPSHOT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NutrientCard
            name="Protein"
            current={nutrientCount["protein"] || 0}
            target={3}
            icon="💪"
          />
          <NutrientCard
            name="Fiber"
            current={nutrientCount["fiber"] || 0}
            target={3}
            icon="🌾"
          />
          <NutrientCard
            name="Iron"
            current={nutrientCount["iron"] || 0}
            target={2}
            icon="🩸"
          />
        </div>

        {/* DIET LOGGER + HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LOG MEAL */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Log a Meal</h2>

            <div className="space-y-3">
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option>breakfast</option>
                <option>lunch</option>
                <option>dinner</option>
                <option>snack</option>
              </select>

              <input
                placeholder="Food item (e.g., oats, egg, spinach)"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <Button className="w-full" onClick={handleSubmit}>
                Save Meal
              </Button>
            </div>
          </Card>

          {/* MEAL HISTORY */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>

            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No meals logged yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {history.slice(0, 5).map((item, i) => (
                  <li key={i} className="border-b pb-3 text-sm">
                    <div className="flex justify-between">
                      <span>
                        🍽 <b>{item.meal_type}</b> – {item.food_item}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(item.logged_at).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      Nutrients:{" "}
                      {Object.keys(item.nutrients || {}).join(", ") || "Unknown"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
