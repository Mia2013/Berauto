import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Container, Typography, Grid, Chip, Stack, Alert, Snackbar,
    CircularProgress, TextField, Paper, Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getData, endpoints } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import CarCard from '../components/CarCard';
import BookingDialog from '../components/BookingDialog';

// Fuel values come from the backend as Fuel.Name (the seeded English strings).
// The chip label is the Hungarian translation.
const FUEL_FILTERS = [
    { key: "all", label: "Mind" },
    { key: "Petrol", label: "Benzin" },
    { key: "Diesel", label: "Dízel" },
    { key: "Hybrid", label: "Hibrid" },
    { key: "Electric", label: "Elektromos" },
];

const todayIso = () => new Date().toISOString().split("T")[0];

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [fuel, setFuel] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [toast, setToast] = useState(null);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const datesPartial = (!!startDate) !== (!!endDate);
    const datesValid = startDate && endDate && new Date(endDate) > new Date(startDate);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = datesValid ? { startDate, endDate } : {};
            const data = await getData(endpoints.carRentable, params);
            setCars(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni az autókat.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, datesValid]);

    useEffect(() => { load(); }, [load]);

    const filtered = useMemo(() => {
        if (fuel === "all") return cars;
        return cars.filter((c) => c.fuel === fuel);
    }, [cars, fuel]);

    const handleReserve = (car) => {
        // Both authenticated users and guests can open the dialog.
        // BookingDialog itself decides which fields to show based on auth state.
        setSelectedCar(car);
    };

    const handleBookingSuccess = (rental) => {
        setToast({
            severity: "success",
            message: `Sikeres foglalás! (#${rental.id}, összesen ${rental.totalCost?.toLocaleString("hu-HU")} Ft)`,
        });
        load();
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

                <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        alignItems={{ md: "center" }}
                    >
                        <Typography variant="body2" sx={{ minWidth: 200, fontWeight: 600 }}>
                            Mikor szeretne foglalni?
                        </Typography>
                        <TextField
                            label="Kezdő dátum"
                            type="date"
                            size="small"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: { min: todayIso() },
                            }}
                        />
                        <TextField
                            label="Záró dátum"
                            type="date"
                            size="small"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: { min: startDate || todayIso() },
                            }}
                        />
                        {(startDate || endDate) && (
                            <Button
                                size="small"
                                onClick={() => { setStartDate(""); setEndDate(""); }}
                            >
                                Törlés
                            </Button>
                        )}
                    </Stack>
                    {datesPartial && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Mindkét dátum szükséges a szűréshez. Most a jelenleg elérhető autókat listázzuk.
                        </Alert>
                    )}
                    {datesValid && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Csak azokat az autókat mutatjuk, amelyek a megadott időszakban szabadok.
                        </Typography>
                    )}
                </Paper>

                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
                    {FUEL_FILTERS.map((f) => (
                        <Chip
                            key={f.key}
                            label={f.label}
                            color={fuel === f.key ? "primary" : "default"}
                            onClick={() => setFuel(f.key)}
                            variant={fuel === f.key ? "filled" : "outlined"}
                        />
                    ))}
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : filtered.length === 0 ? (
                    <Alert severity="info">
                        {datesValid
                            ? "A kiválasztott időszakra nincs szabad autó ebben a kategóriában."
                            : "Jelenleg nincs elérhető autó ebben a kategóriában."}
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {filtered.map((car) => (
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
                initialStart={datesValid ? startDate : undefined}
                initialEnd={datesValid ? endDate : undefined}
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
