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
            <Grid container spacing={3} Í >
                {cars.map((car) => (
                    <Grid item key={car.id} xs={12} sm={6} md={4} >
                        <CarCard
                            brand={car.brand}
                            modell={car.modell}
                            fuel={car.fuel}
                            registrationName={car.registrationName}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default Cars;