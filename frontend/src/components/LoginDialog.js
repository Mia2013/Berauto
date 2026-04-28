import { useState } from 'react';
import { Box, Container, Typography, Button, Dialog, DialogContent, DialogTitle, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginForm from './LoginForm';
import TitleComponent from './TitleComponent';

const LoginDialog = ({openStaffLogin, setOpenStaffLogin}) => {
    return (
        <Dialog
            open={openStaffLogin}
            onClose={() => setOpenStaffLogin(false)}
            PaperProps={{ sx: { borderRadius: 4, bgcolor: 'transparent', boxShadow: 'none' } }}
        >
            <Box sx={{ position: 'relative' }}>
                <IconButton
                    onClick={() => setOpenStaffLogin(false)}
                    sx={{ position: 'absolute', right: 10, top: 25, zIndex: 1 }}
                >
                    <CloseIcon />
                </IconButton>
                <LoginForm />
            </Box>
        </Dialog>
    );
};

export default LoginDialog;