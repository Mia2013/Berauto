import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    MenuItem, Alert, Box, FormControlLabel, Switch, IconButton, Grid
} from '@mui/material';
import { postData, endpoints, getData } from '../API/apiCalls';
import { CAR_STATUS, FUEL_FILTERS, CLOUD_NAME, UPLOAD_PRESET } from '../constants/constants';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAlert from './CustomAlert';
import TitleComponent from './TitleComponent';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SaveIcon from '@mui/icons-material/Save';
import ValidationCaption from './ValidationCaption';

const AddCarDialog = ({ open, onClose, onSuccess }) => {
    const [regNum, setRegNum] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState(0);
    const [fee, setFee] = useState(0);
    const [fuelId, setFuelId] = useState(1);
    const [isRentable, setIsRentable] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (open) {
            setRegNum("");
            setBrand("");
            setModel("");
            setMileage();
            setFee();
            setFuelId(1);
            setIsRentable(true);
            setSelectedFile(null);
            setError(null);
            setValidationErrors({});
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
            if (validationErrors.file) {
                setValidationErrors(prev => {
                    const { file, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const uploadImageToCloudinary = async (publicId) => {
        if (!selectedFile) return null;

        const formData = new FormData();
        formData.append("file", selectedFile.img);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("public_id", publicId);

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

    const validateForm = (data) => {
        const errors = {};
        const cleanedReg = data.regNum.trim();
        const cleanedBrand = data.brand.trim();
        const cleanedModel = data.model.trim();

        if (!cleanedReg) errors.regNum = 'Rendszám megadása kötelező!';
        else if (cleanedReg.length > 10) errors.regNum = 'A rendszám nem lehet hosszabb 10 karakternél!';

        if (!cleanedBrand) errors.brand = 'Márka megadása kötelező!';
        else if (cleanedBrand.length > 15) errors.brand = 'A márka nem lehet hosszabb 15 karakternél!';

        if (!cleanedModel) errors.model = 'Modell megadása kötelező!';
        else if (cleanedModel.length > 20) errors.model = 'A modell nem lehet hosszabb 20 karakternél!';

        if (Number(data.mileage) < 0) errors.mileage = 'A kilométeróra állása nem lehet negatív!';
        if (Number(data.fee) < 0) errors.fee = 'A napi díj nem lehet negatív!';

        if (!selectedFile) errors.file = 'Az autóhoz kötelező képet feltölteni!';

        return errors;
    };

    const handleSubmit = async () => {
        const rawData = {
            regNum,
            brand,
            model,
            mileage,
            fee
        };

        const errors = validateForm(rawData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError(null);
            return;
        }

        const cleanedRegNum = regNum.trim().toUpperCase();
        setSubmitting(true);
        setError(null);
        setValidationErrors({});

        try {
            const checkResponse = await getData(endpoints.validateRegnum(cleanedRegNum));
            if (!checkResponse?.available) {
                setValidationErrors({ regNum: "Ez a rendszám már használatban van a rendszerben!" });
                setSubmitting(false);
                return;
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
                imgUrl: uploadedPicUrl || ""
            };

            await postData(endpoints.cars, formData);

            onSuccess();
            setAlert({ severity: "success", message: "Új autó hozzáadva." });
            onClose();

        } catch (e) {
            setError(e?.message || "Az autó hozzáadása nem sikerült hálózati hiba miatt.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteFile = () => {
        setSelectedFile(null);
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="primary" />
                        <TitleComponent title="Új autó hozzáadása" marginY={0} />
                    </Box>
                    <IconButton onClick={onClose} size="small" disabled={submitting}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: "column", gap: 2.5 }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 1 }}>
                        {selectedFile?.imageUrl && (
                            <Box
                                component="img"
                                src={selectedFile.imageUrl}
                                alt="Autó előnézet"
                                sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 2 }}
                            />
                        )}
                        {selectedFile ? (
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                disabled={submitting}
                                onClick={handleDeleteFile}
                                color='error'
                            >
                                Kép törlése
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    disabled={submitting}
                                    color={!!validationErrors.file ? "error" : "primary"}
                                >
                                    Kép feltöltése
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {validationErrors.file && <ValidationCaption message={validationErrors.file} />}
                            </Box>
                        )}
                    </Box>
                    <Grid container spacing={3} sx={{ alignItems: 'center' }}>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Rendszám"
                                value={regNum}
                                onChange={(e) => setRegNum(e.target.value)}
                                required
                                error={!!validationErrors.regNum}
                                helperText={validationErrors.regNum}
                                inputProps={{ maxLength: 10 }}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >

                            <TextField
                                label="Márka"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                required
                                error={!!validationErrors.brand}
                                helperText={validationErrors.brand}
                                inputProps={{ maxLength: 15 }} fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Modell"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                                error={!!validationErrors.model}
                                helperText={validationErrors.model}
                                inputProps={{ maxLength: 20 }} fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Kilométeróra"
                                type="number"
                                value={mileage}
                                onChange={(e) => setMileage(e.target.value)}
                                error={!!validationErrors.mileage}
                                helperText={validationErrors.mileage} fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField
                                label="Napi díj (Ft)"
                                type="number"
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                                error={!!validationErrors.fee}
                                helperText={validationErrors.fee} fullWidth

                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <TextField 
                            label="Üzemanyag" 
                            select 
                            value={fuelId} 
                            onChange={(e) => setFuelId(e.target.value)}
                            fullWidth
                            >
                                {FUEL_FILTERS.filter(f => f.id !== -1).map(f => 
                                <MenuItem key={f.id} value={f.id}>{f.label}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                            <FormControlLabel
                                control={<Switch 
                                    checked={isRentable} 
                                    onChange={(e) => setIsRentable(e.target.checked)} />}
                                label="Bérelhető"
                            />
                        </Grid>
                    </Grid>
                    {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" disabled={submitting}
                        color="primary"
                        startIcon={<SaveIcon />}>
                        {submitting ? "Mentés..." : "Hozzáadás"}
                    </Button>
                    <Button onClick={onClose} disabled={submitting} startIcon={<CancelIcon />} color='default'  variant="outlined">
                        Mégse
                    </Button>
                </DialogActions>
            </Dialog>

            {alert && <CustomAlert alert={alert} setAlert={setAlert} />}
        </div >
    );
};

export default AddCarDialog;