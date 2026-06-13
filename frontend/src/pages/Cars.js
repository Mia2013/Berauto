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
import TitleComponent from '../components/TitleComponent';
import CustomAlert from '../components/CustomAlert';
import { FUEL_FILTERS } from '../constants/constants';

const todayIso = () => new Date().toISOString().split("T")[0];

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [fuel, setFuel] = useState("all");
    const [startDate, setStartDate] = useState(null);
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
        // eslint-disable-next-line 
    }, [startDate, endDate, datesValid]);

    useEffect(() => { load(); }, [load]);

    const filtered = useMemo(() => {
        if (fuel === "all") return cars;
        return cars.filter((c) => c.fuel === fuel);
    }, [cars, fuel]);

    const handleReserve = (car) => {
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


                <Paper sx={{ p: 2, mb: 3 }} elevation={0}>
                    <TitleComponent title="Elérhető autók" />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
                        Válasszon egy autót és foglalja le pár kattintással
                    </Typography>
                    <Stack direction={{ xs: "column", md: "row",
                    
                 }}
                    sx={{   alignItems: 'center', justifyContent: 'space-between',}}> <Stack
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
                                defaultValue={startDate}
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

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                            {FUEL_FILTERS.map((f) => (
                                <Chip
                                    key={f.key}
                                    label={f.label}
                                    color={fuel === f.key ? "primary" : "default"}
                                    onClick={() => setFuel(f.key)}
                                    variant={fuel === f.key ? "filled" : "outlined"}
                                />
                            ))}
                        </Stack></Stack>
                </Paper>



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


            {toast && <CustomAlert alert={toast} setAlert={setToast} />}
        </Box>
    );
};

export default Cars;
