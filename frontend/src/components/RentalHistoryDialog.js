import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box, CircularProgress, Typography, Chip, Alert, IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { getData, endpoints } from '../API/apiCalls';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL, STATUS_COLOR } from '../constants/constants';


const RentalHistoryDialog = ({ user, onClose }) => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUserRentals = async () => {
        setLoading(true);
        setError(null);
        getData(endpoints.rentalsByUserId(user.id)).then((data) => {
            setRentals(Array.isArray(data) ? data : []);
        }).catch((err) => {
            setError(err.message || "Nem sikerült betölteni a bérlési előzményeket.");
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!user) {
            setRentals([]);
            setError(null);
            return;
        }
        getUserRentals();
    }, [user]);

    const columns = [
        { field: 'id', headerName: '# ID', width: 70 },

        {
            field: 'carBrand',
            headerName: 'Márka',
            minWidth: 100,

        },
        {
            field: 'carModel',
            headerName: 'Típus',
            minWidth: 100,

        },
        {
            field: 'carRegNum',
            headerName: 'Rendszám',
            minWidth: 100,

        },
        {
            field: 'plannedStart',
            headerName: 'Bérlés kezdete',
            flex: 1.2,
            minWidth: 140,
            valueFormatter: (value) => value ? dayjs(value).format('YYYY.MM.DD. HH:mm') : '—'
        },
        {
            field: 'plannedEnd',
            headerName: 'Bérlés vége',
            flex: 1.2,
            minWidth: 140,
            valueFormatter: (value) => value ? dayjs(value).format('YYYY.MM.DD. HH:mm') : '—'
        },
        {
            field: 'totalCost',
            headerName: 'Összeg',
            width: 110,
            valueFormatter: (value) => value != null ? `${value.toLocaleString('hu-HU')} Ft` : "—"
        },
        {
            field: 'statusId',
            headerName: 'Státusz',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <Chip
                    label={RENTAL_STATUS_LABEL[params.value] || "Ismeretlen"}
                    size="small"
                    color={STATUS_COLOR(params.value)}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                />
            )
        }
    ];

    return (
        <Dialog
            open={!!user}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, pr: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                        {user ? `${user.name} bérlési előzményei` : 'Bérlési előzmények'}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" color="text.secondary">Adatok betöltése...</Typography>
                    </Box>
                ) : rentals.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 6, color: 'text.secondary', fontStyle: 'italic' }}>
                        Ennek a felhasználónak még nincsenek regisztrált bérlései a rendszerben.
                    </Typography>
                ) : (
                    <Box sx={{ height: 450, width: '100%' }}>
                        <DataGrid
                            rows={rentals}
                            columns={columns}
                            autoHeight={false}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 5 } }
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            disableRowSelectionOnClick
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'action.hover',
                                    borderBottom: '2px solid',
                                    borderColor: 'divider',
                                },
                                '& .MuiDataGrid-cell': {
                                    display: 'flex',
                                    alignItems: 'center'
                                }
                            }}
                        />
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="primary"
                    sx={{ textTransform: 'none', borderRadius: 1.5, fontWeight: 'bold', px: 3 }}
                >
                    Bezárás
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RentalHistoryDialog;