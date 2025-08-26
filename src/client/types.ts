export type getAlertsParams = { triggered?: boolean; limit?: number; offset?: number };

export type createAlertParams = { location: string; parameter: string; threshold: number };

export type Alert = {
    location?: string;
    lat?: number;
    lon?: number;
    parameter: string;
    threshold: number;
    name?: string;
    description?: string;
    email?: string;
};