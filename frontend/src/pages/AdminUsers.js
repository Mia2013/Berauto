import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Container, Typography, Paper, Chip, IconButton,
    Tooltip, Stack, Alert, Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryIcon from '@mui/icons-material/History';
import ShieldIcon from '@mui/icons-material/Shield';
import EditIcon from '@mui/icons-material/Edit';
import { getData, deleteData, endpoints } from '../API/apiCalls';
import CustomAlert from '../components/CustomAlert';
import TitleComponent from '../components/TitleComponent';
import AdminAddUserDialog from '../components/AdminAddUserDialog';
import AdminEditUserDialog from '../components/AdminEditUserDialog';
import RentalHistoryDialog from '../components/RentalHistoryDialog';


const getRoleUi = (role) => {
    switch (role) {
        case "Admin": return { label: "Adminisztrátor", color: "error", icon: <ShieldIcon fontSize="small" /> };
        case "Officer": return { label: "Ügyintéző", color: "warning", icon: null };
        case "Client": return { label: "Ügyfél", color: "primary", icon: null };
        default: return { label: "Vendég", color: "default", icon: null };
    }
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const [registerOpen, setRegisterOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [historyTarget, setHistoryTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(endpoints.users || "api/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a felhasználók listáját.");
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => { load(); }, [load]);

    const handleDeleteUser = async (user) => {
        if (user.roleId === 1) {
            setToast({ severity: "error", message: "Biztonsági okokból főadminisztrátor nem törölhető a felületről!" });
            return;
        }

        if (!window.confirm(`Biztosan törölni szeretné a(z) ${user.name} nevű felhasználót és összes kapcsolódó adatát?`)) {
            return;
        }

        setBusyId(user.id);
        try {
            await deleteData(endpoints.userDelById(user.id));
            setToast({ severity: "success", message: "A felhasználói fiók sikeresen eltávolításra került." });
            await load();
        } catch (err) {
            setToast({ severity: "error", message: err.message || "A felhasználó törlése nem sikerült." });
        } finally {
            setBusyId(null);
        }
    };

    const getUserActions = (user) => {
        return (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', height: '100%' }}>
                <Tooltip title="Felhasználó adatainak módosítása">
                    <IconButton color="primary" onClick={() => setEditTarget(user)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Előzmények">
                    <IconButton
                        color="default"
                        onClick={() => setHistoryTarget(user)}        >
                        <HistoryIcon />
                    </IconButton>
                </Tooltip>

                {
                    user.roleId !== 1 && (
                        <Tooltip title="Felhasználó végleges törlése">
                            <IconButton
                                color="error"
                                disabled={busyId === user.id}
                                onClick={() => handleDeleteUser(user)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )
                }
            </Box >
        );
    };

    const columns = useMemo(() => [
        { field: 'id', headerName: '# ID', width: 75 },
        {
            field: 'name',
            headerName: 'Teljes név',
            flex: 1.5,
            minWidth: 150,
        },
        { field: 'email', headerName: 'Email cím', flex: 1.5, minWidth: 180 },
        { field: 'phone', headerName: 'Telefonszám', flex: 1, minWidth: 120, valueFormatter: (value) => value || "—" },
        { field: 'address', headerName: 'Lakcím', flex: 1.8, minWidth: 200, valueFormatter: (value) => value || "—" },
        { field: 'drivingLicence', headerName: 'Jogosítvány', flex: 1, minWidth: 120, valueFormatter: (value) => value || "—" },
        {
            field: 'role',
            headerName: 'Szerepkör',
            flex: 1.2,
            minWidth: 140,
            renderCell: (params) => {
                const ui = getRoleUi(params.value);
                return (
                    <Chip
                        label={ui.label}
                        size="small"
                        color={ui.color}
                        icon={ui.icon}
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                    />
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Műveletek',
            width: 140,
            sortable: false,
            filterable: false,
            renderCell: (params) => getUserActions(params.row)
        },
    ], [busyId, historyTarget]);



    return (
        <Box sx={{ mt: 3, px: 3, mb: 5 }}>
            <Container maxWidth="xl" component={Paper} elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
                    <Box>
                        <TitleComponent title="Felhasználói fiókok kezelése" marginY={0} alignItems="start" />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Tekintse át a rendszerbe regisztrált ügyfeleket és munkatársakat, vagy vegyen fel új tagokat.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setRegisterOpen(true)}
                        sx={{ py: 1.2, px: 3, fontWeight: 'bold', borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}
                    >
                        Új felhasználó regisztrálása
                    </Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{ width: '100%' }}
                />
            </Container>

            <AdminAddUserDialog
                open={registerOpen}
                onClose={() => setRegisterOpen(false)}
                onSuccess={() => {
                    setToast({ severity: "success", message: "Az új felhasználói fiók sikeresen létrejött!" });
                    load();
                }}
            />
            <AdminEditUserDialog
                open={!!editTarget}
                user={editTarget}
                onClose={() => setEditTarget(null)}
                onSuccess={() => {
                    setToast({ severity: "success", message: "A felhasználó adatai sikeresen frissítve!" });
                    load();
                }}
            />
            <RentalHistoryDialog
                user={historyTarget}
                onClose={() => setHistoryTarget(null)}
            />
            {toast && <CustomAlert alert={toast} setAlert={setToast} />}
        </Box>
    );
};

export default AdminUsers;