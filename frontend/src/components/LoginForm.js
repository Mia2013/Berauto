import { useRef, useState } from 'react'
import { Button, Grid, TextField, InputAdornment, IconButton, Container, Box, Typography, FilledInput, InputLabel, FormControl } from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';

import { postData } from '../API/apiCalls';
import TitleComponent from './TitleComponent';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const formData = {
            email,
            password,
        }

        if (validateRegisterFormData(formData)) {
            postData("login", formData)
                .then((data) => {
                    setAlert({ message: `Sikeres bejelentkezés! `, severity: "success" })
                })
                .then(() => {
                    emailRef.current.value = "";
                    passwordRef.current.value = "";
                })
                .catch((e) => {
                    setAlert({ message: e.message || "Hiba történt!", severity: "error" })
                })
        }
    }

    const validateRegisterFormData = (formData) => {
        const { password, email } = formData;
        const validationErrors = {};

        if (!password) {
            validationErrors.password = 'A jelszó megadása kötelező!';
        }
        if (!email) {
            validationErrors.email = 'Az email cím megadása kötelező!';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return (
        <form>
            <Container maxWidth="sm">
                <Box sx={{ p: 3 }} >
                    <Grid  size={{ xs: 12}} sx={{ textAlign: "center" }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                my: 5,
                            }}
                        >

                            <TitleComponent title="Bejelentkezés" />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12}}  sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <TextField
                            label="Email cím"
                            inputRef={emailRef}
                            variant="filled"
                            required
                            error={!!errors?.email}
                            helperText={errors?.email}
                        />
                        <FormControl variant="filled">
                            <InputLabel htmlFor="filled-adornment-password">Jelszó *</InputLabel>
                            <FilledInput
                                required
                                id="filled-adornment-password"
                                inputRef={passwordRef}
                                type={showPassword ? 'text' : 'password'}
                                error={!!errors?.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <Typography variant='caption' sx={{ color: "#D3302F", ml: 2 }}>{errors?.password}</Typography>
                        </FormControl>



                        <Button variant='contained' startIcon={<Send />}
                            onClick={handleLogin}
                        >Bejelentkezés</Button>
                    </Grid>
                </Box>
            </Container>
        </form>
    )
}

export default RegisterForm;