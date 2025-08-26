import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export interface WeatherAlert {
    id?: number;
    location: string;
    parameter: string;
    threshold: number;
    name?: string;
    description?: string;
    state?: 'triggered' | 'not triggered';
    email?: string;
}

export class AlertDatabase {
    private db!: Database;

    constructor(private dbPath: string = './alerts.db') { }

    async init() {
        try {
            this.db = await open({
                filename: this.dbPath,
                driver: sqlite3.Database
            });
            await this.db.run(`CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location TEXT NOT NULL,
                parameter TEXT NOT NULL,
                threshold REAL NOT NULL,
                name TEXT,
                description TEXT,
                state TEXT DEFAULT 'not triggered',
                email TEXT
            )`);
        } catch (error) {
            console.error('DB init error:', error);
            throw error;
        }
    }

    async addAlert(alert: WeatherAlert): Promise<number> {
        try {
            console.info('Adding alert:', alert);
            const result = await this.db.run(
                `INSERT INTO alerts (location, parameter, threshold, name, description, state, email) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                alert.location,
                alert.parameter,
                alert.threshold,
                alert.name || null,
                alert.description || null,
                alert.state || 'not triggered',
                alert.email || null
            );
            if (typeof result.lastID === 'number') {
                console.info('Alert added successfully:', result.lastID);
                return result.lastID;
            }
            const errorMessage = 'Failed to insert alert: lastID is undefined';
            console.error(errorMessage);
            throw new Error(errorMessage);
        } catch (error) {
            console.error('Error adding alert:', error);
            throw error;
        }
    }

    async updateAlertState(id: number, state: 'triggered' | 'not triggered'): Promise<void> {
        try {
            console.info('Updating alert state:', { id, state });
            await this.db.run('UPDATE alerts SET state = ? WHERE id = ?', [state, id]);
            console.info('Alert state updated successfully');
        } catch (error) {
            console.error('Error updating alert state:', error);
            throw error;
        }
    }

    async getAlerts(limit?: number, offset?: number, triggered?: boolean): Promise<WeatherAlert[]> {
        try {
            console.info('Fetching alerts from database', { limit, offset, triggered });
            let query = 'SELECT * FROM alerts';
            const params = [];
            if (typeof triggered === 'boolean') {
                query += ' WHERE state = ?';
                params.push(triggered ? 'triggered' : 'not triggered');
            }
            if (typeof limit === 'number') {
                query += params.length ? ' LIMIT ?' : ' LIMIT ?';
                params.push(limit);
            }
            if (typeof offset === 'number') {
                query += params.length ? ' OFFSET ?' : ' LIMIT -1 OFFSET ?';
                params.push(offset);
            }
            const results = await this.db.all(query, ...params);
            return results;
        } catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    }

    async deleteAllAlerts(): Promise<void> {
        try {
            console.info('Deleting all alerts');
            await this.db.run('DELETE FROM alerts');
            console.info('All alerts deleted successfully');
        } catch (error) {
            console.error('Error deleting all alerts:', error);
            throw error;
        }
    }
}
