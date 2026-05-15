import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Typography, Box, Divider, Stack,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("hu-HU");
};

const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("hu-HU");
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <span>Bizonylat</span>
                    <Typography variant="caption" color="text.secondary">
                        {receipt.receiptNumber}
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="overline" color="text.secondary">Kibocsátó</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>Bérautó Kft.</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="overline" color="text.secondary">Vásárló</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{receipt.userName}</Typography>
                <Typography variant="body2" color="text.secondary">{receipt.userEmail}</Typography>
                {receipt.userAddress && (
                    <Typography variant="body2" color="text.secondary">{receipt.userAddress}</Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="overline" color="text.secondary">Bérelt autó</Typography>
                <Typography variant="body1">
                    <strong>{receipt.carBrand} {receipt.carModel}</strong> — {receipt.carRegNum}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="overline" color="text.secondary">Részletek</Typography>
                <Box sx={{ mt: 1 }}>
                    <Row label="Bizonylatszám" value={receipt.receiptNumber} />
                    <Row label="Bérlés azonosító" value={`#${receipt.rentalId}`} />
                    <Row label="Kibocsátva" value={formatDateTime(receipt.issuedAt)} />
                    <Row label="Bérlési időtartam" value={`${receipt.daysRented} nap`} />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                    <Typography variant="h6">Fizetendő összesen:</Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                        {receipt.amount?.toLocaleString("hu-HU")} Ft
                    </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                    Köszönjük, hogy minket választott!
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Bezárás</Button>
                <Button onClick={() => window.print()} variant="contained" startIcon={<PrintIcon />}>
                    Nyomtatás
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReceiptDialog;
