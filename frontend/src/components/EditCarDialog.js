import {
    Button, IconButton, TextField, Checkbox,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControlLabel, Box
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import { useCarRent } from "../provider/CarRentProvider";
import TitleComponent from "./TitleComponent";

const EditCarDialog = ({ selectedCar, setSelectedCar, handleClose, open }) => {
    const { updateCar, addCar } = useCarRent();

    if (!selectedCar) return null;

    const isNew = !selectedCar.id;

    const handleInputChange = (field, value) => {
        setSelectedCar(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (isNew) {
            await addCar(selectedCar);
        } else {
            await updateCar(selectedCar.id, selectedCar);
        }
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon color="primary" />
                    <TitleComponent title={isNew ? "Új autó hozzáadása" : "Autó szerkesztése"} marginY={0} />
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>

                <TextField
                    fullWidth
                    label="Márka"
                    variant="outlined"
                    value={selectedCar.brand || ""}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Modell"
                    variant="outlined"
                    value={selectedCar.model || ""}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Rendszám"
                    variant="outlined"
                    value={selectedCar.plate || ""}
                    onChange={(e) => handleInputChange('plate', e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Kilométeróra állása"
                    type="number"
                    variant="outlined"
                    value={selectedCar.miles || 0}
                    onChange={(e) => handleInputChange('miles', e.target.value)}
                    InputProps={{ endAdornment: <Typography variant="caption">km</Typography> }}
                />




                <TextField
                    fullWidth
                    label="Napi bérleti díj"
                    type="number"
                    variant="outlined"
                    value={selectedCar.fee || 0}
                    onChange={(e) => handleInputChange('fee', e.target.value)}
                    InputProps={{ endAdornment: <Typography variant="caption">Ft</Typography> }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!selectedCar.isRentable}
                            onChange={(e) => handleInputChange('isRentable', e.target.checked)}
                            color="secondary"
                        />
                    }
                    label="  Az autó bérelhető a felhasználók számára"


                />

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                >
                    {isNew ? "Hozzáadás" : "Mentés"}
                </Button>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    color="inherit"
                    startIcon={<CancelIcon />}
                >
                    Mégse
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCarDialog;