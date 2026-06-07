import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Tabs, Tab, Grid, Alert, CircularProgress,
    Button, Stack, Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { getData, postData, endpoints } from '../API/apiCalls';
import CarCard from '../components/CarCard';
import AddCarDialog from '../components/AddCarDialog';
import EditCarDialog from '../components/EditCarDialog';

const TABS = [
    { key: "available", label: "Elérhető", endpoint: endpoints.cars },
    { key: "rented", label: "Bérelt", endpoint: endpoints.carRented },
    { key: "inspection", label: "Ellenőrzésre vár", endpoint: endpoints.carAwaitingInspection },
    { key: "service", label: "Szervizben", endpoint: endpoints.carServiced },
];

const AdminCars = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [editCar, setEditCar] = useState(null); // the car currently being edited, or null

    const activeTab = TABS[tabIndex];

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(activeTab.endpoint);
            setCars(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni az autókat.");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { load(); }, [load]);

    const handleAction = async (car, kind) => {
        setBusyId(car.id);
        try {
            const url = kind === "maintenance"
                ? endpoints.carMaintenance(car.id)
                : endpoints.carActivate(car.id);
            await postData(url);
            setToast({ severity: "success", message: "Művelet sikeres." });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A művelet nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    const renderActions = (car) => {
        // The Edit button is always available — admins and clerks may modify
        // car properties at any time regardless of the car's current state.
        const editBtn = (
            <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditCar(car)}
            >
                Szerkesztés
            </Button>
        );

        let tabBtn = null;
        switch (activeTab.key) {
            case "available":
                tabBtn = (
                    <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        disabled={busyId === car.id}
                        onClick={() => handleAction(car, "maintenance")}
                    >
                        Szervizbe
                    </Button>
                );
                break;
            case "inspection":
            case "service":
                tabBtn = (
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={busyId === car.id}
                        onClick={() => handleAction(car, "activate")}
                    >
                        Aktiválás
                    </Button>
                );
                break;
            case "rented":
            default:
                tabBtn = null;
        }

        return (
            <Stack spacing={1} sx={{ width: "100%" }}>
                {editBtn}
                {tabBtn}
            </Stack>
        );
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="xl">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Autók kezelése
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddOpen(true)}
                    >
                        Új autó
                    </Button>
                </Stack>

                <Tabs
                    value={tabIndex}
                    onChange={(_, v) => setTabIndex(v)}
                    sx={{ mb: 3 }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {TABS.map((t) => <Tab key={t.key} label={t.label} />)}
                </Tabs>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : cars.length === 0 ? (
                    <Alert severity="info">Üres lista.</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {cars.map((car) => (
                            <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <CarCard car={car} actions={renderActions(car)} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <AddCarDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={() => { setToast({ severity: "success", message: "Új autó hozzáadva." }); load(); }}
            />

            <EditCarDialog
                open={!!editCar}
                car={editCar}
                onClose={() => setEditCar(null)}
                onSuccess={() => { setToast({ severity: "success", message: "Autó adatai frissítve." }); load(); }}
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

export default AdminCars;
