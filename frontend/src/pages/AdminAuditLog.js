import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Alert, CircularProgress, Stack,
    TextField, MenuItem, Button, TablePagination, IconButton, Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getData, endpoints } from '../API/apiCalls';

const ENTITY_TYPES = ["", "Car", "Rental", "User", "CarStatus", "RentalStatus", "Fuel", "Role", "AuditLog"];
const ACTIONS = ["", "Insert", "Update", "Delete"];

const formatTs = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("hu-HU");
};

const actionColor = (a) => {
    switch (a) {
        case "Insert": return "success";
        case "Update": return "warning";
        case "Delete": return "error";
        default: return "default";
    }
};

const ChangesCell = ({ json }) => {
    const [open, setOpen] = useState(false);
    let pretty = json;
    try { pretty = JSON.stringify(JSON.parse(json), null, 2); } catch { /* leave raw */ }
    const preview = json.length > 80 ? json.slice(0, 80) + "…" : json;
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small" onClick={() => setOpen((v) => !v)}>
                    {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{preview}</Typography>
            </Box>
            <Collapse in={open} unmountOnExit>
                <Box
                    component="pre"
                    sx={{
                        m: 0, mt: 1, p: 1.5, bgcolor: "grey.100",
                        borderRadius: 1, fontSize: "0.75rem",
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                    }}
                >
                    {pretty}
                </Box>
            </Collapse>
        </>
    );
};

const AdminAuditLog = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [entityType, setEntityType] = useState("");
    const [action, setAction] = useState("");
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: page + 1,        // backend is 1-based
                pageSize,
            };
            if (entityType) params.entityType = entityType;
            if (action) params.action = action;

            const data = await getData(endpoints.auditLog, params);
            setLogs(data.items || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a naplót.");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, entityType, action]);

    useEffect(() => { load(); }, [load]);

    return (
        <Box sx={{ mt: 3 }}>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
                    Napló (audit log)
                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                    alignItems={{ sm: "center" }}
                >
                    <TextField
                        label="Entitás típus"
                        select
                        size="small"
                        value={entityType}
                        onChange={(e) => { setPage(0); setEntityType(e.target.value); }}
                        sx={{ minWidth: 180 }}
                    >
                        {ENTITY_TYPES.map((t) => (
                            <MenuItem key={t || "all"} value={t}>{t || "Mind"}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Művelet"
                        select
                        size="small"
                        value={action}
                        onChange={(e) => { setPage(0); setAction(e.target.value); }}
                        sx={{ minWidth: 160 }}
                    >
                        {ACTIONS.map((a) => (
                            <MenuItem key={a || "all"} value={a}>{a || "Mind"}</MenuItem>
                        ))}
                    </TextField>
                    <Button onClick={load} variant="outlined" size="small">Frissítés</Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : logs.length === 0 ? (
                    <Alert severity="info">Nincs naplóbejegyzés a kiválasztott szűrőkkel.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Időpont</TableCell>
                                    <TableCell>Felhasználó</TableCell>
                                    <TableCell>Entitás</TableCell>
                                    <TableCell>Sor ID</TableCell>
                                    <TableCell>Művelet</TableCell>
                                    <TableCell sx={{ width: "40%" }}>Változás</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((l) => (
                                    <TableRow key={l.id} hover>
                                        <TableCell>{l.id}</TableCell>
                                        <TableCell>{formatTs(l.timestamp)}</TableCell>
                                        <TableCell>
                                            {l.userEmail || <em>rendszer</em>}
                                            {l.userId != null && (
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    #{l.userId}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{l.entityType}</TableCell>
                                        <TableCell>{l.entityId ?? "—"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={l.action}
                                                size="small"
                                                color={actionColor(l.action)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ChangesCell json={l.changes || "{}"} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            onPageChange={(_, p) => setPage(p)}
                            rowsPerPage={pageSize}
                            onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            labelRowsPerPage="Sorok oldalanként:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}–${to} / ${count !== -1 ? count : `több, mint ${to}`}`}
                        />
                    </TableContainer>
                )}
            </Container>
        </Box>
    );
};

export default AdminAuditLog;
