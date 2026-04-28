import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/hu';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';

import { useAuth } from '../provider/AuthProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import CarRentalIcon from '@mui/icons-material/CarRental';
import TitleComponent from './TitleComponent';
import FormDivider from './FormDivider';

const RentCarForm = ({ carBrand, carModel, setShowRentCartForm, carId }) => {
    const { user, isUser } = useAuth();

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();
    const licenseRef = useRef();
    const emailRef = useRef();

    const tomorrowEightAM = dayjs().add(1, 'day').hour(8).minute(0).second(0).millisecond(0);
    const [startDateTime, setStartDateTime] = useState(tomorrowEightAM);
    const [endDateTime, setEndDateTime] = useState(tomorrowEightAM.add(1, 'day'));
    const diffInDays = Math.ceil(endDateTime.diff(startDateTime, 'hour') / 24);
    const displayDays = diffInDays > 0 ? diffInDays : 1;
    const handleBooking = () => {
        const formData = {
            carId: carId,
            from: startDateTime.format('YYYY-MM-DD HH:mm'),
            to: endDateTime.format('YYYY-MM-DD HH:mm'),
            days: displayDays,
            user: {
                userId: user?.id ?? 0,
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                phone: phoneRef.current.value,
                address: addressRef.current.value,
                licenseNumber: licenseRef.current.value,
                email: emailRef.current.value
            },
        };

        console.log("Foglalás elküldése:", formData);
    };

    useEffect(() => {
        setEndDateTime(startDateTime.add(1, 'day'));
    }, [startDateTime])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mt: 3 }}>
                <TitleComponent title={`Foglalás véglegesítése: ${carBrand} ${carModel}`} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <FormDivider text="IDŐSZAK" />

                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2
                    }}>
                        <DateTimePicker
                            label="Bérlés kezdete"
                            value={startDateTime}
                            onChange={(newValue) => setStartDateTime(newValue)}
                            minDateTime={tomorrowEightAM}
                            fullWidth
                            sx={{ flex: 1 }}
                        />
                        <DateTimePicker
                            label="Bérlés vége"
                            value={endDateTime}
                            onChange={(newValue) => setEndDateTime(newValue)}
                            minDateTime={startDateTime}
                            fullWidth
                            sx={{ flex: 1 }}
                        />
                        <Box sx={{
                            backgroundColor: 'action.hover',
                            borderRadius: 4,
                            textAlign: 'center',
                            border: '1px dashed',
                            borderColor: 'primary.main',
                            p: 2,
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Bérlés időtartama: {displayDays} nap
                            </Typography>
                        </Box>
                    </Box>
                    <FormDivider text="SZEMÉLYES ADATOK" />

                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2
                    }}>
                        <TextField
                            fullWidth
                            label="Vezetéknév"
                            inputRef={lastNameRef}
                            defaultValue={isUser ? user.lastName : ''}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Keresztnév"
                            inputRef={firstNameRef}
                            defaultValue={isUser ? user.firstName : ''}
                            variant="outlined"
                        />
                    </Box>

                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2
                    }}>
                        <TextField
                            fullWidth label="Email cím"
                            type="email"
                            inputRef={emailRef}
                            defaultValue={isUser ? user?.email : ''}

                        />
                        <TextField
                            fullWidth
                            label="Lakcím"
                            inputRef={addressRef}
                            defaultValue={isUser ? user.address : ''}
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2
                    }}>
                        <TextField
                            fullWidth
                            label="Telefonszám"
                            inputRef={phoneRef}
                            defaultValue={isUser ? user.phone : ''}
                            variant="outlined"
                        />


                        <TextField
                            fullWidth
                            label="Jogosítvány száma"
                            inputRef={licenseRef}
                            defaultValue={isUser ? user.licenseNumber : ''}
                            variant="outlined"
                        /></Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                        <Button
                            variant="contained"

                            sx={{
                                py: 2,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                boxShadow: 4
                            }}
                            startIcon={<CarRentalIcon />}
                            onClick={handleBooking}
                        >
                            Foglalás véglegesítése
                        </Button>
                        <Button
                            variant="outlined"
                            color='default'
                            sx={{
                                py: 2,
                                fontWeight: 'bold',
                                borderRadius: 2,
                            }}
                            startIcon={<CancelIcon />}
                            onClick={() => setShowRentCartForm(false)}
                        >
                            Mégse
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </LocalizationProvider>
    );
};

export default RentCarForm;