import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    MenuItem, Alert, Box, FormControlLabel, Switch, CircularProgress,
} from "@mui/material";
import { putData, endpoints } from "../API/apiCalls";

// Must match the Fuel.Id values seeded in the database.
const FUELS = [
    { id: 1, name: "Benzin" },
    { id: 2, name: "Dízel" },
    { id: 3, name: "Hibrid" },
    { id: 4, name: "Elektromos" },
];

// Maps the backend's Fuel.Name string (English) back to its Id, so the
// select can pre-populate when we receive a car from the cars list.
const FUEL_NAME_TO_ID = {
    Petrol: 1,
    Diesel: 2,
    Hybrid: 3,
    Electric: 4,
};

const EditCarDialog = ({ open, car, onClose, onSuccess }) => {
    const [regNum, setRegNum] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState(0);
    const [fee, setFee] = useState(0);
    const [fuelId, setFuelId] = useState(1);
    const [isRentable, setIsRentable] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Pre-fill the form whenever a new car is opened.
    useEffect(() => {
        if (open && car) {
            setRegNum(car.regNum ?? "");
            setBrand(car.brand ?? "");
            setModel(car.model ?? "");
            setMileage(car.mileage ?? 0);
            setFee(car.fee ?? 0);
            // car.fuel comes as the English Name from the backend; map it to Id.
            // car.fuelId is used if the API ever returns it directly.
            setFuelId(car.fuelId ?? FUEL_NAME_TO_ID[car.fuel] ?? 1);
            setIsRentable(car.isRentable !== undefined ? car.isRentable : true);
            setError(null);
        }
    }, [open, car]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!regNum.trim() || !brand.trim() || !model.trim()) {
            setError("Rendszám, márka és modell megadása kötelező.");
            return;
        }
        if (Number(mileage) < 0 || Number(fee) < 0) {
            setError("A kilométeróra és a napi díj nem lehet negatív.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const result = await putData(endpoints.carById(car.id), {
                regNum: regNum.trim(),
                brand: brand.trim(),
                model: model.trim(),
                mileage: Number(mileage) || 0,
                fee: Number(fee) || 0,
                fuelId: Number(fuelId),
                isRentable,
            });
            onSuccess?.(result);
            onClose();
        } catch (err) {
            setError(err.message || "Az autó módosítása nem sikerült.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Autó szerkesztése{car ? ` — ${car.brand} ${car.model}` : ""}
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField label="Rendszám" value={regNum} onChange={(e) => setRegNum(e.target.value)} required />
                    <TextField label="Márka" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                    <TextField label="Modell" value={model} onChange={(e) => setModel(e.target.value)} required />
                    <TextField label="Kilométeróra" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                    <TextField label="Napi díj (Ft)" type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
                    <TextField label="Üzemanyag" select value={fuelId} onChange={(e) => setFuelId(e.target.value)}>
                        {FUELS.map((f) => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
                    </TextField>
                    <FormControlLabel
                        control={<Switch checked={isRentable} onChange={(e) => setIsRentable(e.target.checked)} />}
                        label="Bérelhető"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Mégse</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} /> : null}
                >
                    {submitting ? "Mentés..." : "Mentés"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCarDialog;
