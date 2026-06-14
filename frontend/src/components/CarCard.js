import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Button, Chip, Box, Divider } from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import { FUEL_FILTERS } from '../constants/constants';

const CarCard = ({ car, onReserve, actions, disabled }) => {
    const { brand, model, fuel, imgUrl, regNum, mileage, fee, status } = car;

    const fuelObj = FUEL_FILTERS.find(f => f.key?.toLowerCase() === fuel?.toLowerCase());
    const translatedFuel = fuelObj ? fuelObj.label : fuel;

    return (
        <Card 
            elevation={0} 
            sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column", 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'getTop 4px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="170"
                    image={imgUrl}
                    alt={`${regNum}`}
                    sx={{ objectFit: "cover" }}
                />
                {/* Kis dizájnos rendszámtábla-jellegű Chip a képen elhelyezve */}
                <Chip 
                    label={regNum} 
                    size="small" 
                    sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12, 
                        bgcolor: 'background.paper', 
                        fontWeight: 800,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }} 
                />
            </Box>

            <CardContent sx={{ flex: 1, p: 2.5, pb: 1 }}>
                <Typography
                    variant="caption"
                    sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.08rem',
                        color: 'primary.main',
                        fontWeight: 800,
                        display: 'block',
                        mb: 0.5
                    }}
                >
                    {brand}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
                    {model}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: 'text.secondary' }}>
                        <LocalGasStationIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{translatedFuel}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: 'text.secondary' }}>
                        <SpeedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{mileage.toLocaleString("hu-HU")} km</Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 800, fontSize: '1.15rem' }}>
                        {fee.toLocaleString("hu-HU")} Ft <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'gray' }}>/ nap</span>
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, mt: 'auto' }}>
                {actions ?? (
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={disabled}
                        onClick={() => onReserve?.(car)}
                        sx={{ borderRadius: 2, py: 1, fontWeight: 'bold', textTransform: 'none', boxShadow: 'none' }}
                    >
                        Foglalás indítása
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default CarCard;