import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BloomLogo from "@/components/BloomLogo";
import { ArrowLeft, Apple, Plus, Check, AlertCircle, Leaf } from "lucide-react";
import { toast } from "sonner";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const suggestedFoods = {
  ovulation: [
    { name: "Leafy greens", benefit: "Rich in folate", icon: "🥬" },
    { name: "Salmon", benefit: "Omega-3s for hormone balance", icon: "🐟" },
    { name: "Berries", benefit: "Antioxidants", icon: "🫐" },
    { name: "Avocado", benefit: "Healthy fats", icon: "🥑" },
  ],
};

const nutrients = [
  { name: "Iron", current: 65, target: 100, color: "bg-primary" },
  { name: "Vitamin D", current: 40, target: 100, color: "bg-secondary" },
  { name: "Calcium", current: 80, target: 100, color: "bg-mint" },
  { name: "Omega-3", current: 50, target: 100, color: "bg-accent" },
];

const DietNutrition = () => {
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [loggedMeals, setLoggedMeals] = useState<string[]>([]);

  const logMeal = (meal: string) => {
    if (!loggedMeals.includes(meal)) {
      setLoggedMeals([...loggedMeals, meal]);
      toast.success(`${meal} logged!`);
    }
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">Diet & Nutrition</h1>
          <p className="text-muted-foreground">
            Personalized nutrition based on your cycle phase
          </p>
        </motion.div>

        {/* Suggested foods for current phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-mint" />
                <h2 className="text-xl font-display font-bold">Suggested for Ovulation Phase</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                During ovulation, focus on foods that support hormone balance and energy
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestedFoods.ovulation.map((food, index) => (
                  <motion.div
                    key={food.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card variant="soft" className="text-center p-4 h-full">
                      <div className="text-3xl mb-2">{food.icon}</div>
                      <h3 className="font-medium mb-1">{food.name}</h3>
                      <p className="text-xs text-muted-foreground">{food.benefit}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meal logging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-bold mb-4">Log Your Meals</h2>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {mealTypes.map((meal) => (
              <Button
                key={meal}
                variant={selectedMeal === meal ? "hero" : "soft"}
                size="sm"
                onClick={() => setSelectedMeal(meal)}
              >
                {loggedMeals.includes(meal) && <Check className="w-4 h-4 mr-1" />}
                {meal}
              </Button>
            ))}
          </div>

          <Card variant="feature">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">{selectedMeal}</h3>
                {loggedMeals.includes(selectedMeal) ? (
                  <span className="text-sm text-mint flex items-center gap-1">
                    <Check className="w-4 h-4" /> Logged
                  </span>
                ) : null}
              </div>
              
              <Button
                variant={loggedMeals.includes(selectedMeal) ? "soft" : "hero"}
                className="w-full"
                onClick={() => logMeal(selectedMeal)}
                disabled={loggedMeals.includes(selectedMeal)}
              >
                <Plus className="w-5 h-5 mr-2" />
                {loggedMeals.includes(selectedMeal) ? "Already Logged" : `Log ${selectedMeal}`}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nutrient tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-display font-bold">Daily Nutrients</h2>
            <div className="px-2 py-1 rounded-full bg-accent-soft text-xs font-medium">
              Track your intake
            </div>
          </div>
          
          <div className="grid gap-4">
            {nutrients.map((nutrient, index) => (
              <motion.div
                key={nutrient.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card variant="default">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{nutrient.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {nutrient.current}%
                        {nutrient.current < 50 && (
                          <AlertCircle className="w-4 h-4 inline ml-1 text-accent" />
                        )}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${nutrient.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${nutrient.current}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DietNutrition;
