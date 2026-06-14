import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Alert, Box, IconButton, Grid, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TitleComponent from './TitleComponent';
import FormDivider from './FormDivider';
import { putData, endpoints } from '../API/apiCalls';

const AdminEditUserDialog = ({ open, user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", address: "", drivingLicence: "", roleId: 3
    });
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                drivingLicence: user.drivingLicence || "",
                roleId: user.roleId ?? 3
            });
            setError(null);
            setValidationErrors({});
        }
    }, [open, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(p => ({ ...p, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "A név megadása kötelező!";
        if (!formData.email.trim()) errors.email = "Az email cím megadása kötelező!";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await putData(endpoints.userUpdateById(user.id), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                address: formData.address || null,
                drivingLicence: formData.drivingLicence || null,
                roleId: Number(formData.roleId)
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.message || "Nem sikerült frissíteni a felhasználó adatait.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditIcon color="primary" />
                    <TitleComponent title={`Felhasználó adatainak módosítása (ID: #${user.id})`} marginY={0} />
                </Box>
                <IconButton onClick={onClose} size="small" disabled={submitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                <Grid container spacing={3}>
                    
                    <Grid size={{ xs: 12 }}>
                        <FormDivider text="Személyes Alapadatok" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Teljes név"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!validationErrors.name}
                            helperText={validationErrors.name}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Email cím"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!validationErrors.email}
                            helperText={validationErrors.email}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormDivider text="Elérhetőségek és Okmányok" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Telefonszám"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Jogosítvány száma"
                            name="drivingLicence"
                            value={formData.drivingLicence}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Lakcím"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormDivider text="Rendszer Jogosultság" />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Szerepkör / Jogosultsági szint"
                            name="roleId"
                            select
                            value={formData.roleId}
                            onChange={handleChange}
                            disabled={user.roleId === 1} // Főadmin szerepköre védett
                            helperText={user.roleId === 1 ? "A főadminisztrátori szerepkör biztonsági okokból nem módosítható." : ""}
                            fullWidth
                            required
                        >
                            <MenuItem value={1}>Adminisztrátor</MenuItem>
                            <MenuItem value={2}>Ügyintéző</MenuItem>
                            <MenuItem value={3}>Ügyfél</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                {error && <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }}>{error}</Alert>}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting}
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ px: 3, fontWeight: 'bold', borderRadius: 1.5 }}
                >
                    {submitting ? "Mentés..." : "Módosítások mentése"}
                </Button>
                <Button
                    onClick={onClose}
                    disabled={submitting}
                    startIcon={<CancelIcon />}
                    color='default'
                    variant="outlined"
                    sx={{ px: 3, fontWeight: 'bold', borderRadius: 1.5 }}
                >
                    Mégse
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminEditUserDialog;