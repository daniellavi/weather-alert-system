import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, MenuItem, CircularProgress, ButtonGroup } from '@mui/material';
import WeatherAlertTable from './WeatherAlertTable';
import { useInfiniteScroll } from './useInfiniteScroll';
import { WEATHER_KEYS, WEATHER_UNITS } from './consts';
import { getAlerts, createAlert } from './api';
import { Alert } from './types';
import Toast from './Toast';
import './styles.css';

const Alerts = () => {
  const [locationType, setLocationType] = useState<'city' | 'coordinates'>('city');
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const PAGE_SIZE = 10;


  const {
    items: alerts,
    loading,
    error,
    reset: resetPagination
  } = useInfiniteScroll<Alert>({
    fetchFn: ({ offset, limit }) => getAlerts({ limit, offset }),
    pageSize: PAGE_SIZE
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      location: '',
      lat: '',
      lon: '',
      parameter: '',
      threshold: 0,
      name: '',
      description: '',
      email: ''
    }
  });

  useEffect(() => {
    if (error) setOpen(true);
  }, [error]);

  const onSubmit = async (data: any) => {
    try {
      const alertData = {
        ...data,
        threshold: Number(data.threshold)
      };
      if (data.lat) alertData.lat = Number(data.lat);
      if (data.lon) alertData.lon = Number(data.lon);
      await createAlert(alertData);
      reset();
      resetPagination();
      setSuccess('Alert created successfully!');
      setSuccessOpen(true);
    } catch {
      setSuccess(null);
      setSuccessOpen(false);
      setOpen(true);
    }
  };

  const handleTrimInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.trim() === '') e.target.value = value.trim();
  };

  return (
    <div>
      <h2 className='heading'>Alerts</h2>
      <Toast message={error} severity='error' open={open} onClose={() => setOpen(false)} />
      <Toast message={success} severity='success' open={successOpen} onClose={() => { setSuccessOpen(false); setSuccess(null); }} />
      {loading && <div className='loading'><CircularProgress /></div>}
      <form onSubmit={handleSubmit(onSubmit)} className='form'>
        <h3>Create New Alert</h3>
        <ButtonGroup>
          <Button
            onClick={() => setLocationType('city')}
            variant={locationType === 'city' ? 'contained' : 'outlined'}
            style={{ textTransform: 'capitalize' }}
          >City</Button>
          <Button
            onClick={() => setLocationType('coordinates')}
            variant={locationType === 'coordinates' ? 'contained' : 'outlined'}
            style={{ textTransform: 'capitalize' }}
          >Coordinates</Button>
        </ButtonGroup>
        {locationType === 'city' ? (
          <TextField
            label='City'
            {...register('location', { required: true })}
            error={!!errors.location}
            variant='outlined'
            size='small'
            className='input'
            onChange={handleTrimInput}
          />
        ) : (
          <>
            <TextField
              label='Latitude'
              {...register('lat', { required: true })}
              error={!!errors.lat}
              variant='outlined'
              size='small'
              className='input'
              type='number'
              slotProps={{ htmlInput: { step: 'any' } }}
            />
            <TextField
              label='Longitude'
              {...register('lon', { required: true })}
              error={!!errors.lon}
              variant='outlined'
              size='small'
              className='input'
              type='number'
              slotProps={{ htmlInput: { step: 'any' } }}
            />
          </>
        )}
        <TextField
          select
          label='Parameter'
          {...register('parameter')}
          error={!!errors.parameter}
          required
          variant='outlined'
          size='small'
          className='input'
          onChange={handleTrimInput}
        >
          {WEATHER_KEYS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </TextField>
        <TextField
          label='Threshold'
          type='number'
          {...register('threshold', { valueAsNumber: true })}
          error={!!errors.threshold}
          required
          variant='outlined'
          size='small'
          className='input'
        />
        <TextField
          label='Name'
          {...register('name')}
          variant='outlined'
          size='small'
          className='input'
          onChange={handleTrimInput}
        />
        <TextField
          label='Description'
          {...register('description')}
          variant='outlined'
          size='small'
          className='input'
          onChange={handleTrimInput}
        />
        <TextField
          label='Email'
          type='email'
          {...register('email')}
          variant='outlined'
          size='small'
          className='input'
          onChange={handleTrimInput}
        />
        <Button
          type='submit'
          disabled={loading}
          variant='contained'
          color='primary'
          size='large'
          className='button'
          sx={{ textTransform: 'capitalize' }}
        >
          {loading ? 'Creating...' : 'Create alert'}
        </Button>
      </form>
      <div className='alert-list'>
        <h3>Saved Alerts</h3>
        <WeatherAlertTable
          alerts={alerts.map(alert => ({
            ...alert,
            location: alert.location ?? ''
          }))}
        />
      </div>
    </div>
  );
};

export default Alerts;
