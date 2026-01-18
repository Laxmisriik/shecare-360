import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BloomLogo from "@/components/BloomLogo";
import { ArrowLeft, Baby, Heart, Syringe, Check, AlertCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const recoveryTips = [
  { title: "Rest when baby rests", description: "Your body is healing — sleep is essential", icon: "😴" },
  { title: "Stay hydrated", description: "Especially important if breastfeeding", icon: "💧" },
  { title: "Gentle movement", description: "Short walks when cleared by doctor", icon: "🚶‍♀️" },
  { title: "Ask for help", description: "It's okay to lean on your support system", icon: "🤝" },
];

const babyMilestones = [
  { age: "1 month", milestone: "Follows objects with eyes", completed: true },
  { age: "2 months", milestone: "Smiles responsively", completed: true },
  { age: "3 months", milestone: "Holds head steady", completed: false },
  { age: "4 months", milestone: "Reaches for objects", completed: false },
];

const vaccinations = [
  { name: "Hepatitis B (Dose 2)", age: "1-2 months", status: "completed" },
  { name: "DTaP (Dose 1)", age: "2 months", status: "completed" },
  { name: "Rotavirus (Dose 1)", age: "2 months", status: "completed" },
  { name: "PCV13 (Dose 2)", age: "4 months", status: "upcoming", dueDate: "Feb 15" },
  { name: "DTaP (Dose 2)", age: "4 months", status: "upcoming", dueDate: "Feb 15" },
];

const PostpartumCare = () => {
  const [activeTab, setActiveTab] = useState<"mom" | "baby" | "vaccines">("mom");

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
          <h1 className="text-3xl font-display font-bold mb-2">Postpartum & Baby Care</h1>
          <p className="text-muted-foreground">
            Support for your recovery and baby's growth
          </p>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "mom" ? "hero" : "soft"}
            onClick={() => setActiveTab("mom")}
          >
            <Heart className="w-4 h-4 mr-2" />
            Mom's Recovery
          </Button>
          <Button
            variant={activeTab === "baby" ? "hero" : "soft"}
            onClick={() => setActiveTab("baby")}
          >
            <Baby className="w-4 h-4 mr-2" />
            Baby Milestones
          </Button>
          <Button
            variant={activeTab === "vaccines" ? "hero" : "soft"}
            onClick={() => setActiveTab("vaccines")}
          >
            <Syringe className="w-4 h-4 mr-2" />
            Vaccinations
          </Button>
        </div>

        {/* Mom's Recovery */}
        {activeTab === "mom" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card variant="gradient" className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold mb-2">You're doing amazing 💕</h2>
                <p className="text-muted-foreground">
                  Recovery takes time. Be patient and gentle with yourself — your body just did something incredible.
                </p>
              </CardContent>
            </Card>

            <h3 className="text-lg font-display font-bold">Recovery Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {recoveryTips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="feature" className="h-full">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="text-3xl">{tip.icon}</div>
                      <div>
                        <h4 className="font-medium">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Baby Milestones */}
        {activeTab === "baby" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card variant="lavender" className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold mb-2">Baby's Development 👶</h2>
                <p className="text-muted-foreground">
                  Track your little one's growth milestones. Every baby develops at their own pace!
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {babyMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.milestone}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant={milestone.completed ? "mint" : "default"}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.completed ? "bg-mint" : "bg-muted"
                        }`}>
                          {milestone.completed ? (
                            <Check className="w-5 h-5 text-mint-foreground" />
                          ) : (
                            <Baby className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{milestone.milestone}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.age}</p>
                        </div>
                      </div>
                      {!milestone.completed && (
                        <Button variant="soft" size="sm">
                          Mark Complete
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Vaccinations */}
        {activeTab === "vaccines" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card variant="peach" className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold mb-2">Vaccination Schedule 💉</h2>
                <p className="text-muted-foreground">
                  Keep track of your baby's immunizations and never miss an important date.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {vaccinations.map((vaccine, index) => (
                <motion.div
                  key={vaccine.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant={vaccine.status === "completed" ? "mint" : "feature"}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          vaccine.status === "completed" ? "bg-mint" : "bg-accent"
                        }`}>
                          {vaccine.status === "completed" ? (
                            <Check className="w-5 h-5 text-mint-foreground" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-accent-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{vaccine.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {vaccine.age}
                            {vaccine.dueDate && ` • Due: ${vaccine.dueDate}`}
                          </p>
                        </div>
                      </div>
                      {vaccine.status === "upcoming" && (
                        <Button variant="soft" size="sm">
                          Set Reminder
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PostpartumCare;
