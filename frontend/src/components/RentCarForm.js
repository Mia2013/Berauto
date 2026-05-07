import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/hu';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';

import { useAuth } from '../provider/AuthProvider';
import { useCarRent } from '../provider/CarRentProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import CarRentalIcon from '@mui/icons-material/CarRental';
import TitleComponent from './TitleComponent';
import FormDivider from './FormDivider';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

const RentCarForm = ({ carBrand, carModel, setShowRentCartForm, carId }) => {
    const { user, isUser } = useAuth();
    const { addNewRent } = useCarRent();

    const firstNameRef = useRef();
    const lastNameRef  = useRef();
    const phoneRef     = useRef();
    const addressRef   = useRef();
    const licenseRef   = useRef();
    const emailRef     = useRef();

    const tomorrowEightAM = dayjs().add(1, 'day').hour(8).minute(0).second(0).millisecond(0);
    const [startDateTime, setStartDateTime] = useState(tomorrowEightAM);
    const [endDateTime, setEndDateTime]     = useState(tomorrowEightAM.add(1, 'day'));

    const bookedRanges = [];

    const isDateDisabled = (date) => {
        return bookedRanges.some(range =>
            date.isBetween(range.start, range.end, 'day', '[]')
        );
    };

    const getNextBookingStart = () => {
        if (!startDateTime) return undefined;
        const futureBookings = bookedRanges
            .filter(range => range.start.isAfter(startDateTime))
            .sort((a, b) => a.start.diff(b.start));
        return futureBookings.length > 0 ? futureBookings[0].start : undefined;
    };

    const maxAllowedEndDateTime = getNextBookingStart();
    const diffInDays  = Math.ceil(endDateTime.diff(startDateTime, 'hour') / 24);
    const displayDays = diffInDays > 0 ? diffInDays : 1;

    const handleBooking = () => {
        const formData = {
            carId:  carId,
            userId: user?.id ?? 0,
        };
        addNewRent(formData);
        setShowRentCartForm(false);
    };

    useEffect(() => {
        let newEnd = startDateTime.add(1, 'day');
        if (maxAllowedEndDateTime && newEnd.isAfter(maxAllowedEndDateTime)) {
            newEnd = maxAllowedEndDateTime.subtract(1, 'minute');
        }
        setEndDateTime(newEnd);
    }, [startDateTime]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mt: 3 }}>
                <TitleComponent title={`Foglalás véglegesítése: ${carBrand} ${carModel}`} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <FormDivider text="IDŐSZAK" />

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        <DateTimePicker
                            label="Bérlés kezdete"
                            value={startDateTime}
                            onChange={(newValue) => setStartDateTime(newValue)}
                            minDateTime={tomorrowEightAM}
                            shouldDisableDate={isDateDisabled}
                            sx={{ flex: 1 }}
                        />
                        <DateTimePicker
                            label="Bérlés vége"
                            value={endDateTime}
                            onChange={(newValue) => setEndDateTime(newValue)}
                            minDateTime={startDateTime}
                            maxDateTime={maxAllowedEndDateTime}
                            shouldDisableDate={isDateDisabled}
                            sx={{ flex: 1 }}
                        />
                        <Box sx={{
                            backgroundColor: 'action.hover',
                            borderRadius: 4,
                            textAlign: 'center',
                            border: '1px dashed',
                            borderColor: 'primary.main',
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Bérlés: {displayDays} nap
                            </Typography>
                        </Box>
                    </Box>

                    <FormDivider text="SZEMÉLYES ADATOK" />

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        <TextField fullWidth label="Vezetéknév"  inputRef={lastNameRef}
                            defaultValue={isUser ? user?.name?.split(' ')[0] : ''} variant="outlined" />
                        <TextField fullWidth label="Keresztnév" inputRef={firstNameRef}
                            defaultValue={isUser ? user?.name?.split(' ')[1] : ''} variant="outlined" />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                        <TextField fullWidth label="Email cím" type="email" inputRef={emailRef}
                            defaultValue={isUser ? user?.email : ''} />
                        <TextField fullWidth label="Lakcím" inputRef={addressRef}
                            defaultValue={isUser ? user?.address : ''} variant="outlined" />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        <TextField fullWidth label="Telefonszám" inputRef={phoneRef}
                            defaultValue={isUser ? user?.phone : ''} variant="outlined" />
                        <TextField fullWidth label="Jogosítvány száma" inputRef={licenseRef}
                            defaultValue={isUser ? user?.drivingLicence : ''} variant="outlined" />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                        <Button
                            variant="contained"
                            sx={{ py: 2, fontWeight: 'bold', borderRadius: 2, boxShadow: 4 }}
                            startIcon={<CarRentalIcon />}
                            onClick={handleBooking}
                        >
                            Foglalás véglegesítése
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ py: 2, fontWeight: 'bold', borderRadius: 2 }}
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

