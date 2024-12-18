import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Tracking from "./components/Tracking";
import car1 from "./img/car1.svg";
import carStopIcon from "./img/carStop.svg";
import carIdleIcon from "./img/carIdle.svg";
import carOfflineIcon from "./img/carOffline.svg";
import MainContainer from "./components/Dashboard";
import { Box, Grid } from "@mui/material";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

function App() {
  const [allData, setAllData] = useState(null);
  const [showData, setShowData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const googleMapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
  });

  const [mapLoaded, setMapLoaded] = useState(false);

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

      const tepmShowData = [
        ...(allFetchedData.RUNNING || []),
        ...(allFetchedData.STOP || []),
        ...(allFetchedData.IDLE || []),
        ...(allFetchedData.OFFLINE || []),
      ];

      setAllData(allFetchedData);
      setShowData(tepmShowData);
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
    <Router>
      <div className="app">
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

          <Grid item xs={12}>
            <Box sx={{ display: "flex", position: "relative", flexGrow: 1 }}>
              <Sidebar open={open} setOpen={setOpen} />
              <Routes>
                <Route
                  path="/"
                  element={
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
                  }
                />
                <Route path="/Tracking" element={<Tracking open={open} />} />
              </Routes>
            </Box>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
