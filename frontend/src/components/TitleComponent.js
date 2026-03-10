import React from 'react'
import { Typography } from '@mui/material';

const TitleComponent = ({ title }) => {
    return (
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
    )
}

export default TitleComponent;