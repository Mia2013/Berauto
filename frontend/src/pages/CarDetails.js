import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Grid, Typography, Box, Button, Paper, Divider, Chip } from '@mui/material';

import { useCarRent } from '../provider/CarRentProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  const { carDetails, setCarDetails, cars } = useCarRent();

  useEffect(() => {
    if (carId && cars.length > 0) {
      // eslint-disable-next-line     
      const foundCarById = cars.find(q => q.id == carId);
      setCarDetails(foundCarById);
    }
  }, [carId]);

  return (
    <Container sx={{ py: 6 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 4 }}
        startIcon={<ArrowBackIcon />} > Vissza a kereséshez</Button>
      {
        !carDetails ? (
          <Typography variant="h6" sx={{ fontWeight: 800, textAlign: "center" }}>
            Az autó adatait jelenleg nem sikerült betölteni...
          </Typography>)
          :
          (<Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 4 }}>
            <Grid container>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: '100%' },
                    minHeight: { md: 450 },
                    objectFit: 'cover',
                  }}
                  src={`${process.env.PUBLIC_URL}/cars/${carDetails.img}`}
                  alt={carDetails.brand}
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                  <Chip label={carDetails.fuel} color="primary" variant="outlined" size="small" sx={{ mb: 1 }} />

                  <Typography
                    variant="h3"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.1rem',
                      color: 'primary.main',
                      fontWeight: 700,
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    {carDetails.brand}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {carDetails.modell}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2} sx={{ my: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon color="action" />
                        <Box>
                          <Typography variant="caption" display="block" color="text.secondary">Évjárat</Typography>
                          <Typography variant="body1" fontWeight="600">{carDetails.year}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalGasStationIcon color="action" />
                        <Box>
                          <Typography variant="caption" display="block" color="text.secondary">Üzemanyag</Typography>
                          <Typography variant="body1" fontWeight="600">{carDetails.fuel}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="action" />
                        <Box>
                          <Typography variant="caption" display="block" color="text.secondary">Rendszám</Typography>
                          <Typography variant="body1" fontWeight="600">{carDetails.registrationName}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      boxShadow: 4
                    }}
                    component={Link} to={`/rent/${carDetails.id}`}
                  >
                    Lefoglalom az autót
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>)}
    </Container>
  );
}

export default CarDetails;