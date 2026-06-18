import React, { useState, useEffect, useMemo } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Typography, Box, Alert, Stack, IconButton
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import { postData, endpoints } from "../API/apiCalls";
import { useAuth } from "../provider/AuthProvider";
import TitleComponent from "./TitleComponent";
import FormDivider from "./FormDivider";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { EMPTY_GUEST } from "../constants/constants"


const BookingDialog = ({ open, car, onClose, onSuccess, initialStart, initialEnd }) => {
    const { isAuthenticated } = useAuth();
    const [start, setStart] = useState(initialStart ? dayjs(initialStart) : dayjs());
    const [end, setEnd] = useState(initialEnd ? dayjs(initialEnd) : dayjs().add(1, 'day'));
    const [guest, setGuest] = useState(EMPTY_GUEST);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setStart(initialStart ? dayjs(initialStart) : dayjs());
            setEnd(initialEnd ? dayjs(initialEnd) : dayjs().add(1, 'day'));
            setGuest(EMPTY_GUEST);
            setError(null);
            setValidationErrors({});
        }
    }, [open, car?.id, initialStart, initialEnd]);

    const days = useMemo(() => {
        if (!start || !end) return 0;
        const diff = end.diff(start, 'day');
        return Math.max(1, Math.ceil(diff));
    }, [start, end]);

    const totalCost = car ? days * car.fee : 0;

    const validateForm = () => {
        const errors = {};

        if (!start) errors.start = "Az átvétel dátuma kötelező!";
        if (!end) errors.end = "A visszaadás dátuma kötelező!";
        if (start && end && end.isBefore(start, 'day')) {
            errors.end = "A visszaadás dátuma nem lehet korábbi, mint az átvételé!";
        }

        if (!isAuthenticated) {
            const emailOk = /^\S+@\S+\.\S+$/.test(guest.email.trim());

            if (!guest.name.trim()) errors.name = "A név megadása kötelező!";
            else if (guest.name.trim().length < 2) errors.name = "A név legalább 2 karakter hosszú legyen!";

            if (!guest.email.trim()) errors.email = "Az email cím megadása kötelező!";
            else if (!emailOk) errors.email = "Kérjük, érvényes email címet adjon meg!";

            if (!guest.phone.trim()) errors.phone = "A telefonszám megadása kötelező!";
            else if (guest.phone.trim().length < 4) errors.phone = "A telefonszám túl rövid!";

            if (!guest.address.trim()) errors.address = "A lakcím megadása kötelező!";
            else if (guest.address.trim().length < 4) errors.address = "A lakcím túl rövid";

            if (!guest.drivingLicence.trim()) errors.drivingLicence = "A jogosítvány száma kötelező!";
            else if (guest.drivingLicence.trim().length < 4) errors.drivingLicence = "Érvénytelen jogosítványszám!";
        }

        return errors;
    };

    const handleGuestField = (key) => (e) => {
        setGuest((prev) => ({ ...prev, [key]: e.target.value }));
        if (validationErrors[key]) {
            setValidationErrors(prev => {
                const { [key]: removed, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleConfirm = async () => {
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
            const dates = {
                carId: car.id,
                plannedStart: start.format('YYYY-MM-DD'),
                plannedEnd: end.format('YYYY-MM-DD'),
            };

            const rental = isAuthenticated
                ? await postData(endpoints.rentals, dates)
                : await postData(endpoints.rentalsGuest, {
                    ...dates,
                    name: guest.name.trim(),
                    email: guest.email.trim(),
                    phone: guest.phone.trim(),
                    address: guest.address.trim(),
                    drivingLicence: guest.drivingLicence.trim(),
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon color="primary" />
                    <TitleComponent title="Új autó fogalása" marginY={0} />
                </Box>
                <IconButton onClick={onClose} size="small" disabled={submitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 1 }}>
                    <TextField
                        label="Átvétel dátuma"
                        type="date"
                        fullWidth
                        value={start ? start.format('YYYY-MM-DD') : ""}
                        onChange={(e) => {
                            setStart(e.target.value ? dayjs(e.target.value) : null);
                            setValidationErrors(p => ({ ...p, start: null }));
                        }}
                        error={!!validationErrors.start}
                        helperText={validationErrors.start}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: dayjs().format('YYYY-MM-DD') },
                        }}
                    />
                    <TextField
                        label="Visszaadás dátuma"
                        fullWidth
                        type="date"
                        value={end ? end.format('YYYY-MM-DD') : ""}
                        onChange={(e) => {
                            setEnd(e.target.value ? dayjs(e.target.value) : null);
                            setValidationErrors(p => ({ ...p, end: null }));
                        }}
                        error={!!validationErrors.end}
                        helperText={validationErrors.end}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: start ? start.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD') },
                        }}
                    />
                </Box>

                <FormDivider text="Összegzés" />


                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography>Márka, típus:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{car.brand} {car.model}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography>Rendszám:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{car.regNum}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography>Időtartam:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{days} nap</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography>Összesen:</Typography>
                    <Typography color="primary" sx={{ fontWeight: 600 }}>
                        {totalCost.toLocaleString("hu-HU")} Ft
                    </Typography>
                </Box>
                {!isAuthenticated && (
                    <>

                        <Alert severity="info" sx={{ my: 1 }}>
                            Vendégként foglal — adatait csak ehhez a bérléshez tároljuk.
                            Már van fiókja? <RouterLink to="/login">Jelentkezzen be</RouterLink>.
                        </Alert>

                        <FormDivider  text=" Személyes adatok" />
                        <Stack spacing={2}>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 1 }}>

                                <TextField
                                    label="Teljes név"
                                    value={guest.name}
                                    onChange={handleGuestField("name")}
                                    error={!!validationErrors.name}
                                    helperText={validationErrors.name}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Jogosítvány száma"
                                    value={guest.drivingLicence}
                                    onChange={handleGuestField("drivingLicence")}
                                    error={!!validationErrors.drivingLicence}
                                    helperText={validationErrors.drivingLicence}
                                    required
                                    fullWidth
                                /> </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 1 }}>

                                <TextField
                                    label="Email cím"
                                    type="email"
                                    value={guest.email}
                                    onChange={handleGuestField("email")}
                                    error={!!validationErrors.email}
                                    helperText={validationErrors.email}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Telefonszám"
                                    value={guest.phone}
                                    onChange={handleGuestField("phone")}
                                    error={!!validationErrors.phone}
                                    helperText={validationErrors.phone}
                                    placeholder="+36 ..."
                                    required
                                    fullWidth
                                />
                            </Box>
                            <TextField
                                label="Lakcím"
                                value={guest.address}
                                onChange={handleGuestField("address")}
                                error={!!validationErrors.address}
                                helperText={validationErrors.address}
                                placeholder="Irányítószám, város, utca, házszám"
                                required
                                fullWidth
                                multiline
                                maxRows={3}
                            />

                        </Stack>
                    </>
                )}



                {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={submitting}
                    startIcon={<SaveIcon />}
                    sx={{ ml: 2 }}
                >
                    {submitting ? "Foglalás..." : "Mentés"}
                </Button>
                <Button variant="outlined" onClick={onClose} disabled={submitting} startIcon={<CancelIcon />} color="default">Mégse</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingDialog;