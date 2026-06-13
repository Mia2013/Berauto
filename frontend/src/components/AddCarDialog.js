import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    MenuItem, Alert, Box, FormControlLabel, Switch, IconButton
} from '@mui/material';
import { postData, endpoints, getData } from '../API/apiCalls';
import { CAR_STATUS, FUEL_FILTERS, CLOUD_NAME, UPLOAD_PRESET } from '../constants/constants';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomAlert from './CustomAlert';
import TitleComponent from './TitleComponent';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SaveIcon from '@mui/icons-material/Save';

const AddCarDialog = ({ open, onClose, onSuccess }) => {
    const [regNum, setRegNum] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState(0);
    const [fee, setFee] = useState(0);
    const [fuelId, setFuelId] = useState(1);
    const [isRentable, setIsRentable] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [alert, setAlert] = useState(null);

    const fileInputRef = useRef();

    useEffect(() => {
        if (open) {
            setRegNum("");
            setBrand("");
            setModel("");
            setMileage(0);
            setFee(0);
            setFuelId(1);
            setIsRentable(true);
            setSelectedFile(null);
            setError(null);
        }
    }, [open]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setSelectedFile({
                img: file,
                imageUrl: previewUrl
            });
        }
    };

    const uploadImageToCloudinary = async () => {
        if (!selectedFile) return null;

        const formData = new FormData();
        formData.append("file", selectedFile.img);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Sikertelen képfeltöltés a felhőbe.");
        }

        const data = await response.json();
        return data.secure_url;
    };



    const handleSubmit = async () => {
    const cleanedRegNum = regNum.trim().toUpperCase();
    if (!cleanedRegNum || !brand.trim() || !model.trim()) {
        setError("Rendszám, márka és modell megadása kötelező.");
        return;
    }

    setSubmitting(true);
    setError(null);

    try {
        const checkResponse = await getData(endpoints.validateRegnum(cleanedRegNum));
    
        if (!checkResponse.ok) {
            const errorData = await checkResponse.json();
             throw new Error(errorData.message || "A rendszám már használatban van.");
        }

        const uploadedPicUrl = await uploadImageToCloudinary(cleanedRegNum);

         const formData = {
            regNum: cleanedRegNum,
            brand: brand.trim(),
            model: model.trim(),
            mileage: Number(mileage) || 0,
            fee: Number(fee) || 0,
            fuelId: Number(fuelId),
            statusId: CAR_STATUS.AVAILABLE,
            isRentable,
            imgUrl: uploadedPicUrl
        };

        await postData(endpoints.cars, formData);
        
        onSuccess();
        setAlert({ severity: "success", message: "Új autó hozzáadva." });
        onClose();

    } catch (e) {
        setError(e?.message || "Az autó hozzáadása nem sikerült.");
    } finally {
        setSubmitting(false);
    }
};

    const handleDeleteFile = () => {
        setSelectedFile(null);
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="primary" />
                        <TitleComponent title="Új autó hozzáadása" marginY={0} />
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 1 }}>
                        {selectedFile?.imageUrl && (
                            <Box
                                component="img"
                                src={selectedFile.imageUrl}
                                alt="Autó előnézet"
                                sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 2 }}
                            />
                        )}
                        {
                            selectedFile ?
                                (<Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    disabled={submitting}
                                    onClick={handleDeleteFile}
                                >
                                    Kép törlése

                                </Button>) :
                                (<Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    disabled={submitting}
                                >
                                    Kép feltöltése
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>)
                        }
                    </Box>
                    <TextField label="Rendszám" value={regNum} onChange={(e) => setRegNum(e.target.value)} required />
                    <TextField label="Márka" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                    <TextField label="Modell" value={model} onChange={(e) => setModel(e.target.value)} required />
                    <TextField label="Kilométeróra" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                    <TextField label="Napi díj (Ft)" type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
                    <TextField label="Üzemanyag" select value={fuelId} onChange={(e) => setFuelId(e.target.value)}>
                        {FUEL_FILTERS.filter(f => f.id !== -1).map(f => <MenuItem key={f.id} value={f.id}>{f.label}</MenuItem>)}
                    </TextField>
                    <FormControlLabel
                        control={<Switch checked={isRentable} onChange={(e) => setIsRentable(e.target.checked)} />}
                        label="Bérelhető"
                    />


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" disabled={submitting}
                        color="primary"

                        startIcon={<SaveIcon />}>
                        {submitting ? "Mentés..." : "Hozzáadás"}
                    </Button>
                    <Button onClick={onClose} disabled={submitting} startIcon={<CancelIcon />}
                    >Mégse</Button>
                </DialogActions>
            </Dialog>

            {alert && <CustomAlert alert={alert} setAlert={setAlert} />}
        </div>
    );
};

export default AddCarDialog;
