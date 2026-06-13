import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    MenuItem, Alert, Box, FormControlLabel, Switch, IconButton, Grid
} from "@mui/material";
import { putData, endpoints } from "../API/apiCalls";
import { FUEL_FILTERS } from '../constants/constants';  
import CustomAlert from './CustomAlert';
import TitleComponent from './TitleComponent';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SaveIcon from '@mui/icons-material/Save';
import ValidationCaption from './ValidationCaption';

const EditCarDialog = ({ open, car, onClose, onSuccess }) => {
    const [regNum, setRegNum] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState(0);
    const [fee, setFee] = useState(0);
    const [fuelId, setFuelId] = useState(1);
    const [isRentable, setIsRentable] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    // Form előtöltése az autó megnyitásakor
    useEffect(() => {
        if (open && car) {
            setRegNum(car.regNum ?? "");
            setBrand(car.brand ?? "");
            setModel(car.model ?? "");
            setMileage(car.mileage ?? 0);
            setFee(car.fee ?? 0);
            setIsRentable(car.isRentable !== undefined ? car.isRentable : true);
            setError(null);
            setValidationErrors({});

            if (car.fuelId) {
                setFuelId(car.fuelId);
            } else if (car.fuel) {
                const matchedFuel = FUEL_FILTERS.find(f => f.key?.toLowerCase() === car.fuel.toLowerCase());
                setFuelId(matchedFuel ? matchedFuel.id : 1);
            } else {
                setFuelId(1);
            }
        }
    }, [open, car]);

     const validateForm = (data) => {
        const errors = {};
        const cleanedReg = data.regNum.trim();
        const cleanedBrand = data.brand.trim();
        const cleanedModel = data.model.trim();

        if (!cleanedReg) errors.regNum = 'Rendszám megadása kötelező!';
        else if (cleanedReg.length > 10) errors.regNum = 'A rendszám nem lehet hosszabb 10 karakternél!';

        if (!cleanedBrand) errors.brand = 'Márka megadása kötelező!';
        else if (cleanedBrand.length > 15) errors.brand = 'A márka nem lehet hosszabb 15 karakternél!';

        if (!cleanedModel) errors.model = 'Modell megadása kötelező!';
        else if (cleanedModel.length > 20) errors.model = 'A modell nem lehet hosszabb 20 karakternél!';

        if (Number(data.mileage) < 0) errors.mileage = 'A kilométeróra állása nem lehet negatív!';
        if (Number(data.fee) < 0) errors.fee = 'A napi díj nem lehet negatív!';

        return errors;
    };

    const handleSubmit = async () => {
        const rawData = {
            regNum,
            brand,
            model,
            mileage,
            fee
        };

        const errors = validateForm(rawData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError(null);
            return;
        }

        const cleanedRegNum = regNum.trim().toUpperCase();
        setSubmitting(true);
        setError(null);
        setValidationErrors({});

        try {
            const result = await putData(endpoints.carById(car.id), {
                regNum: cleanedRegNum,
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
            setError(err.message || "Az autó módosítása nem sikerült hálózati hiba miatt.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="primary" />
                        <TitleComponent title="Autó szerkesztése" marginY={0} />
                    </Box>
                    <IconButton onClick={onClose} size="small" disabled={submitting}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: "column", gap: 2.5 }}>
                    <Grid container spacing={3} sx={{ alignItems: 'center', mt: 0.5 }}>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Rendszám"
                                value={regNum}
                                onChange={(e) => setRegNum(e.target.value)}
                                required
                                error={!!validationErrors.regNum}
                                helperText={validationErrors.regNum}
                                inputProps={{ maxLength: 10 }}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Márka"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                required
                                error={!!validationErrors.brand}
                                helperText={validationErrors.brand}
                                inputProps={{ maxLength: 15 }} 
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Modell"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                                error={!!validationErrors.model}
                                helperText={validationErrors.model}
                                inputProps={{ maxLength: 20 }} 
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Kilométeróra"
                                type="number"
                                value={mileage}
                                onChange={(e) => setMileage(e.target.value)}
                                error={!!validationErrors.mileage}
                                helperText={validationErrors.mileage} 
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Napi díj (Ft)"
                                type="number"
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                                error={!!validationErrors.fee}
                                helperText={validationErrors.fee} 
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField 
                                label="Üzemanyag" 
                                select 
                                value={fuelId} 
                                onChange={(e) => setFuelId(e.target.value)}
                                fullWidth
                            >
                                {/* Dinamikusan szűrjük ki a "Mind" (-1 id) opciót, mint az AddCar-nál */}
                                {FUEL_FILTERS.filter(f => f.id !== -1).map(f => 
                                    <MenuItem key={f.id} value={f.id}>{f.label}</MenuItem>
                                )}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <FormControlLabel
                                control={<Switch 
                                    checked={isRentable} 
                                    onChange={(e) => setIsRentable(e.target.checked)} 
                                />}
                                label="Bérelhető"
                            />
                        </Grid>
                    </Grid>
                    
                    {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                </DialogContent>

                <DialogActions>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={submitting}
                        color="primary"
                        startIcon={<SaveIcon />}
                    >
                        {submitting ? "Mentés..." : "Mentés"}
                    </Button>
                    <Button 
                        onClick={onClose} 
                        disabled={submitting} 
                        startIcon={<CancelIcon />} 
                        color='default' 
                        variant="outlined"
                    >
                        Mégse
                    </Button>
                </DialogActions>
            </Dialog>

            {alert && <CustomAlert alert={alert} setAlert={setAlert} />}
        </div>
    );
};

export default EditCarDialog;