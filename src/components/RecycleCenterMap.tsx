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
    latitude: 38.897, // Default latitude
  });

  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null); // State for user's marker

  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 12,
      scrollZoom: false,       // Disable zooming with scroll wheel
      doubleClickZoom: false, // Disable zooming with double-click
      boxZoom: false,         // Disable zooming with box selection
      dragRotate: false,      // Disable rotating the map
      touchZoomRotate: false, // Disable touch-based zoom and rotate
    });

    initializeMap.on("load", () => {
      setMap(initializeMap);

      // Add a default marker for user's location
      const userMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(initializeMap);

      setMarker(userMarker);

      // Fetch recycling center locations
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/recycle center.json?proximity=${coordinates.longitude},${coordinates.latitude}&access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.features.forEach((center: any) => {
            // Add markers for recycling centers
            new mapboxgl.Marker({ color: "blue" }) // Blue markers for recycling centers
              .setLngLat(center.geometry.coordinates)
              .addTo(initializeMap);
          });
        })
        .catch((error) => console.error("Error fetching recycling centers:", error));
    });

    return () => initializeMap.remove(); // Cleanup map instance
  }, []);

  const findMyLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      setCoordinates({ longitude, latitude });

      if (marker) {
        // Move user's marker to the new location
        marker.setLngLat([longitude, latitude]);
      } else if (map) {
        // Add marker if not already present
        const userMarker = new mapboxgl.Marker({ color: "red" })
          .setLngLat([longitude, latitude])
          .addTo(map);

        setMarker(userMarker);
      }

      if (map) {
        // Center map and zoom to user's location
        map.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
        });
      }

      // Fetch recycling centers near the new location
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/recycle center.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.features.forEach((center: any) => {
            // Add markers for recycling centers
            new mapboxgl.Marker({ color: "blue" })
              .setLngLat(center.geometry.coordinates)
              .addTo(map!);
          });
        })
        .catch((error) => console.error("Error fetching recycling centers:", error));
    });
  };

  return (
    <div className="flex flex-col items-center mx-6">
      <div
        id="map"
        className="h-[500px] w-full max-h-screen overflow-hidden"
        style={{ position: "relative" }}
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
