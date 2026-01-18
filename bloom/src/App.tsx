import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import PeriodTracking from "./pages/PeriodTracking";
import DietNutrition from "./pages/DietNutrition";
import SymptomLogging from "./pages/SymptomLogging";
import PregnancyTracking from "./pages/PregnancyTracking";
import PostpartumCare from "./pages/PostpartumCare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/period-tracking" element={<PeriodTracking />} />
          <Route path="/diet" element={<DietNutrition />} />
          <Route path="/symptoms" element={<SymptomLogging />} />
          <Route path="/pregnancy" element={<PregnancyTracking />} />
          <Route path="/postpartum" element={<PostpartumCare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
