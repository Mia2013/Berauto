import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Button, Alert, CircularProgress, Stack,
    Snackbar, TextField, MenuItem,
} from '@mui/material';
import { getData, postData, endpoints } from '../API/apiCalls';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL } from '../constants/constants';
import InspectDialog from '../components/InspectDialog';
import EditRentalDialog from '../components/EditRentalDialog';

const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("hu-HU");
};

const statusColor = (statusId) => {
    switch (statusId) {
        case RENTAL_STATUS.CONFIRMED: return "info";
        case RENTAL_STATUS.ACTIVE: return "warning";
        case RENTAL_STATUS.RETURNED: return "secondary";
        case RENTAL_STATUS.COMPLETED: return "success";
        case RENTAL_STATUS.CANCELLED: return "default";
        default: return "default";
    }
};

const AdminRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [inspectTarget, setInspectTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(endpoints.rentals);
            setRentals(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a bérléseket.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = useMemo(() => {
        if (filter === "all") return rentals;
        return rentals.filter((r) => r.statusId === Number(filter));
    }, [rentals, filter]);

    const handleSimpleAction = async (rental, kind) => {
        setBusyId(rental.id);
        try {
            const urlMap = {
                handover: endpoints.rentalHandover(rental.id),
                return: endpoints.rentalReturn(rental.id),
                cancel: endpoints.rentalCancel(rental.id),
            };
            await postData(urlMap[kind]);
            setToast({ severity: "success", message: "Művelet sikeres." });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A művelet nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
                    Bérlések kezelése
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }} alignItems={{ sm: "center" }}>
                    <TextField
                        label="Állapot szűrő"
                        select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        size="small"
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="all">Összes</MenuItem>
                        {Object.entries(RENTAL_STATUS).map(([key, id]) => (
                            <MenuItem key={key} value={id}>{RENTAL_STATUS_LABEL[id]}</MenuItem>
                        ))}
                    </TextField>
                    <Button onClick={load} variant="outlined" size="small">Frissítés</Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : filtered.length === 0 ? (
                    <Alert severity="info">Nincs bérlés a kiválasztott szűrővel.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Ügyfél</TableCell>
                                    <TableCell>Autó</TableCell>
                                    <TableCell>Időszak</TableCell>
                                    <TableCell>Összeg</TableCell>
                                    <TableCell>Állapot</TableCell>
                                    <TableCell align="right">Műveletek</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>{r.id}</TableCell>
                                        <TableCell>
                                            {r.userName}
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {r.userEmail}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <strong>{r.carBrand} {r.carModel}</strong>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {r.carRegNum}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(r.plannedStart)} – {formatDate(r.plannedEnd)}
                                        </TableCell>
                                        <TableCell>{r.totalCost?.toLocaleString("hu-HU") ?? "—"} Ft</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={RENTAL_STATUS_LABEL[r.statusId] ?? r.status}
                                                size="small"
                                                color={statusColor(r.statusId)}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexWrap: "wrap", gap: 1 }}>
                                                {r.statusId === RENTAL_STATUS.CONFIRMED && (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            disabled={busyId === r.id}
                                                            onClick={() => handleSimpleAction(r, "handover")}
                                                        >
                                                            Átadás
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                            disabled={busyId === r.id}
                                                            onClick={() => handleSimpleAction(r, "cancel")}
                                                        >
                                                            Lemondás
                                                        </Button>
                                                    </>
                                                )}
                                                {r.statusId === RENTAL_STATUS.ACTIVE && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        disabled={busyId === r.id}
                                                        onClick={() => handleSimpleAction(r, "return")}
                                                    >
                                                        Visszavétel
                                                    </Button>
                                                )}
                                                {r.statusId === RENTAL_STATUS.RETURNED && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="secondary"
                                                        disabled={busyId === r.id}
                                                        onClick={() => setInspectTarget(r)}
                                                    >
                                                        Ellenőrzés
                                                    </Button>
                                                )}
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    onClick={() => setEditTarget(r)}
                                                >
                                                    Szerkesztés
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            <InspectDialog
                open={!!inspectTarget}
                rental={inspectTarget}
                onClose={() => setInspectTarget(null)}
                onSuccess={() => { setToast({ severity: "success", message: "Ellenőrzés rögzítve." }); load(); }}
            />

            <EditRentalDialog
                open={!!editTarget}
                rental={editTarget}
                onClose={() => setEditTarget(null)}
                onSuccess={() => { setToast({ severity: "success", message: "Bérlés frissítve." }); load(); }}
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

export default AdminRentals;
