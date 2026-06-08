import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Button, TextField, InputAdornment, IconButton,
    Box, Typography, Paper, FormControl, OutlinedInput, InputLabel, Link as MuiLink
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';

import { postData, endpoints } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import TitleComponent from './TitleComponent';
import ValidationCaption from './ValidationCaption';
import CustomAlert from './CustomAlert';

const LoginForm = ({formElevation=3}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const { logIn } = useAuth();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);


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

    
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value;

        const validationErrors = {};
        if (!email) validationErrors.email = 'Az email cím megadása kötelező!';
        if (!password) validationErrors.password = 'A jelszó megadása kötelező!';
        
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        setAlert(null);
        
        postData(endpoints.login, { email, password })
        .then((data) => {
            logIn(data);
            setAlert({ severity: "success", message: "Sikeres bejelentkezés!" });
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
                px: 4,
                pt: 2,
                pb: 4,
                borderRadius: 4,
                mt: 3,
                maxWidth: 500,
                mx: 'auto',
                background: '#ffffff'
            }}
        >
             <TitleComponent title="Bejelentkezés" alignItems='flex-start' my={2} />

            <Box 
                component="form" 
                noValidate 
                onSubmit={handleLogin} 
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
                 <TextField
                    fullWidth
                    label="Email cím"
                    inputRef={emailRef}
                    variant="outlined"
                    type="email"
                    required
                    error={!!errors?.email}
                    helperText={errors?.email}
                    disabled={loading}
                />

                 <FormControl variant="outlined" fullWidth error={!!errors?.password}>
                    <InputLabel htmlFor="outlined-adornment-password">Jelszó *</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        inputRef={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        label="Jelszó *"
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
                     {errors?.password && <ValidationCaption message={errors.password} />}
                </FormControl>

                <Button
                    type="submit"
                    variant='contained'
                    startIcon={<Send />}
                    disabled={loading}
                    sx={{
                        py: 2,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        boxShadow: 4,
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                  Bejelentkezés
                </Button>

                 <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Még nincs fiókja?{" "}
                        <MuiLink
                            component={RouterLink}
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