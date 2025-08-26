import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { TOMORROW_API_BASE_URL } from './consts.js';
import { ForecastParams, WeatherTimesteps, WeatherUnits } from './types.js';

dotenv.config();

const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;

export class TomorrowApiProvider {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string = TOMORROW_API_KEY || '') {
        this.apiKey = apiKey;
        this.baseUrl = TOMORROW_API_BASE_URL;
    }

    async getForecast({ lat, lon, city, timesteps = [WeatherTimesteps.HOURLY], units = WeatherUnits.METRIC }: ForecastParams): Promise<any> {
        try {
            console.info('Fetching weather forecast:', { lat, lon, city, timesteps, units });

            let location: string;
            if (city) {
                location = city;
            } else if (typeof lat === 'number' && typeof lon === 'number') {
                location = `${lat},${lon}`;
            } else {
                const errorMessage = 'Location must be specified as either city name or latitude/longitude';
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
            const response: AxiosResponse = await axios.get(this.baseUrl, {
                params: {
                    location,
                    timesteps,
                    units,
                },
                headers: {
                    'apikey': this.apiKey,
                },
            });

            console.info('Weather forecast fetched successfully');
            return response.data;
        } catch (error) {
            console.error('Error fetching forecast:', error);
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data;
            }
            throw error;
        }
    }
}
