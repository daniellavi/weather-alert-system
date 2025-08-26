import { useState, useEffect } from 'react';
import { getAlerts } from './api';
import { CircularProgress } from '@mui/material';
import { useInfiniteScroll } from './useInfiniteScroll';
import type { WeatherAlert } from '../server/alertDatabase';
import Toast from './Toast';
import { WEATHER_KEYS } from './consts';
import { WEATHER_UNITS } from './consts';

const CurrentState = () => {
  const [open, setOpen] = useState(false);
  const PAGE_SIZE = 10;
  const {
    items: triggered,
    loading,
    error
  } = useInfiniteScroll<WeatherAlert>({
    fetchFn: ({ offset, limit }) => getAlerts({ triggered: true, limit, offset }),
    pageSize: PAGE_SIZE
  });

  useEffect(() => {
    if (error) setOpen(true);
  }, [error]);

  return (
    <div className='alert-list'>
      <h2 className='heading'>Current State</h2>
      <Toast message={error} severity='error' open={open} onClose={() => setOpen(false)} />
      {loading && <div className='loading'><CircularProgress /></div>}
      {!loading && !triggered.length ? (
        <div className='empty-state' style={{ textAlign: 'center', fontSize: '1.5rem' }}>All Clear</div>
      ) : (
        <>
          {triggered.map((a, i) => (
            <div key={i} className='item'>
              {a.location} - {WEATHER_KEYS.find(key => key.value === a.parameter)?.label} - {a.threshold}{WEATHER_UNITS[a.parameter]}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CurrentState;
