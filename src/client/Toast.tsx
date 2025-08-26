import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastProps {
  message: string | null;
  severity: 'success' | 'error';
  open: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, severity, open, onClose }) => (
  <Snackbar
    open={!!message && open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Toast;
