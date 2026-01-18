import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BloomLogo from "@/components/BloomLogo";
import { ArrowLeft, Baby, Heart, Apple, Calendar, ChevronRight } from "lucide-react";

const weekData = {
  week: 20,
  trimester: "Second",
  babySize: "Banana",
  babyLength: "6.5 inches",
  babyWeight: "10 oz",
  developments: [
    "Baby can now hear your voice",
    "Taste buds are developing",
    "Baby is practicing swallowing",
    "Movements becoming stronger"
  ],
  momTips: [
    "You might feel baby's first kicks!",
    "Stay hydrated with 8-10 glasses daily",
    "Consider prenatal yoga",
    "Schedule your anatomy scan"
  ]
};

const upcomingAppointments = [
  { date: "Jan 20", type: "Anatomy Scan", doctor: "Dr. Smith" },
  { date: "Feb 3", type: "Regular Checkup", doctor: "Dr. Smith" },
];

const PregnancyTracking = () => {
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
        {/* Week overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 gradient-lavender opacity-40 blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  className="w-36 h-36 rounded-full gradient-lavender flex items-center justify-center shadow-card"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-5xl font-bold text-foreground">{weekData.week}</div>
                    <div className="text-sm text-muted-foreground">weeks</div>
                  </div>
                </motion.div>

                <div className="text-center md:text-left flex-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-secondary-soft text-sm font-medium mb-2">
                    {weekData.trimester} Trimester
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Your baby is the size of a {weekData.babySize}! 🍌
                  </h1>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="px-4 py-2 rounded-full bg-card shadow-soft">
                      <span className="text-sm text-muted-foreground">Length: </span>
                      <span className="font-medium">{weekData.babyLength}</span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-card shadow-soft">
                      <span className="text-sm text-muted-foreground">Weight: </span>
                      <span className="font-medium">{weekData.babyWeight}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Baby development */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Baby className="w-5 h-5 text-secondary" />
              Baby's Development
            </h2>
            <Card variant="lavender">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {weekData.developments.map((dev, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-secondary-foreground">{index + 1}</span>
                      </div>
                      <span>{dev}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mom's tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Tips for You
            </h2>
            <Card variant="peach">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {weekData.momTips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Heart className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-mint" />
            Upcoming Appointments
          </h2>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, index) => (
              <Card key={index} variant="feature" className="cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-mint flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-mint-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{apt.type}</h3>
                      <p className="text-sm text-muted-foreground">{apt.date} • {apt.doctor}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PregnancyTracking;
