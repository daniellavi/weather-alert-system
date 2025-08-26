import { AlertDatabase, WeatherAlert } from './alertDatabase';
import { TomorrowApiProvider } from './tomorrowApiProvider';
import { sendEmail } from './emailService.js';

export class AlertEvaluator {
    constructor(
        private alertDb: AlertDatabase,
        private weatherProvider: TomorrowApiProvider
    ) { }

    async evaluateAlerts(): Promise<void> {
        try {
            console.info('Evaluating alerts');
            const batchSize = 100;
            let offset = 0;
            let alerts: WeatherAlert[] = await this.alertDb.getAlerts(batchSize, offset);
            while (alerts.length > 0) {
                for (const alert of alerts) {
                    let weather: any;
                    if (alert.location.includes(',')) {
                        const [lat, lon] = alert.location.split(',').map(Number);
                        weather = await this.weatherProvider.getForecast({ lat, lon });
                    } else {
                        weather = await this.weatherProvider.getForecast({ city: alert.location });
                    }

                    let value;
                    if (weather?.timelines?.hourly?.[0]?.values) {
                        value = weather.timelines.hourly[0].values[alert.parameter];
                    }
                    let triggered = false;
                    if (value !== undefined) {
                        triggered = value > alert.threshold;
                    }
                    const state = triggered ? 'triggered' : 'not triggered';
                    await this.alertDb.updateAlertState(alert.id!, state);
                    if (triggered && alert.email) {
                        await sendEmail(
                            alert.email,
                            `Weather Alert Triggered: ${alert.name || alert.parameter}`,
                            `Alert for ${alert.location}: ${alert.parameter} is ${value}, threshold was ${alert.threshold}.`
                        );
                    }
                }
                offset += batchSize;
                alerts = await this.alertDb.getAlerts(batchSize, offset);
            }
            console.info('Alerts evaluation completed');
        } catch (error) {
            console.error('Error evaluating alerts:', error);
            throw error;
        }
    }
}
