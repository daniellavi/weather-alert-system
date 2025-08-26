import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import { initializeCronJob } from './cronService.js';
import { TomorrowApiProvider } from './tomorrowApiProvider.js';
import { AlertDatabase, WeatherAlert } from './alertDatabase.js';
import { generateToken, authenticateToken } from './auth.js';
import { AlertEvaluator } from './alertEvaluator.js';
import { CLIENT_URL, DEMO_PASSWORD } from './consts.js';
import { WeatherTimesteps, WeatherUnits } from './types.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json());

const port = process.env.PORT || 3000;
const alertDb = new AlertDatabase();
alertDb.init();

const weatherProvider = new TomorrowApiProvider();
const alertEvaluator = new AlertEvaluator(alertDb, weatherProvider);
const evalIntervalMinutes = Number(process.env.ALERT_EVAL_INTERVAL_MINUTES) || 5;

const schedule = `*/${evalIntervalMinutes} * * * *`;
initializeCronJob(schedule, async () => await alertEvaluator.evaluateAlerts());

app.post('/api/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' });
    }
    if (password !== DEMO_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken({ username });
    res.json({ token });
});

app.post('/api/alerts', authenticateToken, async (req: Request, res: Response) => {
    const { location, lat, lon, parameter, threshold, name, description, email } = req.body;
    if ((!location && (!lat || !lon)) || !parameter || !threshold) {
        return res.status(400).json({ error: 'Either location or both lat/lon, parameter and threshold, are required' });
    }

    let coordinates;
    if (lat && lon) {
        coordinates = `${lat},${lon}`;
    }

    try {
        const alert: WeatherAlert = {
            location: coordinates || location,
            parameter,
            threshold,
            name,
            description,
            email
        };

        const id = await alertDb.addAlert(alert);
        res.status(201).json({ id, ...alert });
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.get('/api/alerts', authenticateToken, async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;
        const triggered =
            typeof req.query.triggered === 'string'
                ? req.query.triggered === 'true'
                : undefined;

        const alerts = await alertDb.getAlerts(limit, offset, triggered);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.delete('/api/alerts', authenticateToken, async (req: Request, res: Response) => {
    try {
        await alertDb.deleteAllAlerts();
        res.send();
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.get('/api/forecast', authenticateToken, async (req: Request, res: Response) => {
    const { lat, lon, city, timesteps, units } = req.query;
    if (!(city || (lat && lon))) {
        return res.status(400).json({ error: 'location required: provide either city or lat and lon' });
    }

    try {
        const forecast = await weatherProvider.getForecast({
            city: city ? String(city) : undefined,
            lat: lat ? Number(lat) : undefined,
            lon: lon ? Number(lon) : undefined,
            timesteps: timesteps
                ? String(timesteps).split(',').map(ts => WeatherTimesteps[ts as keyof typeof WeatherTimesteps])
                : [WeatherTimesteps.HOURLY],
            units: units as WeatherUnits,
        });
        res.json(forecast);
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
