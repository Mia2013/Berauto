import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Alert, Button, Grid, TextField, InputAdornment, IconButton,
    Container, Box, Typography, FilledInput, InputLabel, FormControl, Link as MuiLink,
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';

import { postData, endpoints } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import TitleComponent from './TitleComponent';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const { logIn } = useAuth();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value;

        const validationErrors = {};
        if (!email) validationErrors.email = 'Az email cím megadása kötelező!';
        if (!password) validationErrors.password = 'A jelszó megadása kötelező!';
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitting(true);
        setAlert(null);
        try {
            const data = await postData(endpoints.login, { email, password });
            logIn(data);
            setAlert({ severity: "success", message: "Sikeres bejelentkezés!" });
            navigate("/");
        } catch (err) {
            setAlert({ severity: "error", message: err.message || "Sikertelen bejelentkezés." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <Container maxWidth="sm">
                <Box sx={{ p: 3 }}>
                    <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", my: 5 }}>
                            <TitleComponent title="Bejelentkezés" />
                        </Box>
                    </Grid>

                    {alert && (
                        <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
                            {alert.message}
                        </Alert>
                    )}

                    <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <TextField
                            label="Email cím"
                            inputRef={emailRef}
                            variant="filled"
                            type="email"
                            required
                            error={!!errors?.email}
                            helperText={errors?.email}
                        />
                        <FormControl variant="filled">
                            <InputLabel htmlFor="login-password">Jelszó *</InputLabel>
                            <FilledInput
                                required
                                id="login-password"
                                inputRef={passwordRef}
                                type={showPassword ? 'text' : 'password'}
                                error={!!errors?.password}
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
                            <Typography variant='caption' sx={{ color: "#D3302F", ml: 2 }}>
                                {errors?.password}
                            </Typography>
                        </FormControl>

                        <Button
                            type="submit"
                            variant='contained'
                            startIcon={<Send />}
                            disabled={submitting}
                        >
                            {submitting ? "Bejelentkezés..." : "Bejelentkezés"}
                        </Button>

                        <Typography variant="body2" sx={{ textAlign: "center" }}>
                            Még nincs fiókja?{" "}
                            <MuiLink component={RouterLink} to="/register">Regisztráljon itt</MuiLink>
                        </Typography>
                    </Grid>
                </Box>
            </Container>
        </form>
    );
};

export default LoginForm;
