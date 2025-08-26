import cron from 'node-cron';

export const initializeCronJob = (schedule: string, callback: () => Promise<void> | void) => {
    cron.schedule(schedule, async () => {
        try {
            await callback();
        } catch (error) {
            console.error('Error in cron job:', error);
            throw error;
        }
    });
}
