import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, Shield, Sparkles } from "lucide-react";
import BloomLogo from "./BloomLogo";

const CTASection = () => {
  return (
    <section id="about" className="py-24 gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <BloomLogo size="lg" />
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-8 mb-6">
            Your body, your data,{" "}
            <span className="text-gradient bg-gradient-to-r from-primary-deep to-secondary">
              your journey
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            We believe every woman deserves a safe, supportive space to understand her body. 
            Bloom is designed with love, backed by science, and committed to your privacy.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card shadow-soft">
              <Shield className="w-5 h-5 text-mint" />
              <span className="text-sm font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card shadow-soft">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Made with love</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card shadow-soft">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Personalized care</span>
            </div>
          </div>

          <Link to="/signup">
            <Button variant="hero" size="xl">
              Start Your Wellness Journey
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
