import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormControlLabel, Switch, Alert, Typography, Box, IconButton, Grid
} from '@mui/material';
import { postData, endpoints } from '../API/apiCalls';
import CustomAlert from './CustomAlert';
import TitleComponent from './TitleComponent';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SaveIcon from '@mui/icons-material/Save';
import ValidationCaption from './ValidationCaption';

const InspectDialog = ({ open, rental, onClose, onSuccess }) => {
    const [mileage, setMileage] = useState("");
    const [condition, setCondition] = useState("");
    const [accept, setAccept] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (open) {
            setMileage("");
            setCondition("");
            setAccept(true);
            setError(null);
            setValidationErrors({});
        }
    }, [open, rental?.id]);

    if (!rental) return null;

    // Kliens oldali validáció
    const validateForm = () => {
        const errors = {};

        if (mileage !== "") {
            const mileageNum = Number(mileage);
            if (mileageNum < 0) {
                errors.mileage = "A kilométeróra állása nem lehet negatív!";
            }
            // Ha a bérlés objektumban benne van a kiinduló óraállás (pl. rental.carMileage vagy simán rental.mileage)
            // érdemes leellenőrizni, nehogy kisebb legyen:
            const currentCarMileage = rental.carMileage ?? rental.mileage;
            if (currentCarMileage && mileageNum < currentCarMileage) {
                errors.mileage = `A kilométeróra állása nem lehet kevesebb az autó aktuális állásánál (${currentCarMileage.toLocaleString("hu-HU")} km)!`;
            }
        }

        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError(null);
            return;
        }

        setSubmitting(true);
        setError(null);
        setValidationErrors({});

        try {
            const result = await postData(endpoints.rentalInspect(rental.id), {
                returnMileage: mileage ? Number(mileage) : null,
                condition: condition || null,
                accept,
            });
            onSuccess?.(result);
            onClose();
        } catch (err) {
            setError(err.message || "Az ellenőrzés rögzítése nem sikerült hálózati hiba miatt.");
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
                        <TitleComponent title={`Autó átvétele / Ellenőrzés (#${rental.id})`} marginY={0} />
                    </Box>
                    <IconButton onClick={onClose} size="small" disabled={submitting}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: "column", gap: 2.5 }}>
                    
                    {/* Felső információs sáv */}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                        Jármű: <strong>{rental.carBrand} {rental.carModel} ({rental.carRegNum})</strong> · Ügyfél: <strong>{rental.userName}</strong>
                    </Typography>

                    <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                        
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Visszahozatali kilométeróra állás"
                                type="number"
                                value={mileage}
                                onChange={(e) => {
                                    setMileage(e.target.value);
                                    setValidationErrors(p => ({ ...p, mileage: null }));
                                }}
                                error={!!validationErrors.mileage}
                                helperText={validationErrors.mileage || "Üresen hagyható, ha nem rögzít új értéket."}
                                slotProps={{ inputLabel: { shrink: true } }}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Megjegyzés / Autó állapota az átvételkor"
                                multiline
                                rows={3}
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={<Switch 
                                    checked={accept} 
                                    onChange={(e) => setAccept(e.target.checked)} 
                                    color={accept ? "success" : "warning"}
                                />}
                                label={
                                    <Typography sx={{ fontWeight: 600, color: accept ? 'success.main' : 'warning.main' }}>
                                        {accept ? "Elfogadva (Visszahelyezés az elérhető flottába)" : "Kivonás (Szervizbe küldés)"}
                                    </Typography>
                                }
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
                        {submitting ? "Rögzítés..." : "Mentés"}
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

export default InspectDialog;