import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoiamNhbmNpbyIsImEiOiJjbTh1eHozMHAwdWFuMnFwdnRldXM2ZXl0In0.TFhileQQGaipsC68FNbh3g";

// Type definitions for coordinates
interface Coordinates {
  longitude: number;
  latitude: number;
}

function RecycleCenterMap() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    longitude: -77.037, // Default longitude
    latitude: 38.897,  // Default latitude
  });

  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 12,
    });

    initializeMap.on("load", () => {
      setMap(initializeMap);

      // Fetch recycling center locations
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/recycle center.json?proximity=${coordinates.longitude},${coordinates.latitude}&access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.features.forEach((center: any) => {
            new mapboxgl.Marker()
              .setLngLat(center.geometry.coordinates)
              .addTo(initializeMap);
          });
        });
    });

    return () => initializeMap.remove();
  }, [coordinates]);

  const findMyLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        id="map" 
        className="h-[500px] w-[800px] max-h-screen overflow-hidden" 
      />
      <button
        onClick={findMyLocation}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Find My Location
      </button>
    </div>
  );
}

export default RecycleCenterMap;
