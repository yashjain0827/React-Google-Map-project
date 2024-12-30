import React from "react";
import { Marker } from "@react-google-maps/api";

const CustomMarker = React.memo(({ location, getMarkerIcon }) => {
  console.log("Marker rendered for location:", location);

  return (
    <Marker
      position={{
        lat: location.latitude,
        lng: location.longitude,
      }}
      icon={getMarkerIcon(location.status)}
    />
  );
}, areEqual);


function areEqual(prevProps, nextProps) {
  return (
    prevProps.location.latitude === nextProps.location.latitude &&
    prevProps.location.longitude === nextProps.location.longitude &&
    prevProps.location.status === nextProps.location.status &&
    prevProps.getMarkerIcon === nextProps.getMarkerIcon
  );
}

export default CustomMarker;
