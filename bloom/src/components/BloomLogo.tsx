import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";

const BloomLogo = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
  const sizes = {
    sm: { icon: 20, text: "text-xl" },
    default: { icon: 28, text: "text-2xl" },
    lg: { icon: 36, text: "text-4xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 gradient-primary rounded-full blur-lg opacity-50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="relative gradient-primary p-2 rounded-xl shadow-soft">
          <Flower2 size={icon} className="text-primary-foreground" />
        </div>
      </div>
      <span className={`font-display font-bold ${text} text-gradient bg-gradient-to-r from-primary-deep to-secondary`}>
        Bloom
      </span>
    </motion.div>
  );
};

export default BloomLogo;
