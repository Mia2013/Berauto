import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Alert, CircularProgress,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import dayjs from 'dayjs';
import { getData, endpoints } from '../API/apiCalls';
import ReceiptDialog from '../components/ReceiptDialog';
import TitleComponent from '../components/TitleComponent';

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

                <TitleComponent title="Bizonylataim" />

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
                    Itt tekintheti meg és töltheti le a korábbi, sikeresen lezárt autóbérlései után kiállított hivatalos bizonylatokat.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : receipts.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>Még nem rendelkezik lezárt bérléssel, így bizonylat sem érhető el.</Alert>
                ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Bizonylatszám</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Kibocsátva</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Autó</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Napok</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Összeg</TableCell>
                                    <TableCell align="right" />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {receipts.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell>
                                            <strong>{r.receiptNumber || `#${r.id}`}</strong>
                                        </TableCell>
                                        <TableCell>
                                            {r.issuedAt ? dayjs(r.issuedAt).format('YYYY.MM.DD.') : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {r.carBrand} {r.carModel}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="primary.main" sx={{ fontWeight: 700 }}>
                                                {r.carRegNum}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{r.daysRented} nap</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            {r.amount?.toLocaleString("hu-HU")} Ft
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<ReceiptLongIcon />}
                                                onClick={() => setSelected(r)}
                                                sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
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