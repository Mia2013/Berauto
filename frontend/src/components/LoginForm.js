import { useRef, useState } from 'react';
import { Link } from "react-router-dom";

import {
    Button, TextField, InputAdornment, IconButton,
    Box, Typography, Paper, FormControl, OutlinedInput, InputLabel
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';
import { useAuth } from '../provider/AuthProvider';
import TitleComponent from './TitleComponent';
import ValidationCaption from './ValidationCaption';
import CustomAlert from './CustomAlert';

const LoginForm = () => {
    const { logIn } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = { email: emailRef.current.value, password: passwordRef.current.value };

        if (validateRegisterFormData(formData)) {
            await logIn(formData.email, formData.password);

        }
    };

    const validateRegisterFormData = (formData) => {
        const { password, email } = formData;
        const validationErrors = {};

        if (!email) {
            validationErrors.email = 'Az email cím megadása kötelező!';
        }
        if (!password) {
            validationErrors.password = 'A jelszó megadása kötelező!';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return (
        <Paper elevation={3}
            sx={{
                px: 3,
                pt: 1,
                pb: 3,
                borderRadius: 4,
                mt: 3,
                maxWidth: 500,
                mx: 'auto'
            }}>
            <TitleComponent title="Bejelentkezés" alignItems='flex-start' my={2} />

            <Box component="form" noValidate onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                    fullWidth
                    label="Email cím"
                    inputRef={emailRef}
                    variant="outlined"
                    required
                    error={!!errors?.email}
                    helperText={errors?.email}
                />

                <FormControl variant="outlined" fullWidth error={!!errors?.password}>
                    <InputLabel htmlFor="outlined-adornment-password">Jelszó *</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        inputRef={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        label="Jelszó *"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors?.password && <ValidationCaption message={errors.password} />}
                </FormControl>


                <Button
                    type="submit"
                    variant='contained'
                    startIcon={<Send />}
                    sx={{
                        py: 2,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        boxShadow: 4
                    }}
                >
                    Bejelentkezés
                </Button>

                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Ha még nincs felhasználói fiókja, akkor{' '}
                        <Link
                            to="/register"
                            underline="hover"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                cursor: 'pointer',
                                transition: '0.2s',
                                '&:hover': {
                                    color: 'primary.dark',
                                }
                            }}
                        >
                            regisztráljon!
                        </Link>
                    </Typography>
                </Box>            </Box>
            {alert && (
                <CustomAlert alert={alert} setAlert={setAlert} />
            )}
        </Paper>
    );
};

export default LoginForm;