import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Divider } from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';

const CarCard = ({ car, onReserve, actions, disabled }) => {
    return (
        <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
            <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <DirectionsCarFilledIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {car.brand} {car.model}
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Rendszám: <strong>{car.regNum}</strong>
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocalGasStationIcon fontSize="small" />
                        <Typography variant="body2">{car.fuel}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SpeedIcon fontSize="small" />
                        <Typography variant="body2">{car.mileage.toLocaleString("hu-HU")} km</Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                    <Chip label={car.status} size="small" color="primary" variant="outlined" />
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {car.fee.toLocaleString("hu-HU")} Ft / nap
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
