import React, { useEffect, useState } from "react";
import {
    Box, Container, Paper, Typography, TextField, Button,
    Alert, CircularProgress, Grid, Stack
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { getData, putData, endpoints } from "../API/apiCalls";
import { useAuth } from "../provider/AuthProvider";
import CustomAlert from "../components/CustomAlert";
import TitleComponent from "../components/TitleComponent";
import FormDivider from "../components/FormDivider";

const EDITABLE_KEYS = ["phone", "address"];

const Profile = () => {
    const { updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ phone: "", address: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

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
        if (validationErrors[key]) {
            setValidationErrors(prev => {
                const { [key]: removed, ...rest } = prev;
                return rest;
            });
        }
    };

    const dirty = EDITABLE_KEYS.some((k) => (form[k] ?? "") !== (profile?.[k] ?? ""));

    const validateProfileForm = () => {
        const errors = {};
        if (!form.phone.trim()) {
            errors.phone = "A telefonszám megadása kötelező!";
        } else if (form.phone.trim().length < 4) {
            errors.phone = "A megadott telefonszám túl rövid!";
        }

        if (!form.address.trim()) {
            errors.address = "A lakcím megadása kötelező!";
        } else if (form.address.trim().length < 4) {
            errors.address = "Kérjük, pontosabb lakcímet adjon meg!";
        }

        return errors;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const errors = validateProfileForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError(null);
            return;
        }

        if (!dirty || saving) return;
        setSaving(true);
        setError(null);
        setValidationErrors({});

        try {
            const updated = await putData(endpoints.usersMe, {
                phone: form.phone.trim(),
                address: form.address.trim(),
            });

            const next = updated ?? { ...profile, ...form };
            setProfile(next);
            setForm({ phone: next.phone ?? "", address: next.address ?? "" });

            updateUser({ phone: next.phone, address: next.address });
            setToast({ severity: "success", message: "Profil sikeresen frissítve." });
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Nem sikerült menteni a profilt.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            phone: profile?.phone ?? "",
            address: profile?.address ?? "",
        });
        setValidationErrors({});
        setError(null);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={6} sx={{ overflow: 'hidden', borderRadius: 4 }}>
                <Grid container>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ position: 'relative' }}>
                        <Box
                            component="img"
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: { xs: 250, sm: 350, md: 600 },
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            src={`${process.env.PUBLIC_URL}/bmw.jpg`}
                            alt="Profil háttér"
                        />
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
                            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 4, color: 'white'
                        }}>
                            <Typography variant="h3" fontWeight={900} sx={{ textTransform: 'uppercase', lineHeight: 1 }}>
                                Saját <br /> Profil
                            </Typography>

                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }} sx={{ p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <TitleComponent title="Profilom" marginY={0} />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Itt ellenőrizheti személyes adatait, valamint naprakészen tarthatja a kapcsolattartási címeit.
                        </Typography>

                        <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                            <FormDivider text="SZEMÉLYAZONOSÍTÓ ADATOK" />

                            <TextField
                                label="Teljes név"
                                value={profile?.name ?? ""}
                                slotProps={{ input: { readOnly: true } }}
                                disabled
                                fullWidth
                            />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                                <TextField
                                    label="Email cím"
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
                            </Box>

                            <FormDivider text="KAPCSOLATTARTÁSI ADATOK (MÓDOSÍTHATÓ)" />

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    label="Telefonszám"
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    placeholder="+36 ..."
                                    error={!!validationErrors.phone}
                                    helperText={validationErrors.phone}
                                    disabled={!isEditing}
                                    fullWidth
                                />
                                <TextField
                                    label="Lakcím"
                                    value={form.address}
                                    onChange={handleChange("address")}
                                    placeholder="Irányítószám, város, utca, házszám"
                                    error={!!validationErrors.address}
                                    helperText={validationErrors.address}
                                    disabled={!isEditing}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                />
                            </Box>

                            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

                            {!isEditing ? (
                                <Button
                                    variant='contained'
                                    color='primary'
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                    sx={{ py: 1.8, fontWeight: 'bold', borderRadius: 2, mt: 2 }}
                                    fullWidth
                                >
                                    Profil szerkesztése
                                </Button>
                            ) : (
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant='contained'
                                        color='primary'
                                        startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                                        disabled={!dirty || saving}
                                        sx={{ py: 1.8, fontWeight: 'bold', borderRadius: 2, flex: 1 }}
                                    >
                                        {saving ? "Mentés..." : "Módosítások mentése"}
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        color='default'
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancel}
                                        disabled={saving}
                                        sx={{ py: 1.8, fontWeight: 'bold', borderRadius: 2, flex: 1 }}
                                    >
                                        Mégse
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {toast && <CustomAlert alert={toast} setAlert={setToast} />}
        </Container>
    );
};

export default Profile;