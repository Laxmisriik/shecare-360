import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import helloAnimation from "../assets/hello-animation.json";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 4000); // 4 seconds for the animation

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-64 h-64 mx-auto mb-4">
          <Lottie animationData={helloAnimation} loop={true} />
        </div>
        <div className="mt-4 text-lg text-gray-600 animate-pulse">
          Welcome to FemCare
        </div>
      </div>
    </div>
  );
};

export default Splash;
