import React from "react";
import MapSearch from "./MapSearch";
import { useJsApiLoader } from "@react-google-maps/api";

const MapSearchWrapper = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
  });

  return <MapSearch isLoaded={isLoaded} />;
};

export default MapSearchWrapper;
