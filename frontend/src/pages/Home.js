import React from 'react';
import { Box, Container, Typography, Divider, Button, Stack, Paper, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoginForm from "../components/LoginForm";
import WelcomeUser from "../components/WelcomeUser";
import { useAuth } from '../provider/AuthProvider';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ mt: -3 }}>
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #fff 0%, #e5e9f0 100%)',
          borderRadius: 0,
          mb: 6
        }}
      >
        <Grid container spacing={0} sx={{ minHeight: '800px', alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 4, md: 8 }, mt: { xs: 0, md: -8 } }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: 'text.secondary' }}>
              Prémium Autókölcsönzés
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
              Útrakész szabadság, <br />
              <Box component="span" sx={{ color: 'primary.main' }}>bárhol, bármikor</Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 300 }}>
              Béreljen autót egyszerűen, akár egyetlen napra, akár hosszabb időszakra. 
              Válasszon prémium flottánkból, és élvezze a gondtalan autózás élményét.
            </Typography>
            
            {isAuthenticated && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/cars"
                  variant="contained"
                  size="large"
                  startIcon={<DirectionsCarFilledIcon />}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Autók böngészése
                </Button>
                <Button
                  component={RouterLink}
                  to="/my-rentals"
                  variant="outlined"
                  size="large"
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Bérléseim
                </Button>
              </Stack>
            )}
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: '800px', position: 'relative', display: { xs: 'none', md: 'block' } }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)',
              }}
              src={`${process.env.PUBLIC_URL}/bmw.jpg`}
              alt="Premium car"
            />
          </Grid>
        </Grid>
      </Paper>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {!isAuthenticated ? (
          <Grid container spacing={6} alignItems="center" justifyContent="space-between">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 2 }}>
                  <InfoOutlinedIcon />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Személyes fiók kezelése
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                  A korábbi foglalásai kezeléséhez, a bérlési előzmények megtekintéséhez
                  vagy új autó kölcsönzéséhez, kérjük, jelentkezzen be fiókjába.
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Amennyiben még nem regisztrált, az alábbi gombra kattintva létrehozhatja saját fiókját, amellyel elérhetővé válik a teljes gépjárműparkunk.
                </Typography>
                <Divider sx={{ my: 3, width: '60px', borderBottomWidth: 3, bgcolor: 'primary.main' }} />
                
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="text"
                  size="large"
                  startIcon={<PersonAddIcon />}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Fiók létrehozása (Regisztráció)
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 3, sm: 5 }, 
                  borderRadius: 4, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <LoginForm formElevation={0} />
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <WelcomeUser />
        )}
      </Container>
    </Box>
  );
};

export default Home;