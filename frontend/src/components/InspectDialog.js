import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormControlLabel, Switch, Alert, Typography, Box,
} from '@mui/material';
import { postData, endpoints } from '../API/apiCalls';

const InspectDialog = ({ open, rental, onClose, onSuccess }) => {
    const [mileage, setMileage] = useState("");
    const [condition, setCondition] = useState("");
    const [accept, setAccept] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setMileage("");
            setCondition("");
            setAccept(true);
            setError(null);
        }
    }, [open, rental?.id]);

    if (!rental) return null;

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const result = await postData(endpoints.rentalInspect(rental.id), {
                returnMileage: mileage ? Number(mileage) : null,
                condition: condition || null,
                accept,
            });
            onSuccess?.(result);
            onClose();
        } catch (err) {
            setError(err.message || "Az ellenőrzés rögzítése nem sikerült.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Ellenőrzés — #{rental.id}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {rental.carBrand} {rental.carModel} ({rental.carRegNum}) — {rental.userName}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Visszahozatali kilométeróra állás"
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                        helperText="Üresen hagyható, ha nem rögzít új értéket."
                    />
                    <TextField
                        label="Megjegyzés / állapot"
                        multiline
                        rows={3}
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Switch checked={accept} onChange={(e) => setAccept(e.target.checked)} />}
                        label={accept ? "Elfogadva (vissza az elérhetők közé)" : "Szervizbe küldés"}
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

export default InspectDialog;
