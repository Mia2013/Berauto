import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Typography, Box, Alert, Divider,
} from '@mui/material';
import { postData, endpoints } from '../API/apiCalls';

const todayIso = () => new Date().toISOString().split("T")[0];
const tomorrowIso = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
};

const BookingDialog = ({ open, car, onClose, onSuccess, initialStart, initialEnd }) => {
    const [start, setStart] = useState(initialStart || todayIso());
    const [end, setEnd] = useState(initialEnd || tomorrowIso());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Re-seed the dates whenever the dialog opens (or the parent's dates change).
    useEffect(() => {
        if (open) {
            setStart(initialStart || todayIso());
            setEnd(initialEnd || tomorrowIso());
            setError(null);
        }
    }, [open, car?.id, initialStart, initialEnd]);

    const days = useMemo(() => {
        if (!start || !end) return 0;
        const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
        return Math.max(1, Math.ceil(diff));
    }, [start, end]);

    const totalCost = car ? days * car.fee : 0;
    const datesValid = start && end && new Date(end) > new Date(start);

    const handleConfirm = async () => {
        if (!datesValid) {
            setError("A visszaadás dátumának későbbinek kell lennie, mint az átvételé.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const rental = await postData(endpoints.rentals, {
                carId: car.id,
                plannedStart: new Date(start).toISOString(),
                plannedEnd: new Date(end).toISOString(),
            });
            onSuccess?.(rental);
            onClose();
        } catch (err) {
            setError(err.message || "Nem sikerült a foglalás.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!car) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Foglalás: {car.brand} {car.model}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Rendszám: <strong>{car.regNum}</strong> · {car.fuel} · {car.fee.toLocaleString("hu-HU")} Ft / nap
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Átvétel dátuma"
                        type="date"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: todayIso() },
                        }}
                    />
                    <TextField
                        label="Visszaadás dátuma"
                        type="date"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: start || todayIso() },
                        }}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography>Időtartam:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{days} nap</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    <Typography variant="h6">Összesen:</Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {totalCost.toLocaleString("hu-HU")} Ft
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Mégse</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={submitting || !datesValid}
                >
                    {submitting ? "Foglalás..." : "Megerősítés"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingDialog;
