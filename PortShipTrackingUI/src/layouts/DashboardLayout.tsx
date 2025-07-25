import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import PlaceIcon from "@mui/icons-material/Place";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";

const drawerWidth = 240;

const menuItems = [
  { label: "Dashboard", icon: <AssignmentIcon />, path: "/" },
  { label: "Ships", icon: <DirectionsBoatIcon />, path: "/shipPage" },
  { label: "Ports", icon: <PlaceIcon />, path: "/portPage" },
  { label: "Ship Visits", icon: <EventNoteIcon />, path: "/shipVisitPage" },
  { label: "Cargoes", icon: <LocalShippingIcon />, path: "/cargoPage" },
  { label: "Crew Members", icon: <PeopleIcon />, path: "/crewMemberPage" },
  {
    label: "Assignments",
    icon: <AssignmentIcon />,
    path: "/shipCrewAssignmentPage",
  },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#456882",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Port Ship Tracking System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          transition: "all 0.3s ease",
          minHeight: "100vh",
          marginLeft: open ? `${drawerWidth}px` : 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            transition: "margin 0.3s ease",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
