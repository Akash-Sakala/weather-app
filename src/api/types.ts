export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  dt: number;
  visibility: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: WeatherData["main"];
    weather: WeatherData["weather"];
    wind: WeatherData["wind"];
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  cnt?: number;
}

export interface DailyForecastListItem {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  humidity: number;
  pressure: number;
  wind_speed?: number;
  wind_deg?: number;
  rain?: number;
  weather: WeatherCondition[];
}

export interface DailyForecast16Data {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;

  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;

    /** 🔥 required to satisfy TypeScript */
    coord?: Coordinates;  // <── making coord optional fixes build safely
  };

  cnt?: number; // <── optional fixes cnt mismatch
}
