import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookOpen, CalendarHeart, Utensils } from "lucide-react";

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

      <Link to="/mental-health-journal">
        <Card className="p-8 text-center hover:shadow-glow transition">
          <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center rounded-2xl bg-indigo-500">
            <BookOpen className="text-white w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Mental Health Journal
          </h3>
          <p className="text-sm text-muted-foreground">
            AI chat • Mood tracking • Reflection
          </p>
        </Card>
      </Link>

      <Link to="/period-tracker">
        <Card className="p-8 text-center hover:shadow-glow transition">
          <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center rounded-2xl bg-pink-500">
            <CalendarHeart className="text-white w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Period Tracker
          </h3>
          <p className="text-sm text-muted-foreground">
            Cycles • Symptoms • Predictions
          </p>
        </Card>
      </Link>

      <Link to="/diet-tracker">
        <Card className="p-8 text-center hover:shadow-glow transition">
          <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-500">
            <Utensils className="text-white w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Diet Tracker
          </h3>
          <p className="text-sm text-muted-foreground">
            Hormone-friendly food suggestions
          </p>
        </Card>
      </Link>

    </div>
  );
};

export default FeatureGrid;
