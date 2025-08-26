import axios from 'axios';
import { createAlertParams, getAlertsParams } from './types';
import { API_BASE, LOGIN_ENDPOINT } from './consts';

export const login = async (username: string, password: string): Promise<string> => {
  const res = await axios.post(LOGIN_ENDPOINT, { username, password });
  const token = res.data.token;
  if (token) {
    localStorage.setItem('token', token);
  }

  return token;
};

const getToken = () => {
  return localStorage.getItem('token') || '';
};

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getWeather = async (city: string) => {
  const res = await axios.get(`${API_BASE}/forecast`, {
    params: { city },
    headers: authHeader(),
  });

  return res.data;
};

export const getAlerts = async ({ triggered, limit = 10, offset = 0 }: getAlertsParams = {}) => {
  const params: any = { limit, offset };
  if (typeof triggered === 'boolean') params.triggered = triggered;
  const res = await axios.get(`${API_BASE}/alerts`, {
    headers: authHeader(),
    params,
  });

  return res.data;
};

export const createAlert = async (alert: createAlertParams) => {
  const res = await axios.post(`${API_BASE}/alerts`, alert, {
    headers: authHeader(),
  });

  return res.data;
};
