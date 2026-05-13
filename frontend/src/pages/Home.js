import React from 'react';
import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../provider/AuthProvider';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <Box sx={{ mt: 4 }}>
            <Container maxWidth="md">
                <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: ".05rem", mb: 2 }}>
                        Bérautó
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Foglaljon autót egyszerűen, akár egy napra, akár hosszabb időszakra.
                    </Typography>

                    {isAuthenticated ? (
                        <>
                            <Typography sx={{ mb: 3 }}>
                                Üdvözöljük, <strong>{user?.name}</strong>!
                            </Typography>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                                <Button
                                    component={RouterLink}
                                    to="/cars"
                                    variant="contained"
                                    size="large"
                                    startIcon={<DirectionsCarFilledIcon />}
                                >
                                    Autók böngészése
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/my-rentals"
                                    variant="outlined"
                                    size="large"
                                >
                                    Bérléseim
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                            <Button
                                component={RouterLink}
                                to="/cars"
                                variant="contained"
                                size="large"
                                startIcon={<DirectionsCarFilledIcon />}
                            >
                                Autók böngészése
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="outlined"
                                size="large"
                                startIcon={<LoginIcon />}
                            >
                                Bejelentkezés
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="text"
                                size="large"
                                startIcon={<PersonAddIcon />}
                            >
                                Regisztráció
                            </Button>
                        </Stack>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Home;
