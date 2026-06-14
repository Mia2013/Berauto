import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Typography, Box, Divider, Stack, IconButton, Grid
} from '@mui/material';
import dayjs from 'dayjs'; 
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TitleComponent from './TitleComponent';

 const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = dayjs(iso);
    return d.isValid() ? d.format("YYYY.MM.DD. HH:mm") : "—";
};

const Row = ({ label, value, bold }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400 }}>{value}</Typography>
    </Box>
);

const ReceiptDialog = ({ open, receipt, onClose }) => {
    if (!receipt) return null;

    return (
        <div>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="primary" />
                        <TitleComponent title={`Bizonylat megtekintése`} marginY={0} />
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: "column", gap: 1.5 }}>
                    
                    <Grid container spacing={3}>
                         <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>Kibocsátó</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Bérautó Kft.</Typography>
                            <Typography variant="body2" color="text.secondary">Központi Telephely</Typography>
                        </Grid>

                         <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>Vásárló</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>{receipt.userName}</Typography>
                            <Typography variant="body2" color="text.secondary">{receipt.userEmail}</Typography>
                            {receipt.userAddress && (
                                <Typography variant="body2" color="text.secondary">{receipt.userAddress}</Typography>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                     <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>Bérelt autó</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>{receipt.carBrand} {receipt.carModel}</strong> — {receipt.carRegNum}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 1 }}>Tranzakció Részletei</Typography>
                        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                            <Row label="Bizonylatszám" value={receipt.receiptNumber} bold />
                            <Row label="Bérlés azonosító" value={`#${receipt.rentalId}`} />
                            <Row label="Kibocsátás ideje" value={formatDateTime(receipt.issuedAt)} />
                            <Row label="Bérlési időtartam" value={`${receipt.daysRented} nap`} />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Fizetendő összesen:</Typography>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                            {receipt.amount?.toLocaleString("hu-HU")} Ft
                        </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, textAlign: "center", fontStyle: 'italic' }}>
                        Köszönjük, hogy a Bérautó szolgáltatásait választotta!
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button 
                        onClick={() => window.print()} 
                        variant="contained" 
                        color="primary"
                        startIcon={<PrintIcon />}
                    >
                        Nyomtatás
                    </Button>
                    <Button 
                        onClick={onClose} 
                        startIcon={<CancelIcon />} 
                        color='default' 
                        variant="outlined"
                    >
                        Bezárás
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ReceiptDialog;