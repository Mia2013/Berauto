import React from 'react';
import { Container, Paper } from '@mui/material';
import LoginForm from '../components/LoginForm';

const Login = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 3, sm: 5 }, 
                    borderRadius: 4, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}
            >
                <LoginForm formElevation={0} />
            </Paper>
        </Container>
    );
};

export default Login;