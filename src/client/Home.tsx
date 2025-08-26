import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TextField, CircularProgress } from '@mui/material';
import { WEATHER_METRICS } from './consts';
import { WEATHER_UNITS } from './consts';
import { getWeather } from './api';
import Toast from './Toast';
import './styles.css';

const Home = () => {
  const [city, setCity] = useState('Tel Aviv');
  const [debouncedCity] = useDebounce(city, 500);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getWeather(debouncedCity)
      .then(data => setWeather(data))
      .catch(() => {
        setError('Failed to fetch weather data. Please try again.');
        setOpen(true);
      })
      .finally(() => setLoading(false));
  }, [debouncedCity]);

  let metricValues: { label: string; value: any; unit?: string }[] = [];

  if (weather?.timelines?.hourly) {
    const now = new Date();
    const currentHourIso = now.toISOString().slice(0, 13);
    const match = weather.timelines.hourly.find((h: any) => h.time.slice(0, 13) === currentHourIso);
    if (match && match.values) {
      metricValues = WEATHER_METRICS.map(k => ({
        label: k.label,
        value: match.values[k.value] !== undefined ? match.values[k.value] : '--',
        unit: WEATHER_UNITS[k.value] || ''
      }));
    }
  }

  return (
    <div>
      <h2 className='heading'>Current Weather</h2>
      <Toast message={error} severity='error' open={open} onClose={() => setOpen(false)} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          label='Location'
          value={city}
          onChange={e => setCity(e.target.value)}
          variant='outlined'
          size='small'
          className='input'
        />
        {loading ? (
          <div className='loading'><CircularProgress /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Key Metrics</h4>
            {!metricValues.length ? (
              <div className='empty-state'>No data available</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {metricValues.map((m, i) => (
                  <div key={i} style={{ marginBottom: 8 }} className='item'>
                    <span style={{ fontWeight: 500 }}>{m.label}:</span> {m.value}{m.unit}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
