import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";

const Sidebar = ({ open, setOpen }) => {
  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        zIndex: 1000,
        "& .MuiDrawer-paper": {
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: open ? 180 : 60,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          backgroundColor: "#FF9F40",
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/dashboard"
            sx={{
              justifyContent: open ? "initial" : "center",
              "&:hover": { backgroundColor: "#FFD580" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/Tracking"
            sx={{
              justifyContent: open ? "initial" : "center",
              "&:hover": { backgroundColor: "#FFD580" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
              <TrackChangesIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Device Tracking" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/MapSearch"
            sx={{
              justifyContent: open ? "initial" : "center",
              "&:hover": { backgroundColor: "#FFD580" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
              <SearchIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Map Search" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/EmployeeForm"
            sx={{
              justifyContent: open ? "initial" : "center",
              "&:hover": { backgroundColor: "#FFD580" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
              <PersonIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Employee Form" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/EmployeeList"
            sx={{
              justifyContent: open ? "initial" : "center",
              "&:hover": { backgroundColor: "#FFD580" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
              <PeopleIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Employee List" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
