import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { 
  Calendar, 
  Brain, 
  FileText, 
  Apple, 
  Baby, 
  Heart, 
  Syringe, 
  Sparkles 
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Period & Cycle Tracking",
    description: "Effortlessly track your menstrual cycle with accurate predictions and personalized insights.",
    gradient: "gradient-peach",
  },
  {
    icon: Brain,
    title: "Daily Cycle Insights",
    description: "Understand your body better with daily tips tailored to your current cycle phase.",
    gradient: "gradient-lavender",
  },
  {
    icon: FileText,
    title: "Symptom Logging",
    description: "Log your symptoms, moods, and energy levels to discover patterns and feel in control.",
    gradient: "gradient-mint",
  },
  {
    icon: Apple,
    title: "Diet & Nutrition",
    description: "Get personalized nutrition recommendations based on your cycle phase and health goals.",
    gradient: "gradient-peach",
  },
  {
    icon: Baby,
    title: "Pregnancy Tracking",
    description: "Week-by-week pregnancy guidance with baby development milestones and health tips.",
    gradient: "gradient-lavender",
  },
  {
    icon: Heart,
    title: "Postpartum Care",
    description: "Gentle recovery guidance and emotional support for your postpartum journey.",
    gradient: "gradient-mint",
  },
  {
    icon: Syringe,
    title: "Baby Vaccination Reminders",
    description: "Never miss an important vaccination with smart reminders and milestone tracking.",
    gradient: "gradient-peach",
  },
  {
    icon: Sparkles,
    title: "Wellness Insights",
    description: "Holistic wellness recommendations to help you thrive in every phase of life.",
    gradient: "gradient-lavender",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-2 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 gradient-hero opacity-50" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary-soft text-secondary-foreground text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything you need to{" "}
            <span className="text-gradient bg-gradient-to-r from-primary-deep to-secondary">
              bloom
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive tools designed with care to support your unique wellness journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="feature" className="h-full group cursor-pointer">
                <CardContent className="p-6">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl ${feature.gradient} flex items-center justify-center mb-4 shadow-soft group-hover:shadow-card transition-shadow`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon className="w-7 h-7 text-foreground/80" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary-deep transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
