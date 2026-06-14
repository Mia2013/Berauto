import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Alert, Button, Grid, TextField, InputAdornment, IconButton, Container, Box,
    Typography, FormControl, Link as MuiLink, Paper, Stack
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';

import { postData, endpoints } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import TitleComponent from './TitleComponent';
import FormDivider from './FormDivider'; // A Profil oldalon használt elválasztó

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={6} sx={{ overflow: 'hidden', borderRadius: 4 }}>
                <Grid container component="form" onSubmit={handleRegister}>
                    
                    {/* BAL OLDAL: Háttérkép stílus (Pont mint a profilnál) */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ position: 'relative' }}>
                        <Box
                            component="img"
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: { xs: 200, sm: 250, md: 650 },
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            src={`${process.env.PUBLIC_URL}/bmw.jpg`}
                            alt="Regisztráció háttér"
                        />
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
                            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 4, color: 'white'
                        }}>
                            <Typography variant="h3" fontWeight={900} sx={{ textTransform: 'uppercase', lineHeight: 1 }}>
                                Új <br /> Fiók
                            </Typography>
                        </Box>
                    </Grid>

                    {/* JOBB OLDAL: Űrlap mezők */}
                    <Grid size={{ xs: 12, md: 8 }} sx={{ p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                            <TitleComponent title="Regisztráció" marginY={0} />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Hozzon létre egy új fiókot a bérlési rendszer teljes körű használatához.
                        </Typography>

                        {alert && (
                            <Alert severity={alert.severity} sx={{ mb: 2, borderRadius: 2 }} onClose={() => setAlert(null)}>
                                {alert.message}
                            </Alert>
                        )}

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            
                            <FormDivider text="KÖTELEZŐ ADATOK" />

                            <TextField
                                label="Teljes név"
                                inputRef={nameRef}
                                required
                                fullWidth
                                error={!!errors?.name}
                                helperText={errors?.name}
                            />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                                <TextField
                                    label="Email cím"
                                    inputRef={emailRef}
                                    type="email"
                                    required
                                    fullWidth
                                    error={!!errors?.email}
                                    helperText={errors?.email}
                                />
                                
                                {/* Egységesített Standard TextField a Jelszónak ad some styling */}
                                <TextField
                                    label="Jelszó"
                                    id="register-password"
                                    inputRef={passwordRef}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    fullWidth
                                    error={!!errors?.password}
                                    helperText={errors?.password}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                />
                            </Box>

                            <FormDivider text="OPCIONÁLIS / KAPCSOLATTARTÁSI ADATOK" />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                                <TextField
                                    label="Telefonszám"
                                    inputRef={phoneRef}
                                    placeholder="+36 ..."
                                    fullWidth
                                />
                                <TextField
                                    label="Jogosítvány száma"
                                    inputRef={drivingLicenceRef}
                                    fullWidth
                                />
                            </Box>

                            <TextField
                                label="Lakcím"
                                inputRef={addressRef}
                                placeholder="Irányítószám, város, utca, házszám"
                                fullWidth
                                multiline
                                minRows={2}
                            />

                            <Button
                                type="submit"
                                variant='contained'
                                color='primary'
                                startIcon={<Send />}
                                disabled={submitting}
                                sx={{ py: 1.8, fontWeight: 'bold', borderRadius: 2, mt: 2 }}
                                fullWidth
                            >
                                {submitting ? "Regisztráció..." : "Fiók létrehozása"}
                            </Button>

                            <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                                Már van fiókja?{" "}
                                <MuiLink component={RouterLink} to="/login" sx={{ fontWeight: 'bold' }}>
                                    Jelentkezzen be itt
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Grid>

                </Grid>
            </Paper>
        </Container>
    );
};

export default RegisterForm;