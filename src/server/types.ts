export enum WeatherUnits {
    METRIC = 'metric',
    IMPERIAL = 'imperial',
}

export enum WeatherTimesteps {
    HOURLY = '1h',
    DAILY = '1d',
}

export interface ForecastParams {
    lat?: number;
    lon?: number;
    city?: string;
    timesteps?: WeatherTimesteps[];
    units?: WeatherUnits;
}