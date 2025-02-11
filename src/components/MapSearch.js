import React, { Component } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Grid,
  Button,
} from "@mui/material";

class MapSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCenter: { lat: 20.5937, lng: 78.9629 },
      location: "",
      latitude: "",
      longitude: "",
      suggestions: [],
      selectedLocation: null,
      debounceTimeout: null,
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
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
          );
          if (response.ok) {
            const data = await response.json();
            this.setState({
              suggestions: data.map((item) => ({
                name: item.display_name,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
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
    const { selectedLocation } = this.state; //const selectedLocation = this.state.selectedLocation;
    if (selectedLocation) {
      this.setState({
        mapCenter: {
          lat: selectedLocation.latitude,
          lng: selectedLocation.longitude,
        },
      });
    }
  };

  handleSelectLocation = (event, value) => {
    if (value) {
      this.setState({
        location: value.name,
        latitude: value.latitude,
        longitude: value.longitude,
        selectedLocation: value,
      });
    }
  };

  render() {
    const { isLoaded } = this.props; //this.props.isLoaded;
    const { suggestions, mapCenter, selectedLocation } = this.state;

    const containerStyle = {
      width: "calc(100vw -  92px)",
      height: "calc(100vh - 171px)",
    };

    return (
      <Box className="search-container" sx={{ p: 1, marginLeft: "60px" }}>
        <Box
          alignItems="center"
          sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
        >
          <h1>Google Map Search</h1>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* <Grid container spacing={2}>
              <Grid item xs={3}> */}
            <Autocomplete
              options={suggestions}
              getOptionLabel={(option) => option.name}
              onChange={this.handleSelectLocation}
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
            {/* </Grid>

              <Grid item xs={3}> */}
            <TextField
              label="Latitude"
              variant="outlined"
              value={this.state.latitude}
              onChange={(e) =>
                this.handleInputChange("latitude", e.target.value)
              }
              sx={{ minWidth: "150px", marginRight: "10px" }}
            />
            {/* </Grid>

              <Grid item xs={3}> */}
            <TextField
              label="Longitude"
              variant="outlined"
              value={this.state.longitude}
              onChange={(e) =>
                this.handleInputChange("longitude", e.target.value)
              }
              sx={{ minWidth: "150px", marginRight: "10px" }}
            />
            {/* </Grid>

              <Grid item xs={3}> */}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSearch}
              sx={{ height: "56px" }}
            >
              Search
            </Button>
            {/* </Grid>
            </Grid> */}
          </Box>
        </Box>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={10}
          >
            {selectedLocation && (
              <Marker
                position={{
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude,
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
