import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Box, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapCenter = {
  lat: 20.5937,
  lng: 78.9629,
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

  useEffect(() => {
    fetchData();
  }, []);

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
      setAllData(result?.data || {});
      setShowData([
        ...(result?.data?.RUNNING || []),
        ...(result?.data?.STOP || []),
        ...(result?.data?.IDLE || []),
        ...(result?.data?.OFFLINE || []),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <Sidebar open={open} setOpen={setOpen} />
      </Grid>
    </div>
  );
};

export default Home;
