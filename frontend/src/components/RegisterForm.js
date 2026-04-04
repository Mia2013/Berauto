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

  const userNameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = userNameRef.current.value;
    const password = passwordRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;

    const formData = {
      username,
      password,
      email,
      phone
    }

    if (validateRegisterFormData(formData)) {
      postData("register", formData)
        .then((data) => {
          setAlert({ message: `${username} felhasználó sikeresen hozzáadva! `, severity: "success" })


        })
        .then(() => {
          userNameRef.current.value = "";
          passwordRef.current.value = "";
          emailRef.current.value = "";
          phoneRef.current.value = "";
        })
        .catch((e) => {
          setAlert({ message: e.message || "Hiba történt!", severity: "error" })
        })
    }
  }

  const validateRegisterFormData = (formData) => {
    const { username, password, email, phone } = formData;
    const validationErrors = {};
    if (!username) {
      validationErrors.username = 'A felhasználónév megadása kötelező!';
    }
    if (!password) {
      validationErrors.password = 'A jelszó megadása kötelező!';
    }
    if (!email) {
      validationErrors.email = 'Az email cím megadása kötelező!';
    }
    if (!phone) {
      validationErrors.phone = 'A telefonszám megadása kötelező!';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <form>
      <Container maxWidth="sm">
        <Box sx={{ p: 3 }} >
          <Grid container >
            <Grid size={12} >
              <TitleComponent title="Regisztráció" />
            </Grid>
            <Grid size={12} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <TextField
                label="Felhasználónév"
                inputRef={userNameRef}
                variant="filled"
                required
                error={!!errors?.username}
                helperText={errors?.username}
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
              <TextField
                label="Email cím"
                inputRef={emailRef}
                variant="filled"
                required
                error={!!errors?.email}
                helperText={errors?.email}
              />

              <TextField
                label="Telefonszám"
                inputRef={phoneRef}
                variant="filled"
                required
                error={!!errors?.phone}
                helperText={errors?.phone}
              />

              <Button variant='contained' startIcon={<Send />}
                onClick={handleRegister}
              >Küldés</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </form>
  )
}

export default RegisterForm;