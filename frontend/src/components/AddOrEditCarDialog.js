import {
    Button, IconButton, TextField, Checkbox,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControlLabel, Box
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { useCarRent } from "../provider/CarRentProvider";
import TitleComponent from "./TitleComponent";
import { useAuth } from "../provider/AuthProvider";

const AddOrEditCarDialog = ({ selectedCar, setSelectedCar, handleClose, open }) => {
    const { updateCar, addCar } = useCarRent();
    const { isAdmin } = useAuth();

    if (!selectedCar) return null;

    const isNew = !selectedCar.id;

    const handleInputChange = (field, value) => {
        setSelectedCar(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);

            setSelectedCar(prev => ({
                ...prev,
                img: file,
                imageUrl: previewUrl
            }));
        }
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

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 1 }}>
                    {selectedCar.imageUrl && (
                        <Box
                            component="img"
                            src={selectedCar.imageUrl}
                            alt="Autó előnézet"
                            sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 2 }}
                        />
                    )}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<PhotoCameraIcon />}
                        disabled={!isAdmin}
                    >
                        Kép feltöltése
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    label="Márka"
                    variant="outlined"
                    value={selectedCar.brand || ""}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    disabled={!isAdmin}
                />

                <TextField
                    fullWidth
                    label="Modell"
                    variant="outlined"
                    value={selectedCar.model || ""}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    disabled={!isAdmin}
                />

                <TextField
                    fullWidth
                    label="Rendszám"
                    variant="outlined"
                    value={selectedCar.plate || ""}
                    onChange={(e) => handleInputChange('plate', e.target.value)}
                    disabled={!isAdmin}
                />

                <TextField
                    fullWidth
                    label="Kilométeróra állása"
                    type="number"
                    variant="outlined"
                    value={selectedCar.miles || 0}
                    onChange={(e) => handleInputChange('miles', e.target.value)}
                    InputProps={{ endAdornment: <Typography variant="caption">km</Typography> }}
                    disabled={!isAdmin}
                />

                <TextField
                    fullWidth
                    label="Napi bérleti díj"
                    type="number"
                    variant="outlined"
                    value={selectedCar.fee || 0}
                    onChange={(e) => handleInputChange('fee', e.target.value)}
                    InputProps={{ endAdornment: <Typography variant="caption">Ft</Typography> }}
                    disabled={!isAdmin}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!selectedCar.isRentable}
                            onChange={(e) => handleInputChange('isRentable', e.target.checked)}
                            color="secondary"
                        />
                    }
                    label="Az autó bérelhető a felhasználók számára"
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

export default AddOrEditCarDialog;