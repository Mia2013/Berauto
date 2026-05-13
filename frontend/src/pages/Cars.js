import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Grid, Chip, Stack, Alert, Snackbar, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getData, endpoints } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import CarCard from '../components/CarCard';
import BookingDialog from '../components/BookingDialog';

const FUEL_FILTERS = [
    { key: "all", label: "Mind", endpoint: endpoints.cars },
    { key: "petrol", label: "Benzin", endpoint: endpoints.carPetrol },
    { key: "diesel", label: "Dízel", endpoint: endpoints.carDiesel },
];

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [toast, setToast] = useState(null);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const active = FUEL_FILTERS.find(f => f.key === filter) ?? FUEL_FILTERS[0];
            const data = await getData(active.endpoint);
            setCars(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni az autókat.");
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { load(); }, [load]);

    const handleReserve = (car) => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setSelectedCar(car);
    };

    const handleBookingSuccess = (rental) => {
        setToast({ severity: "success", message: `Sikeres foglalás! (#${rental.id}, összesen ${rental.totalCost?.toLocaleString("hu-HU")} Ft)` });
        load(); // Re-fetch so the reserved car drops off the available list.
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Elérhető autók
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Válasszon egy autót és foglalja le pár kattintással.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
                    {FUEL_FILTERS.map((f) => (
                        <Chip
                            key={f.key}
                            label={f.label}
                            color={filter === f.key ? "primary" : "default"}
                            onClick={() => setFilter(f.key)}
                            variant={filter === f.key ? "filled" : "outlined"}
                        />
                    ))}
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : cars.length === 0 ? (
                    <Alert severity="info">Jelenleg nincs elérhető autó ebben a kategóriában.</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {cars.map((car) => (
                            <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <CarCard car={car} onReserve={handleReserve} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <BookingDialog
                open={!!selectedCar}
                car={selectedCar}
                onClose={() => setSelectedCar(null)}
                onSuccess={handleBookingSuccess}
            />

            <Snackbar
                open={!!toast}
                autoHideDuration={5000}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {toast && (
                    <Alert severity={toast.severity} onClose={() => setToast(null)}>
                        {toast.message}
                    </Alert>
                )}
            </Snackbar>
        </Box>
    );
};

export default Cars;
