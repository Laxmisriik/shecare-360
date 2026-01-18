import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import BloomLogo from "@/components/BloomLogo";
import { ArrowRight, ArrowLeft, User, Calendar, Heart, Target, Check } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Cycle Details", icon: Calendar },
  { id: 3, title: "Symptoms", icon: Heart },
  { id: 4, title: "Goals", icon: Target },
];

const symptoms = [
  "Cramps", "Headache", "Bloating", "Fatigue", "Mood swings", 
  "Breast tenderness", "Acne", "Back pain", "Nausea", "Insomnia"
];

const goals = [
  { id: "periods", label: "Track periods", description: "Monitor your menstrual cycle" },
  { id: "diet", label: "Track diet", description: "Nutrition & meal logging" },
  { id: "pregnancy", label: "Track pregnancy", description: "Week-by-week guidance" },
  { id: "postpartum", label: "Postpartum care", description: "Recovery & baby care" },
  { id: "wellness", label: "Overall wellness", description: "Holistic health tracking" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    lastPeriodDate: "",
    cycleLength: "28",
    periodDuration: "5",
    flowIntensity: "Medium",
    regularity: "Regular",
    selectedSymptoms: [] as string[],
    crampSeverity: 2,
    selectedGoals: [] as string[],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSymptom = (symptom: string) => {
    const current = formData.selectedSymptoms;
    if (current.includes(symptom)) {
      updateFormData("selectedSymptoms", current.filter(s => s !== symptom));
    } else {
      updateFormData("selectedSymptoms", [...current, symptom]);
    }
  };

  const toggleGoal = (goalId: string) => {
    const current = formData.selectedGoals;
    if (current.includes(goalId)) {
      updateFormData("selectedGoals", current.filter(g => g !== goalId));
    } else {
      updateFormData("selectedGoals", [...current, goalId]);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Profile setup complete!");
      navigate("/dashboard");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <BloomLogo size="sm" />
        <Button variant="ghost" size="sm" onClick={skipOnboarding}>
          Skip for now
        </Button>
      </div>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto w-full mt-4">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id 
                    ? "gradient-primary shadow-soft" 
                    : "bg-muted"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <step.icon className={`w-5 h-5 ${currentStep >= step.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-12 md:w-24 h-1 mx-2 rounded-full transition-all ${
                  currentStep > step.id ? "gradient-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <Card variant="glass" className="backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display font-bold mb-2">Let's get to know you</h2>
                      <p className="text-muted-foreground">Tell us a bit about yourself</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          className="h-12 rounded-xl border-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                          className="h-12 rounded-xl border-primary/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Cycle Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display font-bold mb-2">Your cycle</h2>
                      <p className="text-muted-foreground">Help us understand your cycle better</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastPeriod">Last period start date</Label>
                        <Input
                          id="lastPeriod"
                          type="date"
                          value={formData.lastPeriodDate}
                          onChange={(e) => updateFormData("lastPeriodDate", e.target.value)}
                          className="h-12 rounded-xl border-primary/20"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cycleLength">Cycle length (days)</Label>
                          <Input
                            id="cycleLength"
                            type="number"
                            value={formData.cycleLength}
                            onChange={(e) => updateFormData("cycleLength", e.target.value)}
                            className="h-12 rounded-xl border-primary/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="periodDuration">Period duration</Label>
                          <Input
                            id="periodDuration"
                            type="number"
                            value={formData.periodDuration}
                            onChange={(e) => updateFormData("periodDuration", e.target.value)}
                            className="h-12 rounded-xl border-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Flow intensity</Label>
                        <div className="flex gap-2">
                          {["Light", "Medium", "Heavy", "Varies"].map((intensity) => (
                            <Button
                              key={intensity}
                              type="button"
                              variant={formData.flowIntensity === intensity ? "hero" : "soft"}
                              size="sm"
                              onClick={() => updateFormData("flowIntensity", intensity)}
                              className="flex-1"
                            >
                              {intensity}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Period regularity</Label>
                        <div className="flex gap-2">
                          {["Regular", "Irregular"].map((reg) => (
                            <Button
                              key={reg}
                              type="button"
                              variant={formData.regularity === reg ? "hero" : "soft"}
                              size="sm"
                              onClick={() => updateFormData("regularity", reg)}
                              className="flex-1"
                            >
                              {reg}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Symptoms */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display font-bold mb-2">Common symptoms</h2>
                      <p className="text-muted-foreground">Select symptoms you typically experience</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map((symptom) => (
                        <Button
                          key={symptom}
                          type="button"
                          variant={formData.selectedSymptoms.includes(symptom) ? "hero" : "soft"}
                          size="sm"
                          onClick={() => toggleSymptom(symptom)}
                          className="transition-all"
                        >
                          {formData.selectedSymptoms.includes(symptom) && <Check className="w-4 h-4 mr-1" />}
                          {symptom}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Label>Cramp severity</Label>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">None</span>
                        <div className="flex-1 flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => updateFormData("crampSeverity", level)}
                              className={`flex-1 h-3 rounded-full transition-all ${
                                formData.crampSeverity >= level 
                                  ? "gradient-primary" 
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">Severe</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Goals */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display font-bold mb-2">Your goals</h2>
                      <p className="text-muted-foreground">What would you like to track?</p>
                    </div>
                    
                    <div className="space-y-3">
                      {goals.map((goal) => (
                        <motion.button
                          key={goal.id}
                          type="button"
                          onClick={() => toggleGoal(goal.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                            formData.selectedGoals.includes(goal.id)
                              ? "border-primary bg-primary-soft shadow-soft"
                              : "border-primary/20 hover:border-primary/40"
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.selectedGoals.includes(goal.id)
                              ? "gradient-primary border-transparent"
                              : "border-muted-foreground"
                          }`}>
                            {formData.selectedGoals.includes(goal.id) && (
                              <Check className="w-4 h-4 text-primary-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{goal.label}</div>
                            <div className="text-sm text-muted-foreground">{goal.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ? "invisible" : ""}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  <Button type="button" variant="hero" onClick={nextStep}>
                    {currentStep === 4 ? "Complete" : "Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
