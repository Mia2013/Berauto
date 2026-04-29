import { Box, Container, Typography, Divider, Grid, Button, Paper } from '@mui/material';
import LoginForm from "../components/LoginForm";
import { useAuth } from '../provider/AuthProvider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Home = () => {
  const { isAuthenticated, user, isUser } = useAuth();

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
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 4, mt: -8 }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2 }}>
              Prémium Autókölcsönzés
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3 }}>
              Útrakész szabadság, <br />
              <span style={{ color: 'primary.main' }}>bárhol, bármikor</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 300 }}>
              Válasszon prémium flottánkból, és élvezze a gondtalan autózás élményét.
              Regisztrált tagként exkluzív kedvezményekkel várjuk.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%', position: 'relative' }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: '800px',
                objectFit: 'cover',
                clipPath: { md: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' },
                display: { xs: 'none', md: 'block' }
              }}
              src={`${process.env.PUBLIC_URL}/bmw.jpg`} // Ide tegyél egy jó minőségű képet
              alt="Premium car"
            />
          </Grid>
        </Grid>
      </Paper>

      <Container maxWidth="lg" sx={{ mb: 5 }}>
        {!isAuthenticated ? (
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ px: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 2 }}>
                  <InfoOutlinedIcon />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Személyes fiók kezelése
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  A korábbi foglalásai kezeléséhez, a bérlési előzmények megtekintéséhez
                  vagy új autó kölcsönzéséhez, kérjük, jelentkezzen be.
                </Typography>
                <Divider sx={{ my: 3, width: '50px', borderBottomWidth: 3, bgcolor: 'primary.main' }} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <LoginForm />
            </Grid>
          </Grid>
        ) : (
          isUser && (
            <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Üdvözöljük újra, {user?.firstName}!
              </Typography>
              <Typography color="text.secondary">
                Készen áll a következő kalandra? Fedezze fel aktuális kínálatunkat!
              </Typography>
              <Button variant="contained" sx={{ mt: 3 }}>Böngészés</Button>
            </Paper>
          )
        )}
      </Container>
    </Box>
  );
};

export default Home;