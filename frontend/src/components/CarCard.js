import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, CardActionArea, Box } from '@mui/material';

const CarCard = ({ car }) => {
    const { brand, model, fuel, img, year, id } = car;

    return (
        <Card sx={{
            height: '100%',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease-in-out',
        }}>
            <CardActionArea component={Link} to={`/model/${id}`} sx={{ height: '100%' }}>
                <CardMedia
                    component="img"
                    sx={{
                        height: 220,
                        objectFit: 'cover',
                    }}
                    image={`${process.env.PUBLIC_URL}/cars/${img}`}
                    alt={brand}
                />
                <CardContent sx={{ p: 3 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.1rem',
                            color: 'primary.main',
                            fontWeight: 700,
                            display: 'block',
                            mb: 0.5
                        }}
                    >
                        {brand}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {model}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {year}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {fuel}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default CarCard;