import React from "react";
import DashboardDetails from "./DashboardDetails";
import { GoogleMap, Marker, MarkerClusterer } from "@react-google-maps/api";

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
  getMarkerIcon,
  handleMapLoad,
  open
}) {
  return (
    <div style={{ display: "flex", flexGrow: 1, height: "calc(100vh - 60px)", width: `calc(100vw - ${open ? "190px" : "76px"})` }}>
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
            {showData.map((location, index) => (
              <Marker
                key={index}
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
                icon={getMarkerIcon(location.status)}
              />
            ))}
            {/* <MarkerClusterer>
              {(clusterer) =>
                showData.map((location, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                    icon={getMarkerIcon(location.status)}
                    clusterer={clusterer}
                  />
                ))
              }
            </MarkerClusterer> */}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
