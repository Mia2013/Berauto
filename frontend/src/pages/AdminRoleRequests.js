import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Button, Alert, CircularProgress, Stack, Snackbar,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { getData, postData, endpoints } from '../API/apiCalls';
import { ROLE_LABEL_HU } from '../constants/constants';

const AdminRoleRequests = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const [toast, setToast] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(endpoints.roleRequests);
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a kérelmeket.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAction = async (user, kind) => {
        setBusyId(user.id);
        try {
            const url = kind === "approve"
                ? endpoints.approveRole(user.id)
                : endpoints.rejectRole(user.id);
            await postData(url);
            setToast({
                severity: "success",
                message: kind === "approve"
                    ? `${user.name} szerepköre jóváhagyva: ${ROLE_LABEL_HU[user.requestedRoleId]}.`
                    : `${user.name} kérelme elutasítva.`,
            });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A művelet nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Jogosultság kérelmek
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Új regisztrációkor a felhasználók igényelhetnek magasabb szerepkört.
                    Az itt látható kérelmeket Ön hagyhatja jóvá vagy utasíthatja el.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : users.length === 0 ? (
                    <Alert severity="info">Jelenleg nincs függőben lévő kérelem.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Név</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Jelenlegi</TableCell>
                                    <TableCell>Igényelt</TableCell>
                                    <TableCell align="right">Műveletek</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} hover>
                                        <TableCell>{u.id}</TableCell>
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <Chip label={u.role} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={ROLE_LABEL_HU[u.requestedRoleId] ?? u.requestedRole}
                                                size="small"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<CheckIcon />}
                                                    disabled={busyId === u.id}
                                                    onClick={() => handleAction(u, "approve")}
                                                >
                                                    Jóváhagyás
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<CloseIcon />}
                                                    disabled={busyId === u.id}
                                                    onClick={() => handleAction(u, "reject")}
                                                >
                                                    Elutasítás
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            <Snackbar
                open={!!toast}
                autoHideDuration={5000}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {toast && (
                    <Alert severity={toast.severity} onClose={() => setToast(null)}>
                        {toast.message}
                    </Alert>
                )}
            </Snackbar>
        </Box>
    );
};

export default AdminRoleRequests;
