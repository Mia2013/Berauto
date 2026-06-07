import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Button, Chip, Box, Divider } from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';

// Car pictures — imported so webpack bundles them and gives us hashed URLs.
import toyotaCorolla01 from '../pictures/Toyota Corolla01.jpg';
import toyotaCorolla02 from '../pictures/Toyota Corolla02.webp';
import volkswagenGolf from '../pictures/Volkswagen Golf.jpg';
import teslaModel3 from '../pictures/Tesla Model 3.jpg';
import hondaCivicHybrid from '../pictures/Honda Civic Hybrid.avif';
import fordFocus from '../pictures/Ford Focus.jpg';
import bmw320d from '../pictures/BMW 320d.jpg';
import opelAstraG from '../pictures/Opel Astra G.jpg';

// Picks the matching picture for a car based on brand + model.
// Returns null when no picture is available — the card will then omit the image area.
const pictureFor = (car) => {
    const key = `${car.brand ?? ""} ${car.model ?? ""}`.trim().toLowerCase();
    const reg = (car.regNum ?? "").toLowerCase();

    // Two Toyota Corollas in the data — differentiate by reg num.
    if (key === "toyota corolla") {
        return reg === "abc-001" ? toyotaCorolla02 : toyotaCorolla01;
    }

    const map = {
        "volkswagen golf": volkswagenGolf,
        "tesla model 3": teslaModel3,
        "honda civic hybrid": hondaCivicHybrid,
        "ford focus": fordFocus,
        "bmw 320d": bmw320d,
        "opel astra g": opelAstraG,
    };
    return map[key] ?? null;
};

const CarCard = ({ car, onReserve, actions, disabled }) => {
    const image = pictureFor(car);
    return (
        <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
            {image && (
                <CardMedia
                    component="img"
                    height="180"
                    image={image}
                    alt={`${car.brand} ${car.model}`}
                    sx={{ objectFit: "cover" }}
                />
            )}
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
