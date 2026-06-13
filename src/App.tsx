import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MentalHealthJournal from "./pages/MentalHealthJournal";
import PeriodTracker from "./pages/PeriodTracker";
import DietTracker from "./pages/DietTracker";
import EmergencySOS from "./pages/EmergencySOS";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mental-health-journal" element={<MentalHealthJournal />} />
        <Route path="/period-tracker" element={<PeriodTracker />} />
        <Route path="/diet-tracker" element={<DietTracker />} />
        <Route path="/emergency-sos" element={<EmergencySOS />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
