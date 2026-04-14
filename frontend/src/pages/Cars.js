import { useEffect } from 'react'
import { Container, Grid } from '@mui/material';
import TitleComponent from '../components/TitleComponent';
import { useCarRent } from '../provider/CarRentProvider';
import CarCard from '../components/CarCard';

const Cars = () => {
    const { cars } = useCarRent();

    return (
        <Container sx={{ py: 4 }}>
            <TitleComponent title="Autók" />
            <Grid container spacing={3}  >
                {cars.map((car) => (
                    <Grid  key={car.id} size={{xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <CarCard
                            car={car}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default Cars;