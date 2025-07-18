import "./App.css";
import { Routes, Route } from "react-router-dom";
import ShipPage from "./pages/ShipPage";
import LandingPage from "./pages/LandingPage";
import PortPage from "./pages/PortPage";
import ShipCrewAssignmentPage from "./pages/ShipCrewAssignmentPage";
import ShipVisitPage from "./pages/ShipVisitPage";
import CrewMemberPage from "./pages/CrewMemberPage";
import CargoPage from "./pages/CargoPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/shipPage" element={<ShipPage />}></Route>
      <Route path="/portPage" element={<PortPage />}></Route>
      <Route
        path="/shipCrewAssignmentPage"
        element={<ShipCrewAssignmentPage />}
      ></Route>
      <Route path="/shipVisitPage" element={<ShipVisitPage />}></Route>
      <Route path="/crewMemberPage" element={<CrewMemberPage />}></Route>
      <Route path="/cargoPage" element={<CargoPage />}></Route>
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
