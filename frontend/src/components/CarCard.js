import * as React from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography } from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';



const CarCard = ({ registrationName, brand, modell, fuel }) => {
    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            width: '350px'
        }}>
            <CardMedia
                component="img"
                sx={{
                    height: 200,
                    objectFit: 'cover',
                }}
                image={`${process.env.PUBLIC_URL}/cars/${brand}${modell.split(' ').join('')}.jpg`}
                alt={brand}
            />
            <CardHeader
                title={`${brand} ${modell}`}
                subheader={registrationName}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Üzemanyag: {fuel}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default CarCard;