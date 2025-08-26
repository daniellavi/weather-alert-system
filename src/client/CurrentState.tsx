import { useState, useEffect } from 'react';
import { getAlerts } from './api';
import { CircularProgress } from '@mui/material';
import WeatherAlertTable from './WeatherAlertTable';
import { useInfiniteScroll } from './useInfiniteScroll';
import type { WeatherAlert } from '../server/alertDatabase';
import Toast from './Toast';

const CurrentState = () => {
  const [open, setOpen] = useState(false);
  const PAGE_SIZE = 10;
  const {
    items: triggeredAlerts,
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
      <WeatherAlertTable alerts={triggeredAlerts} emptyMessage='All Clear' />
    </div>
  );
};

export default CurrentState;
