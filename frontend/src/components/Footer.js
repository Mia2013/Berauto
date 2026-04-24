import { useState } from 'react';
import { Box, Container, Typography, Button, Dialog, DialogContent, DialogTitle, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginForm from './LoginForm';
import TitleComponent from './TitleComponent';
import LoginDialog from './LoginDialog';

const Footer = () => {
    const [openStaffLogin, setOpenStaffLogin] = useState(false);

    return (
        <Box component="footer" sx={{ bgcolor: 'text.primary', color: 'white', py: 2 }}>
            <Container maxWidth="xl">
                <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "flex-end", opacity: 0.8 }}>

                    <Typography variant="body2">
                        © 2024 Bérautó Kft. Minden jog fenntartva.
                    </Typography>

                    <Button
                        startIcon={<AdminPanelSettingsIcon />}
                        onClick={() => setOpenStaffLogin(true)}
                        size='small'
                     >
                        Dolgozói belépés
                    </Button>
                </Box>
            </Container>

            <LoginDialog openStaffLogin={openStaffLogin} setOpenStaffLogin={setOpenStaffLogin} />
        </Box>
    );
};

export default Footer;