import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    MenuItem, Alert, Box, IconButton, Grid, Typography
} from '@mui/material';
import dayjs from 'dayjs';  
import { putData, endpoints } from '../API/apiCalls';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL } from '../constants/constants';
import CustomAlert from './CustomAlert';
import TitleComponent from './TitleComponent';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SaveIcon from '@mui/icons-material/Save';
import ValidationCaption from './ValidationCaption';

const EditRentalDialog = ({ open, rental, onClose, onSuccess }) => {
    const [plannedStart, setPlannedStart] = useState(null);
    const [plannedEnd, setPlannedEnd] = useState(null);
    const [totalCost, setTotalCost] = useState("");
    const [statusId, setStatusId] = useState("");
    const [condition, setCondition] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (open && rental) {
            setPlannedStart(rental.plannedStart ? dayjs(rental.plannedStart) : null);
            setPlannedEnd(rental.plannedEnd ? dayjs(rental.plannedEnd) : null);
            setTotalCost(rental.totalCost ?? "");
            setStatusId(rental.statusId ?? "");
            setCondition(rental.condition ?? "");
            setError(null);
            setValidationErrors({});
        }
    }, [open, rental]);

    if (!rental) return null;

     const validateForm = () => {
        const errors = {};

        if (!plannedStart) errors.plannedStart = "Az átvétel dátuma kötelező!";
        if (!plannedEnd) errors.plannedEnd = "A visszaadás dátuma kötelező!";
        
        if (plannedStart && plannedEnd && !plannedEnd.isAfter(plannedStart)) {
            errors.plannedEnd = "A visszaadás dátumának későbbinek kell lennie, mint az átvételé!";
        }

        if (totalCost !== "" && Number(totalCost) < 0) {
            errors.totalCost = "A bérlési összeg nem lehet negatív!";
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
            const payload = {
                plannedStart: plannedStart ? plannedStart.format('YYYY-MM-DD'): null,
                plannedEnd: plannedEnd ? plannedEnd.format('YYYY-MM-DD') : null,
                totalCost: totalCost === "" ? null : Number(totalCost),
                statusId: statusId === "" ? null : Number(statusId),
                condition: condition === "" ? null : condition,
            };

            const result = await putData(endpoints.rentalById(rental.id), payload);
            onSuccess?.(result);
            onClose();
        } catch (err) {
            setError(err.message || "A mentés nem sikerült hálózati hiba miatt.");
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
                        <TitleComponent title={`Bérlés szerkesztése (#${rental.id})`} marginY={0} />
                    </Box>
                    <IconButton onClick={onClose} size="small" disabled={submitting}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: "column", gap: 2.5 }}>
                    
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                        Jármű: <strong>{rental.carBrand} {rental.carModel}</strong> · Ügyfél: <strong>{rental.userName}</strong>
                    </Typography>

                    <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                        
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Tervezett átvétel"
                                type="date"
                                value={plannedStart ? plannedStart.format('YYYY-MM-DD') : ""}
                                onChange={(e) => {
                                    setPlannedStart(e.target.value ? dayjs(e.target.value) : null);
                                    setValidationErrors(p => ({ ...p, plannedStart: null }));
                                }}
                                error={!!validationErrors.plannedStart}
                                helperText={validationErrors.plannedStart}
                                slotProps={{ inputLabel: { shrink: true } }}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Tervezett visszaadás"
                                type="date"
                                value={plannedEnd ? plannedEnd.format('YYYY-MM-DD') : ""}
                                onChange={(e) => {
                                    setPlannedEnd(e.target.value ? dayjs(e.target.value) : null);
                                    setValidationErrors(p => ({ ...p, plannedEnd: null }));
                                }}
                                error={!!validationErrors.plannedEnd}
                                helperText={validationErrors.plannedEnd}
                                slotProps={{ inputLabel: { shrink: true } }}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Összeg (Ft)"
                                type="number"
                                value={totalCost}
                                onChange={(e) => {
                                    setTotalCost(e.target.value);
                                    setValidationErrors(p => ({ ...p, totalCost: null }));
                                }}
                                error={!!validationErrors.totalCost}
                                helperText={validationErrors.totalCost}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Állapot"
                                select
                                value={statusId}
                                onChange={(e) => setStatusId(e.target.value)}
                                fullWidth
                            >
                                {Object.entries(RENTAL_STATUS).map(([key, id]) => (
                                    <MenuItem key={key} value={id}>
                                        {RENTAL_STATUS_LABEL[id]}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Megjegyzés / Autó állapota"
                                multiline
                                rows={3}
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                fullWidth
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

export default EditRentalDialog;