import { Box, Paper, Typography } from "@mui/material";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import PlaceIcon from "@mui/icons-material/Place";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import shipService from "../api/shipService";
import { useEffect, useState } from "react";
import type { Ship } from "../types/ship";

const { getShips } = shipService;

function LandingPage() {
  const [ships, setShips] = useState<Ship[]>([]);

  useEffect(() => {
    loadShips(); // bu fonksiyon içinde getShips çağrılıyor
  }, []);

  const loadShips = async () => {
    const res = await getShips();
    setShips(res);
  };

  const shipNumber = ships.length; // Toplam gemi sayısını al
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
          elevation={2}
          sx={{ flex: "1 1 200px", p: 3, textAlign: "center" }}
        >
          <DirectionsBoatIcon color="primary" fontSize="large" />
          <Typography variant="h5">{shipNumber}</Typography>
          <Typography variant="subtitle2">Total Ships</Typography>
        </Paper>

        {/* Card 2 */}
        <Paper
          elevation={2}
          sx={{ flex: "1 1 200px", p: 3, textAlign: "center" }}
        >
          <PlaceIcon sx={{ color: "green" }} fontSize="large" />
          <Typography variant="h5">24</Typography>
          <Typography variant="subtitle2">Active Ports</Typography>
        </Paper>

        {/* Card 3 */}
        <Paper
          elevation={2}
          sx={{ flex: "1 1 200px", p: 3, textAlign: "center" }}
        >
          <PeopleIcon sx={{ color: "orange" }} fontSize="large" />
          <Typography variant="h5">1,247</Typography>
          <Typography variant="subtitle2">Crew Members</Typography>
        </Paper>

        {/* Card 4 */}
        <Paper
          elevation={2}
          sx={{ flex: "1 1 200px", p: 3, textAlign: "center" }}
        >
          <LocalShippingIcon sx={{ color: "purple" }} fontSize="large" />
          <Typography variant="h5">89</Typography>
          <Typography variant="subtitle2">Ship Visits</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default LandingPage;
