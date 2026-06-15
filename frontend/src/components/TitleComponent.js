import React from 'react'
import { Typography, Box } from '@mui/material';

const TitleComponent = ({ title, marginY = 1, alignItems = 'center' }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: alignItems,
                flexDirection: "column",
                my: marginY,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 800,
                    letterSpacing: ".1rem",
                    color: "primary.main",
                    textTransform: "uppercase"
                }}
            >
                {title}
            </Typography>
        </Box>
    )
}

export default TitleComponent;