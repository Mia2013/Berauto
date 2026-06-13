import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Button, Chip, Box, Divider } from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';

import { FUEL_FILTERS } from '../constants/constants';




const CarCard = ({ car, onReserve, actions, disabled }) => {
    const { brand, model, fuel, imgUrl,  regNum, mileage, fee, status } = car;

    const fuelObj = FUEL_FILTERS.find(f => f.key?.toLowerCase() === fuel?.toLowerCase());
    const translatedFuel = fuelObj ? fuelObj.label : fuel;

    return (
        <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>

            <CardMedia
                component="img"
                height="180"
                image={imgUrl}
                alt={`${regNum}`}
                sx={{ objectFit: "cover" }}

            />

            <CardContent sx={{ flex: 1 }}>
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

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Rendszám: <strong>{regNum}</strong>
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocalGasStationIcon fontSize="small" />
                        <Typography variant="body2">{translatedFuel}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SpeedIcon fontSize="small" />
                        <Typography variant="body2">{mileage.toLocaleString("hu-HU")} km</Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                    <Chip label={status} size="small" color="primary" variant="outlined" />
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {fee.toLocaleString("hu-HU")} Ft / nap
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                {actions ?? (
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={disabled}
                        onClick={() => onReserve?.(car)}
                    >
                        Foglalás
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default CarCard;
