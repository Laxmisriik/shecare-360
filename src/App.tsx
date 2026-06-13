import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import MentalHealthJournal from "./pages/MentalHealthJournal";
import PeriodTracker from "./pages/PeriodTracker";
import DietTracker from "./pages/DietTracker";
import EmergencySOS from "./pages/EmergencySOS";
import Pregnancy from "./pages/Pregnancy";
import SymptomTracker from "./pages/SymptomTracker";
import { ProtectedRoute } from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mental-health-journal" element={<ProtectedRoute><MentalHealthJournal /></ProtectedRoute>} />
        <Route path="/period-tracker" element={<ProtectedRoute><PeriodTracker /></ProtectedRoute>} />
        <Route path="/diet-tracker" element={<ProtectedRoute><DietTracker /></ProtectedRoute>} />
        <Route path="/emergency-sos" element={<ProtectedRoute><EmergencySOS /></ProtectedRoute>} />
        <Route path="/pregnancy" element={<ProtectedRoute><Pregnancy /></ProtectedRoute>} />
        <Route path="/symptom-tracker" element={<ProtectedRoute><SymptomTracker /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
