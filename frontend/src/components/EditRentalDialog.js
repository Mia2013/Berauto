import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    MenuItem, Alert, Typography, Box,
} from '@mui/material';
import { putData, endpoints } from '../API/apiCalls';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL } from '../constants/constants';

const isoToDate = (iso) => (iso ? new Date(iso).toISOString().split("T")[0] : "");

const EditRentalDialog = ({ open, rental, onClose, onSuccess }) => {
    const [plannedStart, setPlannedStart] = useState("");
    const [plannedEnd, setPlannedEnd] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [statusId, setStatusId] = useState("");
    const [condition, setCondition] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && rental) {
            setPlannedStart(isoToDate(rental.plannedStart));
            setPlannedEnd(isoToDate(rental.plannedEnd));
            setTotalCost(rental.totalCost ?? "");
            setStatusId(rental.statusId ?? "");
            setCondition(rental.condition ?? "");
            setError(null);
        }
    }, [open, rental]);

    if (!rental) return null;

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const payload = {
                plannedStart: plannedStart ? new Date(plannedStart).toISOString() : null,
                plannedEnd: plannedEnd ? new Date(plannedEnd).toISOString() : null,
                totalCost: totalCost === "" ? null : Number(totalCost),
                statusId: statusId === "" ? null : Number(statusId),
                condition: condition === "" ? null : condition,
            };
            const result = await putData(endpoints.rentalById(rental.id), payload);
            onSuccess?.(result);
            onClose();
        } catch (err) {
            setError(err.message || "A mentés nem sikerült.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Bérlés szerkesztése — #{rental.id}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {rental.carBrand} {rental.carModel} — {rental.userName}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Tervezett átvétel"
                        type="date"
                        value={plannedStart}
                        onChange={(e) => setPlannedStart(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Tervezett visszaadás"
                        type="date"
                        value={plannedEnd}
                        onChange={(e) => setPlannedEnd(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Összeg (Ft)"
                        type="number"
                        value={totalCost}
                        onChange={(e) => setTotalCost(e.target.value)}
                    />
                    <TextField
                        label="Állapot"
                        select
                        value={statusId}
                        onChange={(e) => setStatusId(e.target.value)}
                    >
                        {Object.entries(RENTAL_STATUS).map(([key, id]) => (
                            <MenuItem key={key} value={id}>{RENTAL_STATUS_LABEL[id]}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Megjegyzés"
                        multiline
                        rows={2}
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Mégse</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                    {submitting ? "Mentés..." : "Mentés"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditRentalDialog;
