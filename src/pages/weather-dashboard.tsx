import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
  useDailyForecast16,
} from "@/hooks/use-weather";

import { CurrentWeather } from "../components/current-weather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { WeatherForecast } from "../components/weather-forecast";
import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteCities } from "@/components/favorite-cities";
import { PlantLandingHero } from "@/components/plant-landing-hero";
import { WeatherMap } from "@/components/weather-map";

export function WeatherDashboard() {

  const { coordinates, isLoading, getLocation } = useGeolocation();
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const dailyQuery = useDailyForecast16(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  if (isLoading) return <WeatherSkeleton />;

  if (!coordinates) return (
    <Alert>
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription>
        Enable GPS to load farm weather.
        <Button className="mt-2" onClick={getLocation}><MapPin /> Enable</Button>
      </AlertDescription>
    </Alert>
  );

  if (weatherQuery.error || forecastQuery.error || dailyQuery.error) return (
    <Alert variant="destructive">
      <AlertTriangle /> 
      <AlertTitle>Error Loading Weather</AlertTitle>
      <AlertDescription>
        <Button className="mt-2" onClick={()=>window.location.reload()}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );

  if (!weatherQuery.data || !forecastQuery.data || !dailyQuery.data) return <WeatherSkeleton />;

  const locationName = locationQuery.data?.[0];

  return (
    <div className="space-y-8 pb-10">

      <FavoriteCities />

      {/* Header Area */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Field Weather</h1>
        <Button onClick={()=>window.location.reload()} size="icon">
          <RefreshCw />
        </Button>
      </div>

      {/* Current + Hourly */}
      <div className="flex flex-col lg:flex-row gap-4">
        <CurrentWeather data={weatherQuery.data} locationName={locationName}/>
        <HourlyTemperature data={forecastQuery.data}/>
      </div>

      {/* =========================== */}
      {/* 🔥 AI PANEL replaces WeatherDetails */}
      {/* =========================== */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 🌿 AI Smart Farming Advisor */}
        <PlantLandingHero
          weather={weatherQuery.data}
          forecast={forecastQuery.data}
        />

        {/* 📅 16-Day Forecast beside it */}
        <div id="agri-forecast" className="scroll-mt-28">
          <WeatherForecast data={dailyQuery.data}/>
        </div>

      </div>

      {/* 🌍 Full Weather Radar */}
      <div>
        <h2 className="text-lg text-emerald-300 font-semibold mb-2">
          🌍 Live Weather Radar
        </h2>
        <WeatherMap />
      </div>
    </div>
  );
}
