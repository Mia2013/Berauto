import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Alert, Box, IconButton, Grid, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TitleComponent from './TitleComponent';
import FormDivider from './FormDivider'; 
import { postData, endpoints } from '../API/apiCalls';

const AdminAddUserDialog = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "", 
        phone: "", 
        address: "", 
        drivingLicence: "", 
        roleId: 2
    });
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setFormData({ 
                name: "", 
                email: "", 
                password: "", 
                confirmPassword: "", 
                phone: "", 
                address: "", 
                drivingLicence: "", 
                roleId: 2 
            });
            setError(null);
            setValidationErrors({});
        }
    }, [open]);

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
        
        if (!formData.password.trim()) {
            errors.password = "A jelszó megadása kötelező!";
        } else if (formData.password.length < 4) {
            errors.password = "A jelszónak legalább 4 karakterből kell állnia!";
        }

        if (!formData.confirmPassword.trim()) {
            errors.confirmPassword = "A jelszó megerősítése kötelező!";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "A két jelszó nem egyezik meg!";
        }

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
            await postData(endpoints.adminRegister, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || null,
                address: formData.address || null,
                drivingLicence: formData.drivingLicence || null,
                roleId: Number(formData.roleId)
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.message || "Nem sikerült létrehozni a felhasználói fiókot.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon color="primary" />
                    <TitleComponent title="Új munkatárs / admin regisztrációja" marginY={0} />
                </Box>
                <IconButton onClick={onClose} size="small" disabled={submitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                
                <Grid container spacing={3}>
                    
                    <Grid size={{ xs: 12 }}>
                        <FormDivider text="FELHASZNÁLÓ ALAPADATAI" />
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
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Jelszó"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!validationErrors.password}
                            helperText={validationErrors.password}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Jelszó újra"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!validationErrors.confirmPassword}
                            helperText={validationErrors.confirmPassword}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormDivider text="EGYÉB ADATOK" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Telefonszám"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+36 ..."
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
                        <FormDivider text="JOGOSULTSÁG BEÁLLÍTÁSA" />
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{mb: 2}}>
                        <TextField
                            label="Szerepkör / Jogosultsági szint"
                            name="roleId"
                            select
                            value={formData.roleId}
                            onChange={handleChange}
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
                    startIcon={<PersonAddIcon />}
                    sx={{ px: 3, fontWeight: 'bold', borderRadius: 1.5 }}
                >
                    {submitting ? "Létrehozás..." : "Fiók létrehozása"}
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
        </Dialog >
    );
};

export default AdminAddUserDialog;