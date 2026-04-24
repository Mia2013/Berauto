import { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import dayjs from 'dayjs';

import { useCarRent } from '../provider/CarRentProvider';
import CarCard from '../components/CarCard';
import CarFilter from '../components/CarFilter';
import TitleComponent from '../components/TitleComponent';

const Cars = () => {
  const { cars, getCars } = useCarRent();
  const [startDate, setStartDate] = useState(dayjs().add(1, 'day'));
  const [endDate, setEndDate] = useState(dayjs().add(2, 'day'));

  useEffect(() => {
    getCars();
  }, []);

  const handleFilterByDate = () => {
    const query = {
      startDate: startDate.format('YYYY.MM.DD'),
      endDate: endDate.format('YYYY.MM.DD'),
    };
    getCars(query);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <TitleComponent title="Elérhető flottánk" />
      </Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3, }}>
          <CarFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            handleClick={handleFilterByDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9, }}>
          <Grid container spacing={3}>
            {cars.length > 0 ? (
              cars.filter(car=>car.isRentable === true).map((car) => (
                <Grid key={car.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <CarCard car={car} />
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Typography variant="h6" color="text.secondary">
                  Sajnos nincs elérhető autónk a megadott időszakra
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

      </Grid>
    </Container>
  );
}

export default Cars;