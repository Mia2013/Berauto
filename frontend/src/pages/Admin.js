import { useState, useEffect } from "react";
import {
    Box, Button, Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, Checkbox, Tooltip,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useCarRent } from "../provider/CarRentProvider";
import TitleComponent from "../components/TitleComponent";
import { formatPrice } from "../utils/utils";
import AddOrEditCarDialog from "../components/AddOrEditCarDialog";
import { useAuth } from "../provider/AuthProvider";

const Admin = () => {
    const { isAdmin, isUgyintezo } = useAuth();
    const { cars, getCars, deleteCar } = useCarRent();
    const [selectedCar, setSelectedCar] = useState(null);
    const [open, setOpen] = useState(false);

    //kommentet kivenni, ha már van hozzá backend
    // useEffect(() => {
    //     getCars();
    // }, []);

    const handleOpenEdit = (car) => {
        setSelectedCar(car);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCar(null);
    };

    const handleOpenAdd = () => {
        setSelectedCar({
            brand: "",
            model: "",
            plate: "",
            miles: 0,
            fee: 0,
            isRentable: true
        });
        setOpen(true);
    };

    return (
        <Box sx={{ px: 3, mb: 5 }}>
            <TitleComponent title="Autók kezelése" />

            {isAdmin && (
                <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleOpenAdd}>
                    Új autó hozzáadása
                </Button>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Márka</TableCell>
                        <TableCell>Modell</TableCell>
                        <TableCell>Rendszám</TableCell>
                        <TableCell align="right">Km óra állás (Km)</TableCell>
                        <TableCell align="right">Bérelhető</TableCell>
                        <TableCell align="right">Napi díj (Ft)</TableCell>
                        <TableCell align="center">Műveletek</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cars.map((car) => (
                        <TableRow key={car.id} hover>
                            <TableCell>{car.brand}</TableCell>
                            <TableCell>{car.model}</TableCell>
                            <TableCell>{car.plate}</TableCell>
                            <TableCell align="right">
                                {formatPrice(car.miles)}
                            </TableCell>
                            <TableCell align="right">
                                <Checkbox checked={car.isRentable} readOnly color="secondary" />
                            </TableCell>
                            <TableCell align="right">
                                {formatPrice(car.fee)}
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Tooltip title={isAdmin ? "Szerkesztés" : "Bérelhetőség beállítása"}>
                                        <IconButton color="primary" onClick={() => handleOpenEdit(car)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {isAdmin && (
                                        <Tooltip title="Törlés">
                                            <IconButton color="error" onClick={() => deleteCar(car.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedCar &&
                <AddOrEditCarDialog selectedCar={selectedCar} setSelectedCar={setSelectedCar} handleClose={handleClose} open={open} />
            }
        </Box>
    );
};

export default Admin;