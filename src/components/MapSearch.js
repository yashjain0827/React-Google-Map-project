import React, { Component } from "react";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";

class MapSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCenter: { lat: 20.5937, lng: 78.9629 },
      zoom: 5, // Initial zoom level
      location: "",
      latitude: "",
      longitude: "",
      suggestions: [],
      selectedLocation: null,
      debounceTimeout: null,
      geofenceCoords: [],
    };
  }

  handleInputChange = (field, value) => {
    this.setState({ [field]: value });

    if (field === "location" && value.length > 2) {
      clearTimeout(this.state.debounceTimeout);

      const debounceTimeout = setTimeout(async () => {
        try {
          const query = encodeURIComponent(value);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${query}&polygon_geojson=1&format=json&addressdetails=1`
          );
          if (response.ok) {
            const data = await response.json();
            this.setState({
              suggestions: data.map((item) => ({
                name: item.display_name,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
                geofence: item.geojson?.coordinates || [],
              })),
            });
          } else {
            console.error("Failed to fetch suggestions.");
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      }, 300);

      this.setState({ debounceTimeout });
    }
  };

  handleSearch = () => {
    const { latitude, longitude, location, suggestions } = this.state; //this.state.latitude
    if (latitude && longitude && location) {
      const selectedSuggestion = suggestions.find((s) => s.name === location);
      this.setState({
        mapCenter: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        selectedLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        zoom: 10, // Set zoom to 10 on search
        geofenceCoords:
          selectedSuggestion?.geofence[0]?.map((coord) => ({
            lat: coord[1],
            lng: coord[0],
          })) || [],
      });
    }
  };

  handleSelectLocation = (event, value) => {
    if (value) {
      this.setState({
        location: value.name,
        latitude: value.latitude,
        longitude: value.longitude,
      });
    }
  };

  handleClearLocation = () => {
    this.setState({
      location: "",
      latitude: "",
      longitude: "",
      selectedLocation: null,
      geofenceCoords: [],
      zoom: 5, // Reset zoom when cleared
    });
  };

  render() {
    const { isLoaded } = this.props; //this.props.isLoaded
    const { suggestions, mapCenter, selectedLocation, geofenceCoords, zoom } =
      this.state;

    const containerStyle = {
      width: "calc(100vw - 76px)",
      height: "calc(100vh - 171px)",
    };

    return (
      <Box className="search-container" sx={{ p: 1, marginLeft: "60px" }}>
        <Box
          alignItems="center"
          sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
        >
          <h1 style={{ color: "#400c60" }}>Google Map Search</h1>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Autocomplete
              options={suggestions}
              getOptionLabel={(option) => option.name}
              onChange={this.handleSelectLocation}
              onInputChange={(event, value) => {
                if (!value) this.handleClearLocation(); // Reset when cleared
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location"
                  variant="outlined"
                  value={this.state.location}
                  onChange={(e) =>
                    this.handleInputChange("location", e.target.value)
                  }
                />
              )}
              sx={{ minWidth: "200px", marginRight: "10px" }}
            />

            <TextField
              label="Latitude"
              variant="outlined"
              value={this.state.latitude}
              onChange={(e) =>
                this.handleInputChange("latitude", e.target.value)
              }
              sx={{ minWidth: "150px", marginRight: "10px" }}
            />

            <TextField
              label="Longitude"
              variant="outlined"
              value={this.state.longitude}
              onChange={(e) =>
                this.handleInputChange("longitude", e.target.value)
              }
              sx={{ minWidth: "150px", marginRight: "10px" }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSearch}
              sx={{ height: "56px" }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
          >
            {selectedLocation && (
              <Marker
                position={{
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude,
                }}
              />
            )}

            {geofenceCoords.length > 0 && (
              <Polygon
                paths={geofenceCoords}
                options={{
                  fillColor: "rgb(255, 5, 5)",
                  strokeColor: "rgb(255, 0, 0)",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <CircularProgress />
        )}
      </Box>
    );
  }
}

export default MapSearch;
