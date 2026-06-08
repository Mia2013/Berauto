import React from 'react'
import { Typography, Button, Stack, Paper, } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { useAuth } from '../provider/AuthProvider';

const WelcomeUser = () => {
    const { user } = useAuth();

    return (
        <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: 4, background: '#fff' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Üdvözöljük újra, {user?.name || 'Kedves Ügyfelünk'}!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                Készen áll a következő kalandra? Tekintse meg aktuálisan elérhető járműveinket, ellenőrizze aktív bérléseit vagy indítson új foglalást gyorsan és egyszerűen.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                    component={RouterLink}
                    to="/cars"
                    variant="contained"
                    size="large"
                    startIcon={<DirectionsCarFilledIcon />}
                    sx={{ px: 4 }}
                >
                    Autók böngészése
                </Button>
                <Button
                    component={RouterLink}
                    to="/my-rentals"
                    variant="outlined"
                    size="large"
                    sx={{ px: 4 }}
                >
                    Bérléseim megtekintése
                </Button>
            </Stack>
        </Paper>
    )
}

export default WelcomeUser;