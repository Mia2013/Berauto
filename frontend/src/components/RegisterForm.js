import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Alert, Button, Grid, TextField, InputAdornment, IconButton, Container, Box,
    Typography, FilledInput, InputLabel, FormControl, Link as MuiLink,
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';

import { postData, endpoints } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import TitleComponent from './TitleComponent';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();
    const drivingLicenceRef = useRef();

    const { logIn } = useAuth();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleRegister = async (e) => {
        e.preventDefault();
        const name = nameRef.current.value.trim();
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value;
        const phone = phoneRef.current.value.trim();
        const address = addressRef.current?.value.trim() || null;
        const drivingLicence = drivingLicenceRef.current?.value.trim() || null;

        const validationErrors = {};
        if (!name) validationErrors.name = 'A név megadása kötelező!';
        if (!email) validationErrors.email = 'Az email cím megadása kötelező!';
        if (!password) validationErrors.password = 'A jelszó megadása kötelező!';
        else if (password.length < 6) validationErrors.password = 'A jelszónak legalább 6 karakter hosszúnak kell lennie!';
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitting(true);
        setAlert(null);
        try {
            const data = await postData(endpoints.register, {
                name,
                email,
                password,
                phone: phone || null,
                address,
                drivingLicence,
            });
            // Backend returns AuthResponse { token, user } — auto-login.
            logIn(data);
            setAlert({ severity: "success", message: `Sikeres regisztráció, ${name}!` });
            navigate("/");
        } catch (err) {
            setAlert({ severity: "error", message: err.message || "Sikertelen regisztráció." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <Container maxWidth="sm">
                <Box sx={{ p: 3 }}>
                    <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", my: 5 }}>
                            <TitleComponent title="Regisztráció" />
                        </Box>
                    </Grid>

                    {alert && (
                        <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
                            {alert.message}
                        </Alert>
                    )}

                    <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                            label="Név"
                            inputRef={nameRef}
                            variant="filled"
                            required
                            error={!!errors?.name}
                            helperText={errors?.name}
                        />
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
                            <InputLabel htmlFor="register-password">Jelszó *</InputLabel>
                            <FilledInput
                                required
                                id="register-password"
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
                        <TextField
                            label="Telefonszám"
                            inputRef={phoneRef}
                            variant="filled"
                        />
                        <TextField
                            label="Cím"
                            inputRef={addressRef}
                            variant="filled"
                        />
                        <TextField
                            label="Jogosítvány száma"
                            inputRef={drivingLicenceRef}
                            variant="filled"
                        />

                        <Button
                            type="submit"
                            variant='contained'
                            startIcon={<Send />}
                            disabled={submitting}
                        >
                            {submitting ? "Regisztráció..." : "Regisztráció"}
                        </Button>

                        <Typography variant="body2" sx={{ textAlign: "center" }}>
                            Már van fiókja?{" "}
                            <MuiLink component={RouterLink} to="/login">Jelentkezzen be itt</MuiLink>
                        </Typography>
                    </Grid>
                </Box>
            </Container>
        </form>
    );
};

export default RegisterForm;
