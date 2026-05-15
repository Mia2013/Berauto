import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Alert, CircularProgress,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { getData, endpoints } from '../API/apiCalls';
import ReceiptDialog from '../components/ReceiptDialog';

const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("hu-HU");
};

const MyReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(endpoints.myReceipts);
            setReceipts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a bizonylatokat.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Bizonylataim
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Egy bizonylat akkor jön létre, amikor egy bérlést az adminisztrátor lezár.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : receipts.length === 0 ? (
                    <Alert severity="info">Még nincs egyetlen bizonylata sem.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bizonylatszám</TableCell>
                                    <TableCell>Kibocsátva</TableCell>
                                    <TableCell>Autó</TableCell>
                                    <TableCell>Napok</TableCell>
                                    <TableCell>Összeg</TableCell>
                                    <TableCell align="right" />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {receipts.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>
                                            <strong>{r.receiptNumber}</strong>
                                        </TableCell>
                                        <TableCell>{formatDate(r.issuedAt)}</TableCell>
                                        <TableCell>
                                            {r.carBrand} {r.carModel}
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {r.carRegNum}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{r.daysRented}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            {r.amount?.toLocaleString("hu-HU")} Ft
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                startIcon={<ReceiptLongIcon />}
                                                onClick={() => setSelected(r)}
                                            >
                                                Megtekintés
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            <ReceiptDialog
                open={!!selected}
                receipt={selected}
                onClose={() => setSelected(null)}
            />
        </Box>
    );
};

export default MyReceipts;
