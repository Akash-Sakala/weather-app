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
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteCities } from "@/components/favorite-cities";
import { PlantLandingHero } from "@/components/plant-landing-hero";
import { WeatherMap } from "@/components/weather-map";   // <== MAP IMPORT

export function WeatherDashboard() {
  const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const dailyQuery = useDailyForecast16(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      dailyQuery.refetch();
      locationQuery.refetch();
    }
  };

  // -------------------------------- UI STATES -------------------------------- //

  if (locationLoading) return <WeatherSkeleton />;

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription>
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="mt-2">
            <MapPin className="mr-2 h-4 w-4" /> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert>
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription>
          Please turn on GPS and refresh.
          <Button onClick={getLocation} className="mt-2">
            <MapPin className="mr-2 h-4 w-4" /> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (weatherQuery.error || forecastQuery.error || dailyQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch weather data.
          <Button onClick={handleRefresh} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !dailyQuery.data) return <WeatherSkeleton />;

  const locationName = locationQuery.data?.[0];

  // -------------------------------- RENDER UI -------------------------------- //

  return (
    <div className="space-y-6 pb-10">

      {/* 🌿 Animated Agriculture Landing Hero */}
      <PlantLandingHero />

      <FavoriteCities />

      {/* Top bar + Refresh */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Field Weather</h1>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ||
              forecastQuery.isFetching ||
              dailyQuery.isFetching
              ? "animate-spin"
              : ""
            }`}
          />
        </Button>
      </div>

      {/* Current Weather + Hourly */}
      <div className="flex flex-col lg:flex-row gap-4">
        <CurrentWeather data={weatherQuery.data} locationName={locationName} />
        <HourlyTemperature data={forecastQuery.data} />
      </div>

      {/* Weather details + 16-Day Forecast */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <WeatherDetails data={weatherQuery.data} />

        <div id="agri-forecast" className="scroll-mt-24">
          <WeatherForecast data={dailyQuery.data} />
        </div>
      </div>

      {/* 🌍 Live + Forecast Weather Radar Map */}
      <div>
        <h2 className="text-lg font-semibold text-emerald-300 mb-2">
          🌍 Live & Forecast Weather Maps
        </h2>
        <p className="text-sm text-emerald-400 mb-3">
          Visualize temperature, rain, wind & cloud movements — including forecast hours.
        </p>

        <WeatherMap /> {/* <= FULL MAP NOW WORKING */}
      </div>

    </div>
  );
}
