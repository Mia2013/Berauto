import React from 'react'
import { Typography, Box } from '@mui/material';

const TitleComponent = ({ title }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                my: 5,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 800,
                    letterSpacing: ".1rem",
                    color: "primary.main",
                    textDecoration: "none",
                    textTransform: "uppercase"
                }}
            >
                {title}
            </Typography>
        </Box>
    )
}

export default TitleComponent;