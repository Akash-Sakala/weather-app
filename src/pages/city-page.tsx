import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { CurrentWeather } from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temprature";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteButton } from "@/components/favorite-button";

export function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const weatherQuery = useWeatherQuery({ lat, lon });
  const forecastQuery = useForecastQuery({ lat, lon });

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Failed to load weather data.</AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) return <WeatherSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <FavoriteButton data={{ ...weatherQuery.data, name: params.cityName ?? weatherQuery.data.name}} />
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} />
        <HourlyTemperature data={forecastQuery.data} />

        <div className="grid gap-6 md:grid-cols-2">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data as any} /> {/* ✅ FIX */}
        </div>
      </div>
    </div>
  );
}
