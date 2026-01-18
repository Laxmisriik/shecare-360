import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookOpen, CalendarHeart, Utensils } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
      
      <div className="w-full max-w-5xl px-6">

        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Wellness Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Everything you need for mental & menstrual well-being
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Mental Health Journal */}
          <Link to="/mental-health-journal">
            <Card className="p-8 h-full hover:shadow-lg transition cursor-pointer text-center">
              <div className="mx-auto mb-5 flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500">
                <BookOpen className="text-white w-7 h-7" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Mental Health Journal
              </h2>
              <p className="text-sm text-muted-foreground">
                Chat with AI, track emotions, and reflect daily
              </p>
            </Card>
          </Link>

          {/* Period Tracker */}
          <Link to="/period-tracker">
            <Card className="p-8 h-full hover:shadow-lg transition cursor-pointer text-center">
              <div className="mx-auto mb-5 flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500">
                <CalendarHeart className="text-white w-7 h-7" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Period Tracker
              </h2>
              <p className="text-sm text-muted-foreground">
                Log cycles, symptoms, and predict next period
              </p>
            </Card>
          </Link>

          {/* Diet Tracker */}
          <Link to="/diet-tracker">
            <Card className="p-8 h-full hover:shadow-lg transition cursor-pointer text-center">
              <div className="mx-auto mb-5 flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500">
                <Utensils className="text-white w-7 h-7" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Diet Tracker
              </h2>
              <p className="text-sm text-muted-foreground">
                Hormone-friendly meals & smart recommendations
              </p>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
