import { useRef, useState } from 'react';
import {
  Button, TextField, InputAdornment, IconButton,
  Box, Typography, Paper, FormControl, OutlinedInput, InputLabel
} from "@mui/material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Send from '@mui/icons-material/Send';

import { postData } from '../API/apiCalls';
import TitleComponent from './TitleComponent';
import ValidationCaption from './ValidationCaption';

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
      confirmPassword: confirmPasswordRef.current.value, // Kiszedjük az értéket
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      phone: phoneRef.current.value,
      address: addressRef.current.value,
      licenseNumber: licenseRef.current.value
    };

    if (validateRegisterFormData(formData)) {

      postData("register", formData)
        .then((data) => {
          setAlert({ message: `${formData.username} sikeresen regisztrálva!`, severity: "success" });
          e.target.reset();
          setValidationErrors({});
        })
        .catch((e) => {
          setAlert({ message: e.message || "Hiba történt!", severity: "error" });
        });
    }
  };

  const validateRegisterFormData = (formData) => {
    const validationMessages = {};
    if (!formData.username) {
      validationMessages.username = 'Kérem írja be a felhasználónevet!';
    }

    if (!formData.email) {
      validationMessages.email = 'Kérem írja be az email címet!';
    }

    if (!formData.password) {
      validationMessages.password = 'Kérem írja be a jelszót!';
    }
    if (!formData.confirmPassword) {
      validationMessages.confirmPassword = 'Kérem írja be a jelszót újra!';
    }

    if (formData.password !== formData.confirmPassword) {
      validationMessages.confirmPassword = 'A két jelszó nem egyezik!';
    }

    if (!formData.lastName) {
      validationMessages.lastName = 'Kérem írja be a vezetéknevét!';
    }
    if (!formData.firstName) {
      validationMessages.firstName = 'Kérem írja be a keresztnevét!';

    }

    setValidationErrors(validationMessages);
    return Object.keys(validationMessages).length === 0;
  };

  return (
    <Paper elevation={3} sx={{ px: 3, pt: 1, pb: 3, borderRadius: 4, mt: 3, maxWidth: 800, mx: 'auto' }}>
      <TitleComponent title="Regisztráció" />

      <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>

          <TextField
            fullWidth
            label="Felhasználónév"
            inputRef={userNameRef}
            variant="outlined"
            error={!!validationErrors.username}
            helperText={validationErrors.username}
          />

          <TextField
            fullWidth
            label="Email cím"
            type="email"
            inputRef={emailRef}
            variant="outlined"
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
        </Box>
        <FormControl variant="outlined" fullWidth error={!!validationErrors.password}>
          <InputLabel htmlFor="outlined-adornment-password">Jelszó *</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
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
            error={!!validationErrors.password}
            helperText={validationErrors.password}

          />
          {validationErrors.password && <ValidationCaption message={validationErrors.password} />}
        </FormControl>

        <FormControl variant="outlined" fullWidth error={!!validationErrors.confirmPassword}>
          <InputLabel htmlFor="outlined-confirm-password">Jelszó megerősítése *</InputLabel>
          <OutlinedInput
            id="outlined-confirm-password"
            inputRef={confirmPasswordRef}
            type={showPassword ? 'text' : 'password'}
            label="Jelszó megerősítése *"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {validationErrors.confirmPassword && <ValidationCaption message={validationErrors.confirmPassword} />}
        </FormControl>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <TextField
            fullWidth
            label="Vezetéknév"
            inputRef={lastNameRef}
            variant="outlined"
            error={!!validationErrors.lastName}
            helperText={validationErrors.lastName}
          />
          <TextField
            fullWidth
            label="Keresztnév"
            inputRef={firstNameRef}
            variant="outlined"
            error={!!validationErrors.firstName}
            helperText={validationErrors.firstName}
          />
        </Box>

        <TextField
          fullWidth
          label="Lakcím"
          inputRef={addressRef}
          variant="outlined"
        />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <TextField
            fullWidth
            label="Telefonszám"
            inputRef={phoneRef}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Jogosítvány száma"
            inputRef={licenseRef}
            variant="outlined"
          />
        </Box>

        {alert && (
          <Typography color={alert.severity === "success" ? "success.main" : "error.main"} textAlign="center">
            {alert.message}
          </Typography>
        )}

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
          Küldés
        </Button>
      </Box>
    </Paper>
  );
}

export default RegisterForm;