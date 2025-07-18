import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import ShipPage from "./pages/ShipPage";
import PortPage from "./pages/PortPage";
import ShipCrewAssignmentPage from "./pages/ShipCrewAssignmentPage";
import ShipVisitPage from "./pages/ShipVisitPage";
import CrewMemberPage from "./pages/CrewMemberPage";
import CargoPage from "./pages/CargoPage";

function App() {
  return (
    <Routes>
      {/* Drawer + AppBar içerikli layout */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Ana yönlendirme */}
        <Route index element={<LandingPage />} />
        <Route path="shipPage" element={<ShipPage />} />
        <Route path="portPage" element={<PortPage />} />
        <Route
          path="shipCrewAssignmentPage"
          element={<ShipCrewAssignmentPage />}
        />
        <Route path="shipVisitPage" element={<ShipVisitPage />} />
        <Route path="crewMemberPage" element={<CrewMemberPage />} />
        <Route path="cargoPage" element={<CargoPage />} />
        {/* Bilinmeyen yol: landing page'e yönlendir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
