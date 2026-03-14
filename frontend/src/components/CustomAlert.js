import { Alert, Snackbar } from '@mui/material';
import React from 'react';

const CustomAlert = ({ alert, setAlert }) => {
    const handleClose = () => setAlert(false);

    return (
        <Snackbar open={!!alert.message} autoHideDuration={3000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={alert.severity}
                variant="filled"
            >
                {alert.message}
            </Alert>
        </Snackbar>)
}

export default CustomAlert;