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
    longitude: -77.037,
    latitude: 38.897,
  });
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [recyclingPlaces, setRecyclingPlaces] = useState<any[]>([]);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0); // Index for cycling places

  useEffect(() => {
    const initializeMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 12,
      scrollZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      dragRotate: false,
      touchZoomRotate: false,
    });

    initializeMap.on("load", () => {
      setMap(initializeMap);
      initializeMap.resize();

      const userMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(initializeMap);
      setMarker(userMarker);
    });

    return () => initializeMap.remove(); // Cleanup map
  }, []);

  const goToUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setCoordinates({ longitude, latitude });

        if (map) {
          map.flyTo({ center: [longitude, latitude], zoom: 14, essential: true });

          if (marker) {
            marker.setLngLat([longitude, latitude]);
          } else {
            const userMarker = new mapboxgl.Marker({ color: "red" })
              .setLngLat([longitude, latitude])
              .addTo(map);
            setMarker(userMarker);
          }
        }

        // Fetch approximate location name and update info panel
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
        )
          .then((response) => response.json())
          .then((data) => {
            const locationName =
              data.features?.[0]?.place_name || "Location name not available";
            const infoPanel = document.getElementById("info-panel");
            if (infoPanel) {
              infoPanel.innerHTML = `
                <h3 class="text-lg font-bold">Your Location</h3>
                <p><strong>Approximate Address:</strong> ${locationName}</p>
                <p><strong>Coordinates:</strong> ${longitude.toFixed(
                  4
                )}, ${latitude.toFixed(4)}</p>
              `;
            }
          })
          .catch((error) =>
            console.error("Error fetching location name:", error.message)
          );
      },
      (error) => console.error("Error fetching user location:", error.message)
    );
  };

  const findRecyclingPlaces = () => {
    if (!map) return;
  
    const { longitude, latitude } = coordinates;
  
    const queries = ["recycling center", "recycle", "environment", "trash"];
    Promise.all(
      queries.map((query) =>
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data); // Log raw API responses
            return data;
          })
          .catch((error) => console.error(`Error fetching ${query}:`, error))
      )
    ).then((results) => {
      const allPlaces = results.flatMap((data) => data.features || []);
  
      setRecyclingPlaces(allPlaces);
  
      console.log("Filtered Recycling Places Found:", allPlaces);
  
      const allMarkers = document.getElementsByClassName("mapboxgl-marker");
      while (allMarkers[0]) {
        allMarkers[0].remove();
      }
  
      allPlaces.forEach((place: any) => {
        const [lng, lat] = place.geometry.coordinates;
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          place.text || "Recycling Place"
        );
  
        new mapboxgl.Marker({ color: "green" })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);
      });
    });
  };
  

  const cycleThroughPlaces = () => {
    if (!map || recyclingPlaces.length === 0) return;

    // Get the current place based on the index
    const place = recyclingPlaces[currentPlaceIndex];
    if (!place || !place.geometry) {
      console.error("Invalid place data:", place);
      return;
    }
    const [lng, lat] = place.geometry.coordinates;

    // Log the current place
    console.log(`Cycling to Place: ${place.text || "Recycling Place"}`);

    // Fly to the current place
    map.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true,
    });

    // Update the info panel with details of the current place
    const infoPanel = document.getElementById("info-panel");
    if (infoPanel) {
      infoPanel.innerHTML = `
        <h3 class="text-lg font-bold">${place.text || "Recycling Place"}</h3>
        <p><strong>Address:</strong> ${place.place_name || "Address not available"}</p>
        <p><strong>Coordinates:</strong> ${lng.toFixed(4)}, ${lat.toFixed(4)}</p>
      `;
    }

    // Highlight the current place with a marker
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      place.text || "Recycling Place"
    );

    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    // Increment index to cycle to the next place
    setCurrentPlaceIndex((currentPlaceIndex + 1) % recyclingPlaces.length); // Loop back after reaching the last place
  };

  return (
    <div className="flex flex-col items-center mx-6">
      <div id="map" className="h-[500px] w-full max-h-screen overflow-hidden" style={{ position: "relative" }} />
      <div id="info-panel" className="info-panel mt-4 p-4 bg-gray-100 rounded"></div>
      <button
        onClick={goToUserLocation}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to My Location
      </button>
      <button
        onClick={findRecyclingPlaces}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Find Nearby Recycling Places
      </button>
      <button
        onClick={cycleThroughPlaces}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Cycle Through Recycling Places
      </button>
    </div>
  );
}

export default RecycleCenterMap;
