import { motion } from "framer-motion";
import BloomLogo from "./BloomLogo";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <BloomLogo size="sm" />
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for women everywhere
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
