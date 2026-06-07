import React, { useEffect, useState } from "react";
import {
    Box, Container, Paper, Typography, TextField, Button, Stack,
    Alert, Snackbar, CircularProgress, Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { getData, putData, endpoints } from "../API/apiCalls";
import { useAuth } from "../provider/AuthProvider";

// Editable fields per the task spec: phone number and address.
const EDITABLE_KEYS = ["phone", "address"];

const Profile = () => {
    const { updateUser } = useAuth();
    const [profile, setProfile] = useState(null);   // full profile fetched from the API
    const [form, setForm] = useState({ phone: "", address: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    // Load the current user's profile on mount.
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const data = await getData(endpoints.usersMe);
                if (!alive) return;
                setProfile(data);
                setForm({
                    phone: data?.phone ?? "",
                    address: data?.address ?? "",
                });
            } catch (err) {
                if (alive) setError(err.message || "Nem sikerült betölteni a profilt.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    const handleChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    // Has anything actually changed compared to the loaded profile?
    const dirty = EDITABLE_KEYS.some((k) => (form[k] ?? "") !== (profile?.[k] ?? ""));

    const handleSave = async (e) => {
        e.preventDefault();
        if (!dirty || saving) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await putData(endpoints.usersMe, {
                phone: form.phone.trim(),
                address: form.address.trim(),
            });
            // Update local state with whatever the backend returned (or fall back to form values).
            const next = updated ?? { ...profile, ...form };
            setProfile(next);
            setForm({ phone: next.phone ?? "", address: next.address ?? "" });
            // Keep the cached user in AuthProvider in sync.
            updateUser({ phone: next.phone, address: next.address });
            setToast({ severity: "success", message: "Profil sikeresen frissítve." });
        } catch (err) {
            setError(err.message || "Nem sikerült menteni a profilt.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="sm">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Profilom
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Itt módosíthatja a telefonszámát és a címét. A többi adat csak megtekintésre szolgál.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Paper component="form" onSubmit={handleSave} elevation={1} sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Név"
                            value={profile?.name ?? ""}
                            slotProps={{ input: { readOnly: true } }}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            value={profile?.email ?? ""}
                            slotProps={{ input: { readOnly: true } }}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Jogosítvány száma"
                            value={profile?.drivingLicence ?? ""}
                            slotProps={{ input: { readOnly: true } }}
                            disabled
                            fullWidth
                        />

                        <Divider />

                        <TextField
                            label="Telefonszám"
                            value={form.phone}
                            onChange={handleChange("phone")}
                            placeholder="+36 ..."
                            fullWidth
                        />
                        <TextField
                            label="Lakcím"
                            value={form.address}
                            onChange={handleChange("address")}
                            placeholder="Irányítószám, város, utca, házszám"
                            fullWidth
                            multiline
                            minRows={2}
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />}
                                disabled={!dirty || saving}
                            >
                                Mentés
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Container>

            <Snackbar
                open={!!toast}
                autoHideDuration={4000}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {toast && (
                    <Alert severity={toast.severity} onClose={() => setToast(null)}>
                        {toast.message}
                    </Alert>
                )}
            </Snackbar>
        </Box>
    );
};

export default Profile;
