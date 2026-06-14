import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Button, Alert, CircularProgress, Stack, 
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import dayjs from 'dayjs';
import { getData, postData, endpoints } from '../API/apiCalls';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL } from '../constants/constants';
import ReceiptDialog from '../components/ReceiptDialog';
import TitleComponent from '../components/TitleComponent';
import CustomAlert from '../components/CustomAlert';

const statusColor = (statusId) => {
    switch (statusId) {
        case RENTAL_STATUS.CONFIRMED: return "info";
        case RENTAL_STATUS.ACTIVE: return "warning";
        case RENTAL_STATUS.RETURNED: return "secondary";
        case RENTAL_STATUS.COMPLETED: return "success";
        case RENTAL_STATUS.CANCELLED: return "error";
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

                <TitleComponent title="Bérléseim" />
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : rentals.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>Még nincs egyetlen bérlése sem.</Alert>
                ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Autó</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Időszak</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Összeg</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Állapot</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Műveletek</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rentals.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>{r.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {r.carBrand} {r.carModel}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="primary.main" sx={{ fontWeight: 700 }}>
                                                {r.carRegNum}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {r.plannedStart ? dayjs(r.plannedStart).format('YYYY.MM.DD.') : '—'} – {r.plannedEnd ? dayjs(r.plannedEnd).format('YYYY.MM.DD.') : '—'}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{r.totalCost?.toLocaleString("hu-HU") ?? "—"} Ft</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={RENTAL_STATUS_LABEL[r.statusId] || "Ismeretlen"}
                                                size="small"
                                                color={statusColor(r.statusId)}
                                                variant="outlined"
                                                sx={{ fontWeight: 700 }}
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
                                                        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Lemondás
                                                    </Button>
                                                )}
                                                {r.statusId === RENTAL_STATUS.ACTIVE && (
                                                    <Button
                                                        size="small"
                                                        color="warning"
                                                        variant="outlined"
                                                        disabled={busyId === r.id}
                                                        onClick={() => handleAction(r, "return", "Visszaadás")}
                                                        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Visszaadás
                                                    </Button>
                                                )}
                                                {r.statusId === RENTAL_STATUS.COMPLETED && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<ReceiptLongIcon />}
                                                        onClick={() => handleViewReceipt(r)}
                                                        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
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

            {toast && <CustomAlert alert={toast} setAlert={setToast} />}
        </Box>
    );
};

export default MyRentals;