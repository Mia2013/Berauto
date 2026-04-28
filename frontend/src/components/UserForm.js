import { useRef, useState } from 'react';
import {
    Button, TextField, InputAdornment, IconButton,
    Box, Paper, FormControl, OutlinedInput, InputLabel,
    Grid, Typography, Container
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import LogoutBtn from "./LogoutBtn";

import { endpoints, postData } from '../API/apiCalls';
import { useAuth } from '../provider/AuthProvider';
import ValidationCaption from './ValidationCaption';
import CustomAlert from './CustomAlert';
import TitleComponent from './TitleComponent';
import FormDivider from './FormDivider';

const UserForm = ({IsRegisterForm }) => {
    const { user, isUser, isAuthenticated } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const userNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();
    const licenseRef = useRef();

    const UI = {
        formTitle: !IsRegisterForm ? "Profil szerkesztése" : "Regisztráció",
        submitBtn: !IsRegisterForm ? "Módosítások mentése" : "Fiók létrehozása",
        submitIcon: !IsRegisterForm ? <SaveIcon /> : <Send />,
        imgTitle: !IsRegisterForm ? <>Saját <br /> Profil</> : <>Készen állsz <br /> az útra?</>,
        imgSubTitle: !IsRegisterForm ? "Tartsa naprakészen adatait a bérléshez" : "Regisztrálj és foglald le álmaid autóját percek alatt",
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const validateForm = (data) => {
        const errors = {};

        if (!data.email.trim()) errors.email = 'Email cím kötelező!';
        if (!data.lastName.trim()) errors.lastName = 'Vezetéknév kötelező!';
        if (!data.firstName.trim()) errors.firstName = 'Keresztnév kötelező!';

        if (!isAuthenticated) {
            if (!data.username.trim()) errors.username = 'Felhasználónév kötelező!';
            if (!data.password.trim()) errors.password = 'Jelszó megadása kötelező!';
        }

        if (data.password && data.password !== data.confirmPassword) {
            errors.confirmPassword = 'A jelszavak nem egyeznek!';
        }

        return errors;
    };

    const handleRegister = (formData) => {
        postData(endpoints.register, formData)
            .then(() => {
                setAlert({ message: "Sikeres regisztráció!", severity: "success" });
                setValidationErrors({});
            })
            .catch(err => setAlert({ message: err.message || "Hiba a regisztráció során!", severity: "error" }));
    };

    const handleUpdate = (formData) => {
        const updateData = { ...formData, id: user.id, username: user.username };

        postData(endpoints.updateProfile, updateData)
            .then(() => {
                setAlert({ message: "Profil sikeresen frissítve!", severity: "success" });
                setValidationErrors({});
            })
            .catch(err => setAlert({ message: err.message || "Hiba a frissítés során!", severity: "error" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            username: isAuthenticated ?  user.userName : userNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirmPassword: confirmPasswordRef.current.value,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            phone: phoneRef.current.value,
            address: addressRef.current.value,
            drivingLicence: licenseRef.current.value
        };

        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        if (isUser) {
            handleUpdate(formData);
        } else {
            handleRegister(formData);
        }
    };


    return (
        <Container>
            <Paper elevation={6} sx={{ overflow: 'hidden', borderRadius: 4 }}>
                <Grid container>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ position: 'relative' }}>
                        <Box
                            component="img"
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: { xs: 300, sm: 400, md: 600 },
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            src={`${process.env.PUBLIC_URL}/bmw.jpg`}
                        />
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
                            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 4, color: 'white'
                        }}>
                            <Typography variant="h3" fontWeight={900} sx={{ textTransform: 'uppercase', lineHeight: 1 }}>
                                {UI.imgTitle}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2, opacity: 0.8, fontWeight: 300 }}>
                                {UI.imgSubTitle}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }} sx={{ p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <TitleComponent title={UI.formTitle} />
                            <LogoutBtn />
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                                <TextField
                                    fullWidth label="Felhasználónév"
                                    inputRef={userNameRef}
                                    defaultValue={isUser ? user?.username : ''}
                                    disabled={isAuthenticated}
                                    error={!!validationErrors.username}
                                    helperText={isAuthenticated ? "A felhasználónév nem módosítható" : validationErrors.username}
                                />
                                <TextField
                                    fullWidth label="Email cím"
                                    type="email"
                                    inputRef={emailRef}
                                    defaultValue={isUser ? user?.email : ''}
                                    error={!!validationErrors.email}
                                    helperText={validationErrors.email}
                                />
                            </Box>

                            <FormDivider text={isUser ? "JELSZÓ MÓDOSÍTÁSA (OPCIONÁLIS)" : "JELSZÓ ADATOK"} />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                                <FormControl variant="outlined" fullWidth error={!!validationErrors.password}>
                                    <InputLabel> {isUser ? "Új jelszó" : "Jelszó*"}</InputLabel>
                                    <OutlinedInput
                                        inputRef={passwordRef}
                                        type={showPassword ? 'text' : 'password'}
                                        label={isUser ? "Új jelszó" : "Jelszó*"}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {validationErrors.password && <ValidationCaption message={validationErrors.password} />}
                                </FormControl>

                                <FormControl variant="outlined" fullWidth error={!!validationErrors.confirmPassword}>
                                    <InputLabel> {isUser ? "Új jelszó újra" : "Jelszó újra*"}</InputLabel>
                                    <OutlinedInput
                                        inputRef={confirmPasswordRef}
                                        type={showPassword ? 'text' : 'password'}
                                        label={isUser ? "Új jelszó újra" : "Jelszó újra*"}
                                    />
                                    {validationErrors.confirmPassword && <ValidationCaption message={validationErrors.confirmPassword} />}
                                </FormControl>
                            </Box>

                            <FormDivider text="SZEMÉLYES ADATOK" />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                                <TextField fullWidth label="Vezetéknév" inputRef={lastNameRef} defaultValue={isUser ? user?.lastName : ''} error={!!validationErrors.lastName} helperText={validationErrors.lastName} />
                                <TextField fullWidth label="Keresztnév" inputRef={firstNameRef} defaultValue={isUser ? user?.firstName : ''} error={!!validationErrors.firstName} helperText={validationErrors.firstName} />
                            </Box>

                            <TextField fullWidth label="Lakcím" inputRef={addressRef} defaultValue={isUser ? user?.address : ''} variant="outlined" />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                                <TextField fullWidth label="Telefonszám" defaultValue={isUser ? user?.phone : ''} inputRef={phoneRef} />
                                <TextField fullWidth label="Jogosítvány száma" defaultValue={isUser ? user?.drivingLicence : ''} inputRef={licenseRef} />
                            </Box>

                            <Button
                                type="submit"
                                variant='contained'
                                startIcon={UI.submitIcon}
                                sx={{ py: 2, fontWeight: 'bold', borderRadius: 2, mt: 2 }}
                            >
                                {UI.submitBtn}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {alert && <CustomAlert alert={alert} setAlert={setAlert} />}
        </Container>
    );
};

export default UserForm;