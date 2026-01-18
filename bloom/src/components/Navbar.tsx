import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import BloomLogo from "./BloomLogo";
import { Button } from "./ui/button";

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <BloomLogo size="sm" />
          </Link>
          
          {isLanding && (
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                About
              </a>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
