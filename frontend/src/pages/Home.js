import { Box, Container, Typography, Divider } from '@mui/material';
import LoginForm from "../components/LoginForm";
import { useAuth } from '../provider/AuthProvider';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box sx={{
      mt: { xs: 4, md: 8 },
      mb: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <DirectionsCarFilledIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            Útrakész szabadság, bárhol, bármikor
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3, fontWeight: '400', maxWidth: '700px', mx: 'auto' }}
          >
            Válasszon prémium flottánkból, és élvezze a gondtalan autózás élményét.
            Regisztrált tagként exkluzív kedvezményekkel és villámgyors foglalással várjuk.
          </Typography>

          <Divider sx={{ width: '100px', mx: 'auto', borderBottomWidth: 3, bgcolor: 'primary.main' }} />
        </Box>
      </Container>

      <Box>
        {!isAuthenticated ? (
          (
            <>
              <Box sx={{
                maxWidth: 500,
                mx: 'auto',
                mb: -2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'info.main' }}>
                  <InfoOutlinedIcon fontSize="small" />
                  <Typography variant="button" sx={{ fontWeight: "bolder" }}>
                    Személyes fiók
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  A korábbi foglalásai kezeléséhez, a bérlési előzmények megtekintéséhez vagy új autó kölcsönzéséhez, kérjük, jelentkezzen be.
                </Typography>
              </Box>
              <LoginForm />

            </>
          )
        ) : (
          <Typography variant="h5" textAlign="center">
            Üdvözöljük újra {user?.firstName} {user?.lastName}! Jó utat kívánunk!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;