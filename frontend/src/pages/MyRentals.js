import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Button, Alert, CircularProgress, Stack, Snackbar,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { getData, postData, endpoints } from '../API/apiCalls';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL } from '../constants/constants';
import ReceiptDialog from '../components/ReceiptDialog';

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

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(endpoints.myRentals);
            setRentals(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a bérléseket.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAction = async (rental, action, label) => {
        setBusyId(rental.id);
        try {
            const url = action === "cancel"
                ? endpoints.rentalCancel(rental.id)
                : endpoints.rentalReturn(rental.id);
            await postData(url);
            setToast({ severity: "success", message: `${label} sikeresen rögzítve.` });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A művelet nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    const handleViewReceipt = async (rental) => {
        try {
            const receipt = await getData(endpoints.receiptByRental(rental.id));
            setSelectedReceipt(receipt);
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A bizonylat nem érhető el." });
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
                    Bérléseim
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : rentals.length === 0 ? (
                    <Alert severity="info">Még nincs egyetlen bérlése sem.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Autó</TableCell>
                                    <TableCell>Időszak</TableCell>
                                    <TableCell>Összeg</TableCell>
                                    <TableCell>Állapot</TableCell>
                                    <TableCell align="right">Műveletek</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rentals.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>{r.id}</TableCell>
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
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                {r.statusId === RENTAL_STATUS.CONFIRMED && (
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="outlined"
                                                        disabled={busyId === r.id}
                                                        onClick={() => handleAction(r, "cancel", "Lemondás")}
                                                    >
                                                        Lemondás
                                                    </Button>
                                                )}
                                                {r.statusId === RENTAL_STATUS.ACTIVE && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        disabled={busyId === r.id}
                                                        onClick={() => handleAction(r, "return", "Visszaadás")}
                                                    >
                                                        Visszaadás
                                                    </Button>
                                                )}
                                                {r.statusId === RENTAL_STATUS.COMPLETED && (
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        startIcon={<ReceiptLongIcon />}
                                                        onClick={() => handleViewReceipt(r)}
                                                    >
                                                        Bizonylat
                                                    </Button>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            <ReceiptDialog
                open={!!selectedReceipt}
                receipt={selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
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

export default MyRentals;
