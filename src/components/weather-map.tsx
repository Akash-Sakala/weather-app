import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { weatherAPI } from "@/api/weather";
import type { WeatherData, ForecastData } from "@/api/types";
import { useGeolocation } from "@/hooks/use-geolocation";   // <--- IMPORTANT
import L from "leaflet";

// Fix default marker issue
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Weather tiles available
const AGRI_LAYERS = [
  { name: "Temperature", id: "TA2" },
  { name: "Cloud Cover", id: "CL" },
  { name: "Rainfall", id: "PR0" },
  { name: "Wind Speed", id: "WS10" },
  { name: "Humidity", id: "RH" },
  { name: "Dew Point", id: "DPT" },
  { name: "Pressure", id: "APM" },
  { name: "Visibility", id: "VIS" },
];

// Forecast jump hours
const HOURS = [0, 3, 6, 12, 24, 36, 48, 72, 96];

function FlyToLocation({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 9, { duration: 1.5 });
  }, [lat, lon]);
  return null;
}

export function WeatherMap() {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  /* ===================== MAP STATE ===================== */
  const { coordinates, getLocation } = useGeolocation();
  const [layer, setLayer] = useState("TA2");
  const [opacity, setOpacity] = useState(0.6);
  const [hourShift, setHourShift] = useState(0);

  /* ===================== SEARCH STATE ===================== */
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCoord, setSelectedCoord] = useState<{lat:number, lon:number} | null>(null);

  async function searchLocation() {
    if (!query) return;
    const res = await weatherAPI.searchLocations(query);
    setSearchResults(res);
  }

  /* ===================== WEATHER DATA FETCH ===================== */
  const [current, setCurrent] = useState<WeatherData | null>(null);
  const [future, setFuture] = useState<ForecastData | null>(null);

  useEffect(() => {
    (async () => {
      const loc = selectedCoord ?? coordinates ?? { lat: 20.5937, lon: 78.9629 };
      const w = await weatherAPI.getCurrentWeather(loc);
      const f = await weatherAPI.getForecast(loc);
      setCurrent(w);
      setFuture(f);
    })();
  }, [selectedCoord, coordinates]);

  function values() {
    if (!current || !future) return null;
    if (hourShift === 0) return {
      temp: current.main.temp+"°C",
      humidity: current.main.humidity+"%",
      pressure: current.main.pressure+" hPa",
      clouds: current.weather[0].description,
      wind: current.wind.speed+" m/s",
      dewPoint: (current.main.temp-((100-current.main.humidity)/5)).toFixed(1)+"°C",
      visibility: (current.visibility/1000).toFixed(1)+" km"
    };
    const i = Math.min(Math.floor(hourShift/3), future.list.length-1);
    const f = future.list[i];
    return {
      temp: f.main.temp+"°C",
      humidity: f.main.humidity+"%",
      pressure: f.main.pressure+" hPa",
      clouds: f.weather[0].description,
      wind: f.wind.speed+" m/s",
      dewPoint: (f.main.temp-((100-f.main.humidity)/5)).toFixed(1)+"°C",
      visibility: "-"
    };
  }

  const info = values();
  const target = selectedCoord ?? coordinates ?? { lat: 20.5937, lon: 78.9629 };
  const stamp = new Date(Date.now()+hourShift*3600*1000).toISOString().replace(/\D/g,"").slice(0,10);

  return (
    <div className="border border-emerald-600/50 rounded-xl p-4 bg-emerald-950/40 mt-6">

      {/* ========== 🌍 LOCATION SEARCH + GPS CONTROLS ========== */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          placeholder="Search city, village or pincode..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          className="px-3 py-2 rounded bg-emerald-800 text-emerald-100 border border-emerald-600 w-64"
        />
        <button onClick={searchLocation} className="px-3 py-2 bg-lime-500 text-emerald-900 rounded font-semibold">
          Search
        </button>
        <button
          onClick={getLocation}
          className="px-3 py-2 bg-blue-500 rounded text-white font-semibold"
        >
          📍 My Current Location
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-emerald-900/50 border border-emerald-600 rounded p-2 mb-3">
          {searchResults.map((loc) => (
            <p
              key={loc.lat}
              onClick={() => { setSelectedCoord({lat:loc.lat,lon:loc.lon}); setSearchResults([]); }}
              className="cursor-pointer hover:bg-emerald-700 rounded px-2 py-1 text-emerald-200"
            >
              {loc.name}, {loc.state || ""}, {loc.country}
            </p>
          ))}
        </div>
      )}

      {/* ========== WEATHER DATA DISPLAY ========== */}
      {info && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-emerald-200 p-3 bg-emerald-900/20 rounded border border-emerald-700">
          <p>🌡 Temp: <span className="text-lime-300">{info.temp}</span></p>
          <p>💧 Humidity: <span className="text-sky-300">{info.humidity}</span></p>
          <p>🌀 Pressure: <span className="text-yellow-300">{info.pressure}</span></p>
          <p>☁ Clouds: <span className="text-blue-300 capitalize">{info.clouds}</span></p>
          <p>🍃 Wind: <span className="text-green-300">{info.wind}</span></p>
          <p>🌙 Dew Point: <span className="text-purple-300">{info.dewPoint}</span></p>
          <p>🌫 Visibility: <span className="text-gray-300">{info.visibility}</span></p>
        </div>
      )}

      {/* ========== 🌦 MAP VIEW ========== */}
      <MapContainer center={[target.lat,target.lon]} zoom={6} style={{height:"70vh"}}>
        
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <TileLayer
          key={`map-${layer}-${hourShift}-${opacity}`}
          url={`https://maps.openweathermap.org/maps/2.0/${hourShift===0?"weather":"forecast"}/${layer}/{z}/{x}/{y}?appid=${API_KEY}${hourShift!==0?`&date=${stamp}`:""}`}
          opacity={opacity}
        />

        {/* GPS FLY-TO */}
        {coordinates && <FlyToLocation lat={coordinates.lat} lon={coordinates.lon}/>}

        {/* Show marker if location searched */}
        {selectedCoord && (
          <Marker position={[selectedCoord.lat,selectedCoord.lon]} icon={markerIcon}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  );
}
