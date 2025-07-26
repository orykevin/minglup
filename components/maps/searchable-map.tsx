// components/CustomSearchMap.jsx
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "../ui/button";

type MapQueryType = {
  lat: string;
  lon: string;
  place_id: string;
  display_name: string;
};

export const customIcon = L.icon({
  iconUrl: "/gps.png", // path to your marker PNG
  iconSize: [48, 48], // adjust as needed
  iconAnchor: [16, 48], // point of the icon which corresponds to marker's location
  popupAnchor: [0, -48], // position of the popup relative to icon
});

export const FlyToLocation = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);
  return null;
};

const ClickHandler = ({
  onMapClick,
}: {
  onMapClick: (latlng: { lat: number; lng: number }) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const CustomSearchMap = ({
  setForm,
  defaultPos,
  defaultAddress,
  onCancel,
}: {
  setForm: (address: string, latlong: number[]) => void;
  defaultPos: number[];
  defaultAddress: string;
  onCancel: () => void;
}) => {
  const [query, setQuery] = useState(defaultAddress);
  const [results, setResults] = useState<MapQueryType[]>([]);
  const [selectedPos, setSelectedPos] = useState<LatLngExpression>(
    defaultPos as LatLngExpression,
  );
  const typingTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSearch = (q: string) => {
    if (!q) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(console.error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    // Debounce search
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => handleSearch(value), 500);
  };

  const handleSelect = (place: MapQueryType) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setSelectedPos([lat, lon]);
    setResults([]);
    setQuery(place.display_name);
  };

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    const { lat, lng } = latlng;
    setSelectedPos([lat, lng]);
    // setGoogleMapsUrl(`https://www.google.com/maps?q=${lat},${lng}`);

    // Reverse geocode to get address
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const displayName = data.display_name || `${lat}, ${lng}`;
        setQuery(displayName);
      })
      .catch(console.error);
  };

  const submitHandler = () => {
    if (selectedPos) {
      setForm(query, selectedPos as number[]);
    }
  };

  return (
    <div className="w-full relative">
      <label className="font-semibold">Search a location:</label>
      <div className="relative z-[99999] mt-1 mb-4">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a place..."
          className="w-full p-2 border border-gray-300 rounded"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {results.length > 0 && showSuggestions && (
          <ul className="absolute bg-background border w-full mt-1 max-h-60 overflow-y-auto z-[99999] rounded shadow">
            {results.map((place) => (
              <li
                key={place.place_id}
                onClick={() => handleSelect(place)}
                className="p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <MapContainer
        center={selectedPos as LatLngExpression}
        zoom={12}
        scrollWheelZoom
        style={{ width: "100%", height: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedPos && (
          <>
            <Marker position={selectedPos} icon={customIcon}>
              <Popup>{query}</Popup>
            </Marker>
            <FlyToLocation position={selectedPos} />
            <ClickHandler onMapClick={handleMapClick} />
          </>
        )}
      </MapContainer>
      <div className="flex max-w-full gap-3 relative mt-3">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={submitHandler}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CustomSearchMap;
