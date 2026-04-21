import { useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
    Container, Chip, Box, IconButton, Tooltip
} from "@mui/material";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CarRentalIcon from '@mui/icons-material/CarRental';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { useCarRent } from "../provider/CarRentProvider";
import TitleComponent from "../components/TitleComponent";
import CustomAlert from "../components/CustomAlert";
import { RENT_STATUSES, STATUS_UI } from "../constants/constants";

const ManageRentals = () => {
    const { rents, getRents, updateRentStatus, generateInvoice, alert, setAlert } = useCarRent();
    const navigate = useNavigate();

    // useEffect(() => {
    //     getRents();
    // }, []);

    const getStatusChip = (status) => {
        const current = STATUS_UI[status];
        if (current) {
            return <Chip label={current.label} color={current.color} size="small" variant="outlined" />;

        }
    };

    const getStatusActions = (rent) => {
        const actionMap = {
            [RENT_STATUSES.PENDING]: (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Elfogadás">
                        <IconButton color="success" onClick={() => updateRentStatus(rent.id, RENT_STATUSES.APPROVED)}>
                            <CheckCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Elutasítás">
                        <IconButton color="error" onClick={() => updateRentStatus(rent.id, RENT_STATUSES.REJECTED)}>
                            <CancelIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            [RENT_STATUSES.APPROVED]: (
                <Tooltip title="Átadás">
                    <IconButton color="info" onClick={() => updateRentStatus(rent.id, RENT_STATUSES.IN_PROGRESS)}>
                        <CarRentalIcon />
                    </IconButton>
                </Tooltip>
            ),
            [RENT_STATUSES.IN_PROGRESS]: (
                <Tooltip title="Visszavétel">
                    <IconButton color="warning" onClick={() => updateRentStatus(rent.id, RENT_STATUSES.RETURNED)}>
                        <AssignmentReturnIcon />
                    </IconButton>
                </Tooltip>
            ),
            [RENT_STATUSES.RETURNED]: (
                <Tooltip title="Számlázás készítése">
                    <IconButton color="info" onClick={() => navigate("/invoice", { state: { rent } })}>
                        <ReceiptIcon />
                    </IconButton>
                </Tooltip>
            )
        };

        return actionMap[rent.status] || null;
    };

    const columns = useMemo(() => [
        {
            field: 'user',
            headerName: 'Bérlő',
            flex: 1.2,
            minWidth: 150,
            valueGetter: (params) => `${params.lastName} ${params.firstName}`
        },
        {
            field: 'phone',
            headerName: 'Telefonszám',
            flex: 1,
            minWidth: 120,
            valueGetter: (params, row) => row.user.phone
        },
        {
            field: 'email',
            headerName: 'Email cím',
            flex: 1.5,
            minWidth: 180,
            valueGetter: (params, row) => row.user.email
        },
        {
            field: 'brand',
            headerName: 'Márka',
            flex: 1,
            minWidth: 100,
            valueGetter: (params, row) => row.car.brand
        },
        {
            field: 'model',
            headerName: 'Modell',
            flex: 1,
            minWidth: 100,
            valueGetter: (params, row) => row.car.model
        },
        {
            field: 'plate',
            headerName: 'Rendszám',
            flex: 0.8,
            minWidth: 100,
            valueGetter: (params, row) => row.car.registrationName
        },
        { field: 'startDate', headerName: 'Kezdete', flex: 1, minWidth: 110 },
        { field: 'endDate', headerName: 'Vége', flex: 1, minWidth: 110 },
        {
            field: 'status',
            headerName: 'Státusz',
            flex: 1.2,
            minWidth: 130,
            renderCell: (params) => getStatusChip(params.value)
        },
        {
            field: 'actions',
            headerName: 'Műveletek',
            flex: 1,
            minWidth: 120,
            sortable: false,
            renderCell: (params) => getStatusActions(params.row)
        }
    ], [updateRentStatus, generateInvoice]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <TitleComponent title="Bérlések kezelése" />

            <DataGrid
                rows={rents}
                columns={columns}
                autoHeight
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick

            />

            {alert && <CustomAlert alert={alert} setAlert={setAlert} />}
        </Container>
    );
};

export default ManageRentals;