export default RentCarForm;import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/hu';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';

import { useAuth } from '../provider/AuthProvider';
import { useCarRent } from '../provider/CarRentProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import CarRentalIcon from '@mui/icons-material/CarRental';
import TitleComponent from './TitleComponent';
import FormDivider from './FormDivider';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

const RentCarForm = ({ carBrand, carModel, setShowRentCartForm, carId }) => {
    const { user, isUser } = useAuth();

    const { carRents, } = useCarRent();

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();
    const licenseRef = useRef();
    const emailRef = useRef();

    const tomorrowEightAM = dayjs().add(1, 'day').hour(8).minute(0).second(0).millisecond(0);
    const [startDateTime, setStartDateTime] = useState(tomorrowEightAM);
    const [endDateTime, setEndDateTime] = useState(tomorrowEightAM.add(1, 'day'));


    //dummy adat, törölni kell majd
    const bookedRanges = [
        { start: dayjs().add(3, 'day').startOf('day'), end: dayjs().add(6, 'day').endOf('day') },
        { start: dayjs().add(12, 'day').startOf('day'), end: dayjs().add(15, 'day').endOf('day') },
    ];

    const isDateDisabled = (date) => {
        return bookedRanges.some(range => {
            return date.isBetween(range.start, range.end, 'day', '[]');
        });
    };

    const getNextBookingStart = () => {
        if (!startDateTime) return undefined;
        const futureBookings = bookedRanges
            .filter(range => range.start.isAfter(startDateTime))
            .sort((a, b) => a.start.diff(b.start));

        return futureBookings.length > 0 ? futureBookings[0].start : undefined;
    };

    const maxAllowedEndDateTime = getNextBookingStart();


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
        //kommentet kivenni, ha már van hozzá backend
        // addNewRent(formData);
        console.log("Foglalás elküldése:", formData);

    };

    useEffect(() => {
        let newEnd = startDateTime.add(1, 'day');

        if (maxAllowedEndDateTime && newEnd.isAfter(maxAllowedEndDateTime)) {
            newEnd = maxAllowedEndDateTime.subtract(1, 'minute');
        }

        setEndDateTime(newEnd);
    }, [startDateTime]);

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
                            shouldDisableDate={isDateDisabled}
                            fullWidth
                            sx={{ flex: 1 }}
                        />
                        <DateTimePicker
                            label="Bérlés vége"
                            value={endDateTime}
                            onChange={(newValue) => setEndDateTime(newValue)}
                            minDateTime={startDateTime}
                            maxDateTime={maxAllowedEndDateTime}
                            shouldDisableDate={isDateDisabled}
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Bérlés: {displayDays} nap
                            </Typography>
                        </Box>
                    </Box>

                    <FormDivider text="SZEMÉLYES ADATOK" />

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        <TextField
                            fullWidth label="Vezetéknév" inputRef={lastNameRef}
                            defaultValue={isUser ? user?.lastName : ''} variant="outlined"
                        />
                        <TextField
                            fullWidth label="Keresztnév" inputRef={firstNameRef}
                            defaultValue={isUser ? user?.firstName : ''} variant="outlined"
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                        <TextField
                            fullWidth label="Email cím" type="email" inputRef={emailRef}
                            defaultValue={isUser ? user?.email : ''}
                        />
                        <TextField
                            fullWidth label="Lakcím" inputRef={addressRef}
                            defaultValue={isUser ? user?.address : ''} variant="outlined"
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        <TextField
                            fullWidth label="Telefonszám" inputRef={phoneRef}
                            defaultValue={isUser ? user?.phone : ''} variant="outlined"
                        />
                        <TextField
                            fullWidth label="Jogosítvány száma" inputRef={licenseRef}
                            defaultValue={isUser ? user?.drivingLicence : ''} variant="outlined" // Itt lehet user.licenseNumber is a mapped szerint
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                        <Button
                            variant="contained"
                            sx={{ py: 2, fontWeight: 'bold', borderRadius: 2, boxShadow: 4 }}
                            startIcon={<CarRentalIcon />}
                            onClick={handleBooking}
                        >
                            Foglalás véglegesítése
                        </Button>
                        <Button
                            variant="outlined" color='default'
                            sx={{ py: 2, fontWeight: 'bold', borderRadius: 2 }}
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
