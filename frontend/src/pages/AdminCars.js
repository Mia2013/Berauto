import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Tabs, Tab, Grid, Alert, CircularProgress,
    Button, Stack, Paper,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getData, postData, endpoints, deleteData } from '../API/apiCalls';
import CarCard from '../components/CarCard';
import AddCarDialog from '../components/AddCarDialog';
import EditCarDialog from '../components/EditCarDialog';
import CustomAlert from '../components/CustomAlert';
import TitleComponent from '../components/TitleComponent';

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
    const [editCar, setEditCar] = useState(null);

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
            setToast({ severity: "success", message: "A jármű státusza sikeresen frissítve." });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A művelet nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (car) => {
        if (!window.confirm(`Biztosan törölni szeretnéd a(z) ${car.brand} ${car.model} (${car.regNum}) autót?`)) {
            return;
        }

        setBusyId(car.id);
        try {
            await deleteData(endpoints.carDelById(car.id));
            setToast({ severity: "success", message: "Az autó sikeresen törölve lett a flottából." });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A törlés nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    const renderActions = (car) => {
        return (
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
                 <Grid size={activeTab.key === "rented" ? 12 : 6}>
                    <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        disabled={busyId === car.id}
                        onClick={() => setEditCar(car)}
                        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                        startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />}
                    >
                        Szerkesztés
                    </Button>
                </Grid>

                 {activeTab.key === "available" && (
                    <Grid size={6}>
                        <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            color="warning"
                            startIcon={<BuildIcon sx={{ fontSize: '14px !important' }} />}
                            disabled={busyId === car.id}
                            onClick={() => handleAction(car, "maintenance")}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                        >
                            Szervizbe
                        </Button>
                    </Grid>
                )}

                {(activeTab.key === "inspection" || activeTab.key === "service") && (
                    <Grid size={6}>
                        <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            disabled={busyId === car.id}
                            onClick={() => handleAction(car, "activate")}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                        >
                            Aktiválás
                        </Button>
                    </Grid>
                )}

                 {activeTab.key !== "rented" && (
                    <Grid size={12}>
                      <Divider  sx={{ my: 1}}/>
                        <Button
                            fullWidth
                            size="small"
                            variant="text"
                            color="error"
                            disabled={busyId === car.id}
                            onClick={() => handleDelete(car)}
                            sx={{ 
                                  textTransform: 'none', 
                                fontWeight: 600,
                                '&:hover': { bgcolor: 'error.lighter', opacity: 0.9 }
                            }}
                            startIcon={<DeleteIcon sx={{ fontSize: '14px !important' }} />}

                        >
                            Jármű végleges törlése
                        </Button>
                    </Grid>
                )}
            </Grid>
        );
    };

    return (
        <Box sx={{ mt: 3, mb: 4 }}>
            <Container maxWidth="xl">
                 <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                        <Box>
                            <TitleComponent title="Autópark kezelése" marginY={0} alignItems="start" />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Rendszerezze, szerkessze vagy vonja ki a forgalomból a flotta gépjárműveit.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setAddOpen(true)}
                            sx={{ py: 1.2, px: 3, fontWeight: 'bold', borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}
                        >
                            Új autó hozzáadása
                        </Button>
                    </Stack>

                    <Tabs
                        value={tabIndex}
                        onChange={(_, v) => setTabIndex(v)}
                        sx={{ 
                            mt: 3, 
                            borderBottom: 1, 
                            borderColor: 'divider',
                            '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem' }
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {TABS.map((t) => <Tab key={t.key} label={t.label} />)}
                    </Tabs>
                </Paper>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : cars.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>Jelenleg nincs autó ebben a kategóriában.</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {cars.map((car) => (
                            <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <CarCard car={car} actions={renderActions(car)} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <AddCarDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={load}
            />

            <EditCarDialog
                open={!!editCar}
                car={editCar}
                onClose={() => setEditCar(null)}
                onSuccess={() => { setToast({ severity: "success", message: "Autó adatai frissítve." }); load(); }}
            />

            {toast && <CustomAlert alert={toast} setAlert={setToast} />}
        </Box>
    );
};

export default AdminCars;