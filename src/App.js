import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Tracking from "./components/Tracking";
import Login from "./components/Login";
import car1 from "./img/car1.svg";
import carStopIcon from "./img/carStop.svg";
import carIdleIcon from "./img/carIdle.svg";
import carOfflineIcon from "./img/carOffline.svg";
import { Box, Grid } from "@mui/material";
import { AuthProvider, useAuth } from "./components/AuthContext";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Home = () => {
  const [allData, setAllData] = useState(null);
  const [showData, setShowData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const googleMapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "", 
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  const location = useLocation(); 

  useEffect(() => {
    if (mapLoaded) return;

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [mapLoaded]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://aisadmin.watsoo.com/backend/api/v1/get/newDashboardData?userId=59&userType=ADMIN&companyId=1"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const allFetchedData = result?.data || {};

      const tempShowData = [
        ...(allFetchedData.RUNNING || []),
        ...(allFetchedData.STOP || []),
        ...(allFetchedData.IDLE || []),
        ...(allFetchedData.OFFLINE || []),
      ];

      setAllData(allFetchedData);
      setShowData(tempShowData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerIcon = (status) => {
    switch (status) {
      case "RUNNING":
        return car1;
      case "STOP":
        return carStopIcon;
      case "IDLE":
        return carIdleIcon;
      case "OFFLINE":
        return carOfflineIcon;
      default:
        return carIdleIcon;
    }
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="app">
      {location.pathname !== "/login" && ( 
        <>
          <Grid container>
            <Grid item xs={12}>
              <header
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "15px",
                  textAlign: "center",
                  fontSize: "24px",
                }}
              >
                Watsoo Xpress
              </header>
            </Grid>
            <Sidebar open={open} setOpen={setOpen} />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Box sx={{ display: "flex", position: "relative", flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    allData={allData}
                    showData={showData}
                    setShowData={setShowData}
                    isLoaded={isLoaded}
                    mapContainerStyle={mapContainerStyle}
                    googleMapRef={googleMapRef}
                    mapCenter={mapCenter}
                    getMarkerIcon={getMarkerIcon}
                    handleMapLoad={handleMapLoad}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/Tracking"
              element={
                <PrivateRoute>
                  <Tracking open={open} />
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>
      </Grid>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Home />
    </Router>
  </AuthProvider>
);

export default App;
