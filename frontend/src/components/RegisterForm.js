import { useRef, useState } from 'react';
import {
  Button, TextField, InputAdornment, IconButton,
  Box, Paper, FormControl, OutlinedInput, InputLabel, Grid, Typography, Container
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';

import { endpoints, postData } from '../API/apiCalls';
import ValidationCaption from './ValidationCaption';
import CustomAlert from './CustomAlert';
import TitleComponent from './TitleComponent';

const RegisterForm = () => {
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = {
      username: userNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      phone: phoneRef.current.value,
      address: addressRef.current.value,
      drivingLicence: licenseRef.current.value
    };

    if (validateRegisterFormData(formData)) {
      postData(endpoints.register, formData)
        .then((data) => {
          setAlert({ message: `${formData.username} sikeresen regisztrálva!`, severity: "success" });
          e.target.reset();
          setValidationErrors({});
        })
        .catch((e) => {
          setAlert({ message: e?.message || "Hiba történt!", severity: "error" });
        });
    }
  };

  const validateRegisterFormData = (formData) => {
    const validationMessages = {};
    if (!formData.username) validationMessages.username = 'Kérem írja be a felhasználónevet!';
    if (!formData.email) validationMessages.email = 'Kérem írja be az email címet!';
    if (!formData.password) validationMessages.password = 'Kérem írja be a jelszót!';
    if (formData.password !== formData.confirmPassword) validationMessages.confirmPassword = 'A két jelszó nem egyezik!';
    if (!formData.lastName) validationMessages.lastName = 'Kérem írja be a vezetéknevét!';
    if (!formData.firstName) validationMessages.firstName = 'Kérem írja be a keresztnevét!';

    setValidationErrors(validationMessages);
    return Object.keys(validationMessages).length === 0;
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper
        elevation={6}
        sx={{
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 4 }} sx={{ position: 'relative' }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                minHeight: { xs: 300, md: 400 },
                objectFit: 'content',
                display: 'block'
              }}
              src={`${process.env.PUBLIC_URL}/bmw.jpg`}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 4,
                color: 'white'
              }}
            >
              <Typography variant="h3" fontWeight={900} sx={{ textTransform: 'uppercase', lineHeight: 1 }}>
                Készen állsz <br /> az útra?
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, opacity: 0.8, fontWeight: 300 }}>
                Regisztrálj és foglald le álmaid autóját percek alatt
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }} sx={{ p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TitleComponent title="Regisztráció" />

            <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <TextField fullWidth label="Felhasználónév"
                  inputRef={userNameRef} error={!!validationErrors.username} helperText={validationErrors.username} />
                <TextField fullWidth label="Email cím"
                  type="email" inputRef={emailRef} error={!!validationErrors.email} helperText={validationErrors.email} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <FormControl variant="outlined" fullWidth error={!!validationErrors.password}>
                  <InputLabel>Jelszó *</InputLabel>
                  <OutlinedInput
                    inputRef={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    label="Jelszó *"
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
                  <InputLabel>Jelszó megerősítése *</InputLabel>
                  <OutlinedInput
                    inputRef={confirmPasswordRef}
                    type={showPassword ? 'text' : 'password'}
                    label="Jelszó megerősítése *"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>}
                  />
                  {validationErrors.confirmPassword && <ValidationCaption message={validationErrors.confirmPassword} />}
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <TextField fullWidth label="Vezetéknév" inputRef={lastNameRef} error={!!validationErrors.lastName} helperText={validationErrors.lastName} />
                <TextField fullWidth label="Keresztnév" inputRef={firstNameRef} error={!!validationErrors.firstName} helperText={validationErrors.firstName} />
              </Box>

              <TextField fullWidth label="Lakcím" inputRef={addressRef} variant="outlined" />

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <TextField fullWidth label="Telefonszám" inputRef={phoneRef} />
                <TextField fullWidth label="Jogosítvány száma" inputRef={licenseRef} />
              </Box>

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
                Fiók létrehozása
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {alert && <CustomAlert alert={alert} setAlert={setAlert} />}
    </Container>
  );
}

export default RegisterForm;