import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Container, Typography, Paper, Chip, IconButton, Tooltip, Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CarRentalIcon from '@mui/icons-material/CarRental';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';

import { getData, postData, endpoints } from '../API/apiCalls';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL, STATUS_COLOR } from '../constants/constants';
import InspectDialog from '../components/InspectDialog';
import EditRentalDialog from '../components/EditRentalDialog';
import ReceiptDialog from '../components/ReceiptDialog';
import CustomAlert from '../components/CustomAlert';
import TitleComponent from '../components/TitleComponent';


const AdminRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const [inspectTarget, setInspectTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [viewReceipt, setViewReceipt] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(endpoints.rentals);
            setRentals(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a bérléseket.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSimpleAction = async (rentalId, kind) => {
        setBusyId(rentalId);
        try {
            const urlMap = {
                handover: endpoints.rentalHandover(rentalId),
                return: endpoints.rentalReturn(rentalId),
                cancel: endpoints.rentalCancel(rentalId),
            };
            await postData(urlMap[kind]);
            setToast({ severity: "success", message: "A bérlés állapota sikeresen frissítve." });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A művelet nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    const handleOpenReceipt = async (rental) => {
        try {
            const receiptData = await getData(endpoints.receiptByRental(rental.id));
            if (receiptData) setViewReceipt(receiptData);
            else setToast({ severity: "warning", message: "Ehhez a bérléshez még nem áll rendelkezésre a bizonylat." });
        } catch (err) {
            setToast({ severity: "error", message: "Nem sikerült betölteni a bizonylatot." });
        }
    };

    const getStatusActions = (rental) => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, justifyContent: 'flex-end', height: '100%', width: '100%' }}>
                {rental.statusId === RENTAL_STATUS.CONFIRMED && (
                    <>
                        <Tooltip title="Autó átadása">
                            <IconButton color="success" disabled={busyId === rental.id} onClick={() => handleSimpleAction(rental.id, "handover")}>
                                <CarRentalIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Foglalás lemondása">
                            <IconButton color="error" disabled={busyId === rental.id} onClick={() => handleSimpleAction(rental.id, "cancel")}>
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {rental.statusId === RENTAL_STATUS.ACTIVE && (
                    <Tooltip title="Jármű visszavétele">
                        <IconButton color="warning" disabled={busyId === rental.id} onClick={() => handleSimpleAction(rental.id, "return")}>
                            <AssignmentReturnIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {rental.statusId === RENTAL_STATUS.RETURNED && (
                    <Tooltip title="Átvételi ellenőrzés">
                        <IconButton color="secondary" disabled={busyId === rental.id} onClick={() => setInspectTarget(rental)}>
                            <CheckCircleIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {rental.statusId === RENTAL_STATUS.COMPLETED && (
                    <Tooltip title="Bizonylat megtekintése">
                        <IconButton color="info" onClick={() => handleOpenReceipt(rental)}>
                            <ReceiptLongIcon />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Adatok szerkesztése">
                    <IconButton color="primary" onClick={() => setEditTarget(rental)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    };

    const renderCancelableCell = (value, isCancelled, isBold = false) => {
        return (
            <Typography
                variant="body2"
                sx={{
                    textDecoration: isCancelled ? 'line-through' : 'none',
                    color: isCancelled ? 'text.disabled' : 'text.primary',
                    fontWeight: isBold && !isCancelled ? 700 : 400,
                }}
            >
                {value}
            </Typography>
        );
    };

    const columns = useMemo(() => [
        {
            field: 'statusId',
            headerName: 'Státusz',
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={RENTAL_STATUS_LABEL[params.value] || "Ismeretlen"}
                    size="small"
                    color={STATUS_COLOR(params.value)}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                />
            )
        },
        {
            field: 'id',
            headerName: '# ID',
            width: 70,
            renderCell: (params) => renderCancelableCell(params.value, params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'userName',
            headerName: 'Bérlő neve',
            minWidth: 150,
            renderCell: (params) => renderCancelableCell(params.value, params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'userPhone',
            headerName: 'Telefonszám',
            minWidth: 130,
            renderCell: (params) => renderCancelableCell(params.value, params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'userEmail',
            headerName: 'Email cím',
            minWidth: 180,
            renderCell: (params) => renderCancelableCell(params.value, params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'carBrand',
            headerName: 'Márka',
            minWidth: 110,
            renderCell: (params) => renderCancelableCell(params.value, params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'carModel',
            headerName: 'Modell',
            minWidth: 110,
            renderCell: (params) => renderCancelableCell(params.value, params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'carRegNum',
            headerName: 'Rendszám',
            minWidth: 100,
            renderCell: (params) => renderCancelableCell(params.value, params.row.statusId === RENTAL_STATUS.CANCELLED, true)
        },
        {
            field: 'plannedStart',
            headerName: 'Kezdete',
            minWidth: 110,
            renderCell: (params) => renderCancelableCell(params.value ? dayjs(params.value).format('YYYY.MM.DD.') : '—', params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'plannedEnd',
            headerName: 'Vége',
            minWidth: 110,
            renderCell: (params) => renderCancelableCell(params.value ? dayjs(params.value).format('YYYY.MM.DD.') : '—', params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'totalCost',
            headerName: 'Összeg',
            minWidth: 120,
            renderCell: (params) => renderCancelableCell(params.value ? `${params.value.toLocaleString("hu-HU")} Ft` : '—', params.row.statusId === RENTAL_STATUS.CANCELLED)
        },
        {
            field: 'actions',
            headerName: 'Műveletek',
            width: 140,
            sortable: false,
            filterable: false,
            renderCell: (params) => getStatusActions(params.row)
        },
    ], [busyId]);

    return (
        <Box sx={{ mt: 3, px: 3, mb: 5 }}>
            <Container maxWidth="xl" component={Paper} elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <TitleComponent title="Bérlések kezelése" marginY={0} alignItems="start" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Vezérelje a foglalásokat, rögzítse az átadásokat és kezelje a pénzügyi bizonylatokat.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <DataGrid
                    rows={rentals}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    
                    // 1. MEGOLDÁS: Osztály hozzáadása a sorhoz, ha ma van az átadás napja
                    getRowClassName={(params) => {
                        if (!params.row.plannedStart) return '';
                        
                        const isToday = dayjs(params.row.plannedStart).isSame(dayjs(), 'day');
                        const isRelevant = params.row.statusId !== RENTAL_STATUS.CANCELLED && params.row.statusId !== RENTAL_STATUS.COMPLETED;

                        return isToday && isRelevant ? 'today-handover-row' : '';
                    }}

                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover', borderBottom: '2px solid', borderColor: 'divider' },
                        '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
                        
                        // 2. MEGOLDÁS: A generált osztály testreszabása sárga kiemeléssel
                        '& .today-handover-row': {
                            backgroundColor: 'rgba(255, 235, 59, 0.15)', // Halvány borostyán/sárga háttér
                            borderLeft: '4px solid #fbc02d', // Erősebb sárga csík a sor elején
                            '&:hover': {
                                backgroundColor: 'rgba(255, 235, 59, 0.25)', // Hover állapotban kicsit sötétebb sárga
                            }
                        }
                    }}
                />
            </Container>

            <InspectDialog
                open={!!inspectTarget}
                rental={inspectTarget}
                onClose={() => setInspectTarget(null)}
                onSuccess={() => { setToast({ severity: "success", message: "Ellenőrzés sikeresen rögzítve." }); load(); }}
            />

            <EditRentalDialog
                open={!!editTarget}
                rental={editTarget}
                onClose={() => setEditTarget(null)}
                onSuccess={() => { setToast({ severity: "success", message: "Bérlés sikeresen frissítve." }); load(); }}
            />

            <ReceiptDialog
                open={!!viewReceipt}
                receipt={viewReceipt}
                onClose={() => setViewReceipt(null)}
            />

            {toast && <CustomAlert alert={toast} setAlert={setToast} />}
        </Box>
    );
};

export default AdminRentals;