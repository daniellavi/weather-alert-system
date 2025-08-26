export const API_BASE = 'http://localhost:3000/api';

export const LOGIN_ENDPOINT = `${API_BASE}/login`;

export const WEATHER_METRICS = [
  { value: 'temperature', label: 'Temperature' },
  { value: 'humidity', label: 'Humidity' },
  { value: 'windSpeed', label: 'Wind Speed' },
  { value: 'precipitationProbability', label: 'Precipitation Probability' },
  { value: 'cloudCover', label: 'Cloud Cover' }
];

export const WEATHER_KEYS = [
  { value: 'altimeterSetting', label: 'Altimeter Setting' },
  { value: 'cloudBase', label: 'Cloud Base' },
  { value: 'cloudCeiling', label: 'Cloud Ceiling' },
  { value: 'cloudCover', label: 'Cloud Cover' },
  { value: 'dewPoint', label: 'Dew Point' },
  { value: 'freezingRainIntensity', label: 'Freezing Rain Intensity' },
  { value: 'humidity', label: 'Humidity' },
  { value: 'precipitationProbability', label: 'Precipitation Probability' },
  { value: 'pressureSeaLevel', label: 'Pressure Sea Level' },
  { value: 'pressureSurfaceLevel', label: 'Pressure Surface Level' },
  { value: 'rainIntensity', label: 'Rain Intensity' },
  { value: 'sleetIntensity', label: 'Sleet Intensity' },
  { value: 'snowIntensity', label: 'Snow Intensity' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'temperatureApparent', label: 'Apparent Temperature' },
  { value: 'uvHealthConcern', label: 'UV Health Concern' },
  { value: 'uvIndex', label: 'UV Index' },
  { value: 'visibility', label: 'Visibility' },
  { value: 'weatherCode', label: 'Weather Code' },
  { value: 'windDirection', label: 'Wind Direction' },
  { value: 'windGust', label: 'Wind Gust' },
  { value: 'windSpeed', label: 'Wind Speed' }
];

export const WEATHER_UNITS: Record<string, string> = {
  cloudBase: 'km',
  cloudCeiling: 'km',
  cloudCover: '%',
  dewPoint: '°C',
  humidity: '%',
  iceAccumulation: 'mm',
  particulateMatter10: 'μg/m³',
  particulateMatter25: 'μg/m³',
  pollutantCO: 'ppb',
  pollutantNO2: 'ppb',
  pollutantO3: 'ppb',
  pollutantSO2: 'ppb',
  precipitationIntensity: 'mm/hr',
  precipitationProbability: '%',
  pressureSeaLevel: 'hPa',
  pressureSurfaceLevel: 'hPa',
  primarySwellWaveFromDirection: '°',
  primarySwellWaveSMeanPeriod: 's',
  primarySwellWaveSignificantHeight: 'm',
  secondarySwellWaveFromDirection: '°',
  secondarySwellWaveSMeanPeriod: 's',
  secondarySwellWaveSignificantHeight: 'm',
  soilMoistureVolumetric0To10: '%',
  soilMoistureVolumetric10To40: '%',
  soilMoistureVolumetric40To100: '%',
  soilMoistureVolumetric100To200: '%',
  soilMoistureVolumetric0To200: '%',
  soilTemperature0To10: '°C',
  soilTemperature10To40: '°C',
  soilTemperature40To100: '°C',
  soilTemperature100To200: '°C',
  soilTemperature0To200: '°C',
  solarDIF: 'W/m²',
  solarDIR: 'W/m²',
  solarGHI: 'W/m²',
  snowAccumulation: 'mm',
  temperature: '°C',
  temperatureApparent: '°C',
  tertiarySwellWaveFromDirection: '°',
  tertiarySwellWaveSMeanPeriod: 's',
  tertiarySwellWaveSignificantHeight: 'm',
  visibility: 'km',
  waveSignificantHeight: 'm',
  waveFromDirection: '°',
  waveMeanPeriod: 's',
  windDirection: '°',
  windGust: 'm/s',
  windSpeed: 'm/s',
  windWaveSignificantHeight: 'm',
  windWaveFromDirection: '°',
  windWaveMeanPeriod: 's'
};

export const TABLE_COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'location', label: 'Location' },
  { id: 'parameter', label: 'Parameter' },
  { id: 'threshold', label: 'Threshold' }
];
