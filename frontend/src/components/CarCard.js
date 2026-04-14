import * as React from 'react';
import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, CardActionArea, Box } from '@mui/material';

const CarCard = ({ car }) => {
    const { brand, modell, fuel, img, year, id } = car;

    return (
        <Card sx={{
            height: '100%',
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
                transform: 'scale(1.02)',
            }
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
                    <Box sx={{ mb: 1 }}>
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
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {modell}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
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