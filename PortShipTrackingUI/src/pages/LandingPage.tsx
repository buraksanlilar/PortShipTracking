import { Box, Paper, Typography } from "@mui/material";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import PlaceIcon from "@mui/icons-material/Place";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import shipService from "../api/shipService";
import { useEffect, useState } from "react";
import type { Ship } from "../types/ship";
import type { Port } from "../types/port";
import type { ShipVisit } from "../types/shipVisit";
import type { CrewMember } from "../types/crewMember";
import type { Cargo } from "../types/cargo";
import { useNavigate } from "react-router-dom";
import portService from "../api/portService";
import shipVisitService from "../api/shipVisitService";
import cargoService from "../api/cargoService";
import crewMemberService from "../api/crewMemberService";
import { CalendarMonth } from "@mui/icons-material";

const { getShips } = shipService;
const { getPorts } = portService;
const { getShipVisits } = shipVisitService;
const { getCrewMembers } = crewMemberService;
const { getCargoList } = cargoService;

function LandingPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [shipVisits, setShipVisits] = useState<ShipVisit[]>([]);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);

  useEffect(() => {
    loadShips(); // bu fonksiyon içinde getShips çağrılıyor
    loadPorts(); // bu fonksiyon içinde getPorts çağrılıyor
    loadShipVisits();
    loadCrewMembers();
    loadCargos();
  }, []);

  const loadShips = async () => {
    const res = await getShips();
    setShips(res);
  };
  const loadPorts = async () => {
    const res = await getPorts();
    setPorts(res);
  };
  const loadShipVisits = async () => {
    const res = await getShipVisits();
    setShipVisits(res);
  };
  const loadCrewMembers = async () => {
    const res = await getCrewMembers();
    setCrewMembers(res);
  };
  const loadCargos = async () => {
    const res = await getCargoList();
    setCargos(res);
  };
  const navigate = useNavigate();
  const shipNumber = ships.length; // get the total number of ships
  const portNumber = ports.length; // get the total number of ports
  const crewMemberNumber = crewMembers.length; // get the total number of crew members
  const cargoNumber = cargos.length; // get the total number of cargos

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Port Ship Tracking Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome to the Port Ship Tracking System management dashboard
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={2}
        mt={3}
      >
        {/* Card 1 */}
        <Paper
          onClick={() => navigate("/shipPage")}
          elevation={2}
          sx={{
            flex: "1 1 200px",
            p: 3,
            textAlign: "center",
            "&:hover": { cursor: "pointer", backgroundColor: "#f0f0f0" },
          }}
        >
          <DirectionsBoatIcon color="primary" fontSize="large" />
          <Typography variant="h5">{shipNumber}</Typography>
          <Typography variant="subtitle2">Total Ships</Typography>
        </Paper>

        {/* Card 2 */}
        <Paper
          onClick={() => navigate("/portPage")}
          elevation={2}
          sx={{
            flex: "1 1 200px",
            p: 3,
            textAlign: "center",
            "&:hover": { cursor: "pointer", backgroundColor: "#f0f0f0" },
          }}
        >
          <PlaceIcon sx={{ color: "green" }} fontSize="large" />
          <Typography variant="h5">{portNumber}</Typography>
          <Typography variant="subtitle2">Active Ports</Typography>
        </Paper>

        <Paper
          onClick={() => navigate("/shipVisitPage")}
          elevation={2}
          sx={{
            flex: "1 1 200px",
            p: 3,
            textAlign: "center",
            "&:hover": { cursor: "pointer", backgroundColor: "#f0f0f0" },
          }}
        >
          <CalendarMonth fontSize="large" />
          <Typography variant="h5">{shipVisits.length}</Typography>
          <Typography variant="subtitle2">Ship Visits</Typography>
        </Paper>

        {/* Card 3 */}
        <Paper
          onClick={() => navigate("/crewMemberPage")}
          elevation={2}
          sx={{
            flex: "1 1 200px",
            p: 3,
            textAlign: "center",
            "&:hover": { cursor: "pointer", backgroundColor: "#f0f0f0" },
          }}
        >
          <PeopleIcon sx={{ color: "orange" }} fontSize="large" />
          <Typography variant="h5">{crewMemberNumber}</Typography>
          <Typography variant="subtitle2">Crew Members</Typography>
        </Paper>

        {/* Card 4 */}

        {/* Card 5 */}
        <Paper
          onClick={() => navigate("/cargoPage")}
          elevation={2}
          sx={{
            flex: "1 1 200px",
            p: 3,
            textAlign: "center",
            "&:hover": { cursor: "pointer", backgroundColor: "#f0f0f0" },
          }}
        >
          <LocalShippingIcon sx={{ color: "purple" }} fontSize="large" />
          <Typography variant="h5">{cargoNumber}</Typography>
          <Typography variant="subtitle2">Total Cargos</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default LandingPage;
