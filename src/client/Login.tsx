import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Container,
    Box,
    TextField,
    Alert as MuiAlert,
} from '@mui/material';
import { login } from './api';

const Login = ({ setToken }: { setToken: (token: string) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
            const token = await login(username, password);
            setToken(token);
            navigate('/');
        } catch (err) {
            setLoginError('Login failed');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container maxWidth='sm' sx={{ boxShadow: 6, borderRadius: 4, p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Typography variant='h5' fontWeight={600} color='primary' gutterBottom>
                        Login
                    </Typography>
                    <Box component='form' onSubmit={handleLogin} sx={{ width: '100%' }}>
                        <TextField
                            label='Username'
                            variant='filled'
                            fullWidth
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label='Password'
                            type='password'
                            variant='filled'
                            fullWidth
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button type='submit' variant='contained' color='primary' fullWidth size='large' sx={{ borderRadius: 2, boxShadow: 2, textTransform: 'capitalize' }}>
                            Login
                        </Button>
                    </Box>
                    {loginError && <MuiAlert severity='error' sx={{ width: '100%' }}>{loginError}</MuiAlert>}
                </Box>
            </Container>
        </Box>
    );
};

export default Login;