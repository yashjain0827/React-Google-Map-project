import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import {Drawer,List,ListItem,ListItemText,Typography,} from "@mui/material";
import {GoogleMap,Marker,Polyline,useJsApiLoader,InfoWindow,} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const Tracking = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [traveledPath, setTraveledPath] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [stopMarkers, setStopMarkers] = useState([]);
  const [infoBoxVisible, setInfoBoxVisible] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    startTime: null,
    stops: [],
    endTime: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interpolatedIndex, setInterpolatedIndex] = useState(0);

  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const handleMarkerClick = () => {
    setInfoBoxVisible(true);
  };

  const handleInfoWindowClose = () => {
    setInfoBoxVisible(false);
  };

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
  });

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://nkcfleet.nyggs.com/api/devices?all=true",
          {
            headers: {
              Accept: "application/json",
              Authorization: "Basic " + btoa("admin:NKC#2018"),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch devices: ${response.status}`);
        }

        const data = await response.json();
        setDevices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 16);
    setToDate(currentDateString);

    currentDate.setHours(currentDate.getHours() - 1);
    const fromDateString = currentDate.toISOString().slice(0, 16);
    setFromDate(fromDateString);
  }, []);

  const handleSubmit = async () => {
    if (!selectedDevice || !fromDate || !toDate) return;

    const from = new Date(fromDate).toISOString();
    const to = new Date(toDate).toISOString();

    try {
      setLoading(true);
      const apiURL = `https://nkcfleet.nyggs.com/api/positions/?deviceId=${selectedDevice.id}&from=${from}&to=${to}`;
      const response = await fetch(apiURL, {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:NKC#2018"),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch positions: ${response.status}`);
      }

      const data = await response.json();
      setPositions(data);

      if (data.length > 0) {
        setCurrentPosition(data[0]);
        setTraveledPath([data[0]]);
        setStopMarkers([]);

        setCurrentIndex(0);
        setInterpolatedIndex(0);
        setIsPaused(false);
        setTripDetails({
          startTime: data[0].fixTime,
          stops: [],
          endTime: null,
          startLatitude: data[0].latitude,
          startLongitude: data[0].longitude,
          endLatitude: null,
          endLongitude: null,
        });
        handleSpeedChange(1);
        setMapCenter({
          lat: data[0].latitude,
          lng: data[0].longitude,
        });
        setIsPlaying(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const interpolatePositions = (start, end, steps = 10) => {
    console.log("start, end", start, end);
    const latDiff = (end.latitude - start.latitude) / steps;
    const lngDiff = (end.longitude - start.longitude) / steps;

    const interpolated = [];
    for (let i = 1; i <= steps; i++) {
      interpolated.push({
        latitude: start.latitude + latDiff * i,
        longitude: start.longitude + lngDiff * i,
      });
    }
    return interpolated;
  };

  useEffect(() => {
    if (positions.length > 1 && !isPaused) {
      const seenCoordinates = new Set();
      const filteredPositions = positions.filter((pos) => {
        const coordinateString = `${pos.latitude},${pos.longitude}`;
        if (seenCoordinates.has(coordinateString)) {
          return false;
        }
        seenCoordinates.add(coordinateString);
        return true;
      });
      // console.log("Filtered Positions:", filteredPositions);

      const calculateStops = () => {
        if (positions.length > 1) {
          const stops = [];
          let stopStartIndex = null;

          for (let i = 0; i < positions.length - 1; i++) {
            const currentPos = positions[i];
            const nextPos = positions[i + 1];
            const timeDifference =
              new Date(nextPos.fixTime) - new Date(currentPos.fixTime);

            if (
              currentPos.latitude === nextPos.latitude &&
              currentPos.longitude === nextPos.longitude
            ) {
              if (stopStartIndex === null) {
                stopStartIndex = i;
              }
            } else {
              if (stopStartIndex !== null) {
                const stopEndIndex = i;
                const totalTimeDifference =
                  new Date(positions[stopEndIndex].fixTime) -
                  new Date(positions[stopStartIndex].fixTime);

                if (totalTimeDifference >= 5 * 60 * 1000) {
                  stops.push({
                    latitude: positions[stopStartIndex].latitude,
                    longitude: positions[stopStartIndex].longitude,
                    duration: totalTimeDifference,
                  });
                }

                stopStartIndex = null;
              }
            }
          }
          if (stopStartIndex !== null) {
            const stopEndIndex = positions.length - 1;
            const totalTimeDifference =
              new Date(positions[stopEndIndex].fixTime) -
              new Date(positions[stopStartIndex].fixTime);

            if (totalTimeDifference >= 5 * 60 * 1000) {
              stops.push({
                latitude: positions[stopStartIndex].latitude,
                longitude: positions[stopStartIndex].longitude,
                duration: totalTimeDifference,
              });
            }
          }

          return stops;
        }
        return [];
      };

      const stops = calculateStops();
      setStopMarkers(stops);

      let interpolatedArray = [
        {
          latitude: filteredPositions[0].latitude,
          longitude: filteredPositions[0].longitude,
        },
      ];

      for (let i = 0; i < filteredPositions.length - 1; i++) {
        const segmentInterpolated = interpolatePositions(
          filteredPositions[i],
          filteredPositions[i + 1]
        );
        interpolatedArray = [...interpolatedArray, ...segmentInterpolated];
      }
      // console.log("Full Interpolated Array:", interpolatedArray);

      const interval = setInterval(() => {
        if (interpolatedIndex < interpolatedArray.length) {
          // console.log("interpolatedArray and interpolatedIndex are:", interpolatedArray, interpolatedIndex)
          const currentInterpolatedPosition =
            interpolatedArray[interpolatedIndex];
          // console.log("Animating Marker at:", currentInterpolatedPosition);

        //   // Check if the current position matches any stop position
        // stops.forEach((stop) => {
        //   if (
        //     Math.abs(currentInterpolatedPosition.latitude - stop.latitude) < 0.0001 &&
        //     Math.abs(currentInterpolatedPosition.longitude - stop.longitude) < 0.0001
        //   ) {
        //     // Add stop marker to the map if it's not already added
        //     if (!stopMarkers.some((marker) => marker.latitude === stop.latitude && marker.longitude === stop.longitude)) {
        //       setStopMarkers((prevStops) => [...prevStops, stop]);
        //     }
        //   }
        // });

          setCurrentPosition(currentInterpolatedPosition);

          setTraveledPath((prevPath) => [
            ...prevPath,
            currentInterpolatedPosition,
          ]);

          setMapCenter({
            lat: currentInterpolatedPosition.latitude,
            lng: currentInterpolatedPosition.longitude,
          });

          setTripDetails((prevDetails) => ({
            ...prevDetails,
            endLatitude: currentInterpolatedPosition.latitude,
            endLongitude: currentInterpolatedPosition.longitude,
          }));

          setInterpolatedIndex((prevIndex) => prevIndex + 1);
        } else {
          clearInterval(interval);

          setTripDetails((prevDetails) => ({
            ...prevDetails,
            endTime: positions[positions.length - 1]?.fixTime,
          }));
        }
      }, 50 / speed);

      setCurrentInterval(interval);

      return () => clearInterval(interval);
    }
  }, [positions, isPaused, speed, tripDetails, interpolatedIndex]);

  const handleSpeedChange = (multiplier) => {
    if (multiplier !== speed) {
      setSpeed(multiplier);
      setSelectedSpeed(multiplier);
      if (currentInterval) {
        clearInterval(currentInterval);
        setIsPaused(false);
      }
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsPlaying(false);
    if (currentInterval) clearInterval(currentInterval);
  };

  const handlePlay = () => {
    setIsPaused(false);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPaused(true);
    setIsPlaying(false);
    if (currentInterval) clearInterval(currentInterval);
    setCurrentIndex(0);
    setInterpolatedIndex(0);
    setTraveledPath([]);
    setStopMarkers([]);
    setCurrentIndex(0);

    if (positions.length > 0) {
      setMapCenter({
        lat: positions[0].latitude,
        lng: positions[0].longitude,
      });
      setIsPaused(false);
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box className="tracking-container" sx={{ p: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: "#1976d2",
          color: "#fff",
          p: 2,
          borderRadius: 1,
          position: "relative",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", textAlign:"center" }}>Device Tracking System</h1>
        <Button
          variant="contained"
          color="secondary"
          sx={{ position: "absolute", left: 16 }}
        >
          Dashboard
        </Button>
      </Box>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Box display="flex" alignItems="center" gap={12} flexWrap="wrap">
        <Autocomplete
          options={devices}
          getOptionLabel={(option) => option.name || "Unknown Device"}
          renderInput={(params) => (
            <TextField {...params} label="Select Device" variant="outlined" />
          )}
          value={selectedDevice}
          onChange={(event, newValue) => setSelectedDevice(newValue)}
          sx={{ width: "300px" }}
          disabled={loading || devices.length === 0}
        />

        <TextField
          label="From Date"
          type="datetime-local"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: "300px" }}
        />

        <TextField
          label="To Date"
          type="datetime-local"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: "300px" }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ height: "56px" }}
          disabled={!selectedDevice || !fromDate || !toDate}
        >
          Submit
        </Button>
      </Box>

      <Box sx={{ mt: 4, position: "relative" }}>
        {isLoaded ? (
          <>
            <Box
              sx={{
                position: "absolute",
                top: 10,
                left: 16,
                display: "flex",
                flexDirection: "row",
                gap: 1,
                zIndex: 10,
              }}
            >
              {[1, 2, 3, 4].map((multiplier) => (
                <Button
                  key={multiplier}
                  onClick={() => handleSpeedChange(multiplier)}
                  variant="contained"
                  color={selectedSpeed === multiplier ? "primary" : "error"}
                >
                  {multiplier}x
                </Button>
              ))}
              <Button
                onClick={handlePause}
                variant="contained"
                color={isPaused ? "primary" : "error"}
              >
                Pause
              </Button>
              <Button
                onClick={handlePlay}
                variant="contained"
                color={isPlaying ? "primary" : "error"}
              >
                Play
              </Button>
              <Button
                onClick={handleReset}
                variant="contained"
                color={isReset ? "primary" : "error"}
              >
                Reset
              </Button>
            </Box>
            <Button
              variant="contained"
              onClick={toggleDrawer(true)}
              sx={{ position: "absolute", right: 50, top: 16, zIndex: 10 }}
            >
              {" "}
              Tracking Details{" "}
            </Button>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              variant="persistant"
              sx={{
                "& .MuiDrawer-paper": {
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "100%",
                  width: "350px",
                  zIndex: 5,
                  boxSizing: "border-box",
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">Tracking Details</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Start Time"
                      secondary={`${tripDetails.startTime} - (${tripDetails.startLatitude}, ${tripDetails.startLongitude})`}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="End Time"
                      secondary={
                        tripDetails.endTime
                          ? `${tripDetails.endTime} - (${tripDetails.endLatitude}, ${tripDetails.endLongitude})`
                          : ""
                      }
                    />
                  </ListItem>
                  {stopMarkers.map((stop, index) => (
                    <ListItem key={`stop-${index}`}>
                      <ListItemText
                        primary={`Stop ${index + 1}`}
                        secondary={`(${stop.latitude}, ${
                          stop.longitude
                        }) - Stopped for ${(stop.duration / 60000).toFixed(
                          0
                        )} minutes`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={15}
            >
              {positions.length > 0 && (
                <>
                  <Marker
                    position={{
                      lat: positions[0].latitude,
                      lng: positions[0].longitude,
                    }}
                    label="Start"
                  />
                  <Marker
                    position={{
                      lat: positions[positions.length - 1].latitude,
                      lng: positions[positions.length - 1].longitude,
                    }}
                    label="End"
                  />
                  <Polyline
                    path={traveledPath.map((point) => ({
                      lat: point.latitude,
                      lng: point.longitude,
                    }))}
                    options={{
                      strokeColor: "#FFFF00",
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                    }}
                  />
                  {currentPosition && (
                    <Marker
                      position={{
                        lat: currentPosition.latitude,
                        lng: currentPosition.longitude,
                      }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      }}
                      onClick={handleMarkerClick}
                    />
                  )}
                  {infoBoxVisible && (
                    <InfoWindow
                      position={{
                        lat: currentPosition.latitude,
                        lng: currentPosition.longitude,
                      }}
                      onCloseClick={handleInfoWindowClose}
                    >
                      <div style={{ minWidth: "150px", textAlign: "center" }}>
                        <h4>Current Position</h4>
                        <p>
                          Latitude: {currentPosition.latitude.toFixed(6)}
                          <br />
                          Longitude: {currentPosition.longitude.toFixed(6)}
                          {/* <br />
                          Speed: {currentPosition.speed || "N/A"} km/h
                          <br />
                          Time:{" "}
                          {new Date(
                            currentPosition.fixTime
                          ).toLocaleTimeString()} */}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                  {stopMarkers.map((stop, index) => (
                    <Marker
                      key={`stop-marker-${index}`}
                      position={{
                        lat: stop.latitude,
                        lng: stop.longitude,
                      }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                      }}
                      label="Stop"
                    />
                  ))}
                </>
              )}
            </GoogleMap>
          </>
        ) : (
          <p>{loadError ? "Error loading map" : "Loading map..."}</p>
        )}
      </Box>
    </Box>
  );
};

export default Tracking;
