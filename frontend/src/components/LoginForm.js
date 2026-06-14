import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Button, TextField, InputAdornment, IconButton,
    Box, Typography, Paper, FormControl, OutlinedInput, InputLabel, Link as MuiLink
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';

import { postData, endpoints } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import TitleComponent from './TitleComponent';
import CustomAlert from './CustomAlert';

const LoginForm = ({ formElevation = 0 }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const { logIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setFormData({ email: "", password: "" });
        setErrors({});
        setAlert(null);
    }, []);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (errors[name]) {
            setErrors(p => ({ ...p, [name]: null }));
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!formData.email.trim()) {
            validationErrors.email = 'Az email cím megadása kötelező!';
        }
        if (!formData.password) {
            validationErrors.password = 'A jelszó megadása kötelező!';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setAlert(null);

        postData(endpoints.login, { 
            email: formData.email.trim(), 
            password: formData.password 
        })
        .then((data) => {
            logIn(data);
            navigate("/");
        })
        .catch((err) => {
             setAlert({ severity: "error", message: err.message || "Sikertelen bejelentkezés." });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <Paper 
            elevation={formElevation}
            sx={{
                p: formElevation === 0 ? 0 : 4,
                borderRadius: 4,
                maxWidth: 450,
                width: '100%',
                mx: 'auto',
                background: 'transparent'
            }}
        >
            <TitleComponent title="Bejelentkezés" alignItems='flex-start' marginY={0} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Kérjük, adja meg hitelesítési adatait a fiókjába való belépéshez.
            </Typography>

            <Box 
                component="form" 
                noValidate 
                onSubmit={handleLogin} 
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
                <TextField
                    fullWidth
                    label="Email cím"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    type="email"
                    required
                    error={!!errors?.email}
                    helperText={errors?.email}
                    disabled={loading}
                />

                <FormControl variant="outlined" fullWidth error={!!errors?.password} required>
                    <InputLabel htmlFor="outlined-adornment-password">Jelszó</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        label="Jelszó"
                        disabled={loading}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors?.password && (
                        <Typography variant="caption" color="error.main" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.password}
                        </Typography>
                    )}
                </FormControl>

                <Button
                    type="submit"
                    variant='contained'
                    startIcon={<LoginIcon />}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' }
                    }}
                >
                    {loading ? "Kapcsolódás..." : "Belépés a fiókba"}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Még nincs fiókja?{" "}
                        <MuiLink
                            component={RouterLink}
                            to="/register"
                            underline="hover"
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                cursor: 'pointer'
                            }}
                        >
                            Regisztráljon itt!
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>

            {alert && (
                <CustomAlert alert={alert} setAlert={setAlert} />
            )}
        </Paper>
    );
};

export default LoginForm;