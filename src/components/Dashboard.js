import React, { useMemo, useCallback } from "react";
import DashboardDetails from "./DashboardDetails";
import { GoogleMap } from "@react-google-maps/api";
import CustomMarker from "./CustomMarker";

function Dashboard({
  activeCategory,
  setActiveCategory,
  allData,
  showData,
  setShowData,
  isLoaded,
  mapContainerStyle,
  googleMapRef,
  mapCenter,
  getMarkerIcon: originalGetMarkerIcon,
  handleMapLoad,
  open,
}) {
  const memoizedShowData = useMemo(() => showData, [showData]);
  const getMarkerIcon = useCallback(originalGetMarkerIcon, []);

  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
        height: "calc(100vh - 60px)",
        marginLeft: "60px",
      }}
    >
      <DashboardDetails
        activeCategory={activeCategory}
        chartData={[
          { name: "Running", value: (allData?.RUNNING || []).length },
          { name: "Stop", value: (allData?.STOP || []).length },
          { name: "Idle", value: (allData?.IDLE || []).length },
          { name: "Offline", value: (allData?.OFFLINE || []).length },
        ]}
        showData={showData}
        setShowData={setShowData}
        setActiveCategory={setActiveCategory}
        allData={allData}
      />

      <div style={{ width: "100%", height: "100%" }}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={5}
            ref={googleMapRef}
            onLoad={handleMapLoad}
          >
            {memoizedShowData?.map((location, index) => (
              <CustomMarker
                key={index}
                location={location}
                getMarkerIcon={getMarkerIcon}
              />
            ))}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
