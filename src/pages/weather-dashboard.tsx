import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
  useDailyForecast16
} from "@/hooks/use-weather";     // 🔥 ensure hook is exported

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

export function WeatherDashboard() {
  const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation();

  const weatherQuery   = useWeatherQuery(coordinates);       // current
  const forecastQuery  = useForecastQuery(coordinates);      // 3-hour 5-day
  const dailyQuery     = useDailyForecast16(coordinates);    // 🌾 16-day agri
  const locationQuery  = useReverseGeocodeQuery(coordinates);

  // Refresh all
  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      dailyQuery.refetch();
      locationQuery.refetch();
    }
  };

  // loading & location errors
  if (locationLoading) return <WeatherSkeleton />;
  if (locationError)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation}>
            <MapPin className="mr-2 h-4 w-4" /> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );

  if (!coordinates)
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to continue</p>
          <Button variant="outline" onClick={getLocation}>
            <MapPin className="mr-2 h-4 w-4" /> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error || dailyQuery.error)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data</p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );

  if (!weatherQuery.data || !forecastQuery.data || !dailyQuery.data)
    return <WeatherSkeleton />;

  return (
    <div className="space-y-4">
      <FavoriteCities />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Field Weather</h1>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching || forecastQuery.isFetching || dailyQuery.isFetching
                ? "animate-spin"
                : ""
            }`}
          />
        </Button>
      </div>

      {/* layout */}
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
          <HourlyTemperature data={forecastQuery.data} />  {/* still uses 5-day */}
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={dailyQuery.data} />    {/* 🌾 NEW */}
        </div>
      </div>
    </div>
  );
}
