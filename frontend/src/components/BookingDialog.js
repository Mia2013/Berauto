import React, { useState, useEffect, useMemo } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Typography, Box, Alert, Divider, Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { postData, endpoints } from "../API/apiCalls";
import { useAuth } from "../provider/AuthProvider";

const todayIso = () => new Date().toISOString().split("T")[0];
const tomorrowIso = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
};

// Same shape as the registration form so guests submit equivalent personal data.
const EMPTY_GUEST = {
    name: "",
    email: "",
    phone: "",
    address: "",
    drivingLicence: "",
};

const BookingDialog = ({ open, car, onClose, onSuccess, initialStart, initialEnd }) => {
    const { isAuthenticated } = useAuth();

    const [start, setStart] = useState(initialStart || todayIso());
    const [end, setEnd] = useState(initialEnd || tomorrowIso());
    const [guest, setGuest] = useState(EMPTY_GUEST);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Re-seed everything whenever the dialog opens.
    useEffect(() => {
        if (open) {
            setStart(initialStart || todayIso());
            setEnd(initialEnd || tomorrowIso());
            setGuest(EMPTY_GUEST);
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

    // Guest fields validation — only enforced for unauthenticated bookings.
    const guestValid = useMemo(() => {
        if (isAuthenticated) return true;
        const emailOk = /^\S+@\S+\.\S+$/.test(guest.email);
        return (
            guest.name.trim().length >= 2 &&
            emailOk &&
            guest.phone.trim().length >= 4 &&
            guest.address.trim().length >= 4 &&
            guest.drivingLicence.trim().length >= 4
        );
    }, [isAuthenticated, guest]);

    const handleGuestField = (key) => (e) =>
        setGuest((prev) => ({ ...prev, [key]: e.target.value }));

    const handleConfirm = async () => {
        if (!datesValid) {
            setError("A visszaadás dátumának későbbinek kell lennie, mint az átvételé.");
            return;
        }
        if (!isAuthenticated && !guestValid) {
            setError("Kérjük, töltse ki az összes személyes adatot a foglaláshoz.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const dates = {
                carId: car.id,
                plannedStart: new Date(start).toISOString(),
                plannedEnd: new Date(end).toISOString(),
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Foglalás: {car.brand} {car.model}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Rendszám: <strong>{car.regNum}</strong> · {car.fuel} · {car.fee.toLocaleString("hu-HU")} Ft / nap
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Dates section — same for everyone */}
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

                {/* Guest fields — only when not logged in */}
                {!isAuthenticated && (
                    <>
                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Személyes adatok
                            </Typography>
                        </Divider>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            Vendégként foglal — adatait csak ehhez a bérléshez tároljuk.
                            Már van fiókja? <RouterLink to="/login">Jelentkezzen be</RouterLink>.
                        </Alert>

                        <Stack spacing={2}>
                            <TextField
                                label="Teljes név"
                                value={guest.name}
                                onChange={handleGuestField("name")}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Email cím"
                                type="email"
                                value={guest.email}
                                onChange={handleGuestField("email")}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Telefonszám"
                                value={guest.phone}
                                onChange={handleGuestField("phone")}
                                placeholder="+36 ..."
                                required
                                fullWidth
                            />
                            <TextField
                                label="Lakcím"
                                value={guest.address}
                                onChange={handleGuestField("address")}
                                placeholder="Irányítószám, város, utca, házszám"
                                required
                                fullWidth
                                multiline
                                minRows={2}
                            />
                            <TextField
                                label="Jogosítvány száma"
                                value={guest.drivingLicence}
                                onChange={handleGuestField("drivingLicence")}
                                required
                                fullWidth
                            />
                        </Stack>
                    </>
                )}

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
                    disabled={submitting || !datesValid || (!isAuthenticated && !guestValid)}
                >
                    {submitting ? "Foglalás..." : "Megerősítés"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingDialog;
