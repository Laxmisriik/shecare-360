import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import BloomLogo from "@/components/BloomLogo";
import { Calendar, Apple, Baby, Heart, FileText, Flower2 } from "lucide-react";

const features = [
  {
    id: "periods",
    title: "Period Tracking",
    description: "Track your cycle & get insights",
    icon: Flower2,
    gradient: "gradient-peach",
    path: "/period-tracking",
  },
  {
    id: "diet",
    title: "Diet & Nutrition",
    description: "Personalized nutrition plans",
    icon: Apple,
    gradient: "gradient-mint",
    path: "/diet",
  },
  {
    id: "pregnancy",
    title: "Pregnancy Tracking",
    description: "Week-by-week guidance",
    icon: Baby,
    gradient: "gradient-lavender",
    path: "/pregnancy",
  },
  {
    id: "postpartum",
    title: "Postpartum & Baby Care",
    description: "Recovery & baby milestones",
    icon: Heart,
    gradient: "gradient-peach",
    path: "/postpartum",
  },
  {
    id: "symptoms",
    title: "Log Symptoms",
    description: "Track how you feel daily",
    icon: FileText,
    gradient: "gradient-mint",
    path: "/symptoms",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen gradient-soft">
      {/* Header */}
      <header className="glass border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BloomLogo size="sm" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Good morning! ✨</span>
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            What would you like to do today?
          </h1>
          <p className="text-muted-foreground">
            Choose a feature to get started with your wellness journey
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={feature.path}>
                <Card variant="feature" className="h-full group cursor-pointer overflow-hidden">
                  <CardContent className="p-6 relative">
                    {/* Background glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${feature.gradient} opacity-30 blur-3xl group-hover:opacity-50 transition-opacity`} />
                    
                    <motion.div
                      className={`w-16 h-16 rounded-2xl ${feature.gradient} flex items-center justify-center mb-4 shadow-soft group-hover:shadow-card transition-shadow relative`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-8 h-8 text-foreground/80" />
                    </motion.div>
                    
                    <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary-deep transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-xl font-display font-bold mb-4">Today's Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="soft" className="p-4 text-center">
              <div className="text-3xl font-bold text-primary-deep">Day 14</div>
              <div className="text-sm text-muted-foreground">Cycle day</div>
            </Card>
            <Card variant="mint" className="p-4 text-center">
              <div className="text-3xl font-bold text-mint-foreground">Ovulation</div>
              <div className="text-sm text-muted-foreground">Current phase</div>
            </Card>
            <Card variant="peach" className="p-4 text-center">
              <div className="text-3xl font-bold text-accent-foreground">14 days</div>
              <div className="text-sm text-muted-foreground">Until period</div>
            </Card>
            <Card variant="lavender" className="p-4 text-center">
              <div className="text-3xl font-bold text-secondary-foreground">High</div>
              <div className="text-sm text-muted-foreground">Energy level</div>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
