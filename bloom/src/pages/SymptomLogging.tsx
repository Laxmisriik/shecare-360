import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BloomLogo from "@/components/BloomLogo";
import { ArrowLeft, Check, Smile, Meh, Frown, Heart, Zap, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

const moods = [
  { id: "great", label: "Great", icon: Smile, color: "bg-mint" },
  { id: "okay", label: "Okay", icon: Meh, color: "bg-secondary" },
  { id: "low", label: "Low", icon: Frown, color: "bg-accent" },
];

const energyLevels = [
  { id: "high", label: "High", icon: Zap, color: "bg-mint" },
  { id: "medium", label: "Medium", icon: Sun, color: "bg-secondary" },
  { id: "low", label: "Low", icon: Moon, color: "bg-accent" },
];

const symptoms = [
  { id: "cramps", label: "Cramps", emoji: "😣" },
  { id: "headache", label: "Headache", emoji: "🤕" },
  { id: "bloating", label: "Bloating", emoji: "🫃" },
  { id: "fatigue", label: "Fatigue", emoji: "😴" },
  { id: "breast_tenderness", label: "Breast tenderness", emoji: "💗" },
  { id: "acne", label: "Acne", emoji: "🔴" },
  { id: "back_pain", label: "Back pain", emoji: "🔙" },
  { id: "nausea", label: "Nausea", emoji: "🤢" },
  { id: "cravings", label: "Cravings", emoji: "🍫" },
  { id: "mood_swings", label: "Mood swings", emoji: "🎭" },
];

const SymptomLogging = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const saveLog = () => {
    if (!selectedMood) {
      toast.error("Please select your mood");
      return;
    }
    toast.success("Symptoms logged successfully!");
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-display font-bold mb-2">How are you feeling today?</h1>
          <p className="text-muted-foreground">
            Let's log how you're doing — it helps us understand your patterns
          </p>
        </motion.div>

        {/* Mood selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-display font-bold mb-4 text-center">Mood</h2>
          <div className="flex justify-center gap-4">
            {moods.map((mood) => (
              <motion.button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  selectedMood === mood.id 
                    ? `${mood.color} shadow-card scale-105` 
                    : "bg-card shadow-soft hover:shadow-card"
                }`}
                whileHover={{ scale: selectedMood === mood.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <mood.icon className={`w-10 h-10 ${selectedMood === mood.id ? "text-foreground" : "text-muted-foreground"}`} />
                <span className="font-medium text-sm">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Energy level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-display font-bold mb-4 text-center">Energy Level</h2>
          <div className="flex justify-center gap-4">
            {energyLevels.map((level) => (
              <motion.button
                key={level.id}
                onClick={() => setSelectedEnergy(level.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  selectedEnergy === level.id 
                    ? `${level.color} shadow-card scale-105` 
                    : "bg-card shadow-soft hover:shadow-card"
                }`}
                whileHover={{ scale: selectedEnergy === level.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <level.icon className={`w-10 h-10 ${selectedEnergy === level.id ? "text-foreground" : "text-muted-foreground"}`} />
                <span className="font-medium text-sm">{level.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Pain level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-display font-bold mb-4 text-center">Pain Level</h2>
          <Card variant="soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">None</span>
                <span className="text-sm text-muted-foreground">Severe</span>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setPainLevel(level)}
                    className={`flex-1 h-4 rounded-full transition-all ${
                      painLevel >= level ? "gradient-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="text-center mt-4">
                <span className="text-2xl font-bold text-primary-deep">{painLevel}</span>
                <span className="text-muted-foreground">/5</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Symptoms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-display font-bold mb-4 text-center">Symptoms</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {symptoms.map((symptom) => (
              <motion.button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                  selectedSymptoms.includes(symptom.id)
                    ? "gradient-primary shadow-soft text-primary-foreground"
                    : "bg-card shadow-soft hover:shadow-card"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{symptom.emoji}</span>
                <span className="text-sm font-medium">{symptom.label}</span>
                {selectedSymptoms.includes(symptom.id) && <Check className="w-4 h-4" />}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="hero" size="xl" className="w-full" onClick={saveLog}>
            <Heart className="w-5 h-5 mr-2" />
            Save Today's Log
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default SymptomLogging;
