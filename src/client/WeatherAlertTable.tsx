import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { TABLE_COLUMNS, WEATHER_KEYS, WEATHER_UNITS } from './consts';
import type { WeatherAlert } from '../server/alertDatabase';

interface WeatherAlertTableProps {
  alerts: WeatherAlert[];
  emptyMessage?: string;
}

const WeatherAlertTable: React.FC<WeatherAlertTableProps> = ({ alerts, emptyMessage = 'No alerts yet' }) => {
  if (!alerts.length) {
    return <div className='empty-state'>{emptyMessage}</div>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {TABLE_COLUMNS.map(col => (
              <TableCell key={col.id}><strong>{col.label}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((a, i) => (
            <TableRow key={i}>
              <TableCell>{a.name || '-'}</TableCell>
              <TableCell>{a.description || '-'}</TableCell>
              <TableCell>{a.location}</TableCell>
              <TableCell>{WEATHER_KEYS.find(key => key.value === a.parameter)?.label || a.parameter}</TableCell>
              <TableCell>{a.threshold}{WEATHER_UNITS[a.parameter]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeatherAlertTable;
