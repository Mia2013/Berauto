import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    MenuItem, Alert, Box, FormControlLabel, Switch,
} from '@mui/material';
import { postData, endpoints } from '../API/apiCalls';
import { CAR_STATUS } from '../constants/constants';

const FUELS = [
    { id: 1, name: "Benzin" },
    { id: 2, name: "Dízel" },
    { id: 3, name: "Hibrid" },
    { id: 4, name: "Elektromos" },
];

const AddCarDialog = ({ open, onClose, onSuccess }) => {
    const [regNum, setRegNum] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState(0);
    const [fee, setFee] = useState(0);
    const [fuelId, setFuelId] = useState(1);
    const [isRentable, setIsRentable] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setRegNum("");
            setBrand("");
            setModel("");
            setMileage(0);
            setFee(0);
            setFuelId(1);
            setIsRentable(true);
            setError(null);
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!regNum.trim() || !brand.trim() || !model.trim()) {
            setError("Rendszám, márka és modell megadása kötelező.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const result = await postData(endpoints.cars, {
                regNum: regNum.trim(),
                brand: brand.trim(),
                model: model.trim(),
                mileage: Number(mileage) || 0,
                fee: Number(fee) || 0,
                fuelId: Number(fuelId),
                statusId: CAR_STATUS.AVAILABLE,
                isRentable,
            });
            onSuccess?.(result);
            onClose();
        } catch (err) {
            setError(err.message || "Az autó hozzáadása nem sikerült.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Új autó hozzáadása</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField label="Rendszám" value={regNum} onChange={(e) => setRegNum(e.target.value)} required />
                    <TextField label="Márka" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                    <TextField label="Modell" value={model} onChange={(e) => setModel(e.target.value)} required />
                    <TextField label="Kilométeróra" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                    <TextField label="Napi díj (Ft)" type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
                    <TextField label="Üzemanyag" select value={fuelId} onChange={(e) => setFuelId(e.target.value)}>
                        {FUELS.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
                    </TextField>
                    <FormControlLabel
                        control={<Switch checked={isRentable} onChange={(e) => setIsRentable(e.target.checked)} />}
                        label="Bérelhető"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Mégse</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                    {submitting ? "Mentés..." : "Hozzáadás"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCarDialog;
