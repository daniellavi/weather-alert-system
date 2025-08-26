import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Home from './Home';
import Login from './Login';
import Alerts from './Alerts';
import CurrentState from './CurrentState';

const MENU_ITEMS = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Alerts', path: '/alerts-page', icon: <NotificationsActiveIcon /> },
  { name: 'Current State', path: '/current-state', icon: <AssessmentIcon /> }
];

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Router>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <CssBaseline />
          <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
            <AppBar position='fixed' color='primary' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 4, background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' }}>
              <Toolbar>
                <IconButton
                  color='inherit'
                  edge='start'
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant='h6' noWrap component='div' fontWeight={700}>
                  Weather Alert System
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant='temporary'
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              sx={{ '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', boxShadow: 6 } }}
            >
              <Toolbar />
              <Divider />
              <List>
                {MENU_ITEMS.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={window.location.pathname === item.path}
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        my: 0.5,
                        transition: 'background 0.2s',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #2193b022 0%, #6dd5ed22 100%)',
                        }
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.name} sx={{ fontWeight: window.location.pathname === item.path ? 700 : 400 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Toolbar />
              <Container maxWidth='md' sx={{ mt: 10, mb: 4, boxShadow: 6, borderRadius: 4, background: 'rgba(255,255,255,0.97)', p: 0 }}>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/alerts-page' element={<Alerts />} />
                  <Route path='/current-state' element={<CurrentState />} />
                  <Route path='*' element={<Navigate to='/' />} />
                </Routes>
              </Container>
            </Box>
          </Box>
        </>
      )}
    </Router>
  );
};

export default App;
