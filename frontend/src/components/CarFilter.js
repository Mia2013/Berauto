import {
    Box, Paper, Button, Typography
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';

const CarFilter = ({ startDate, setStartDate, endDate, setEndDate, handleClick }) => {
    return (
        <Paper
            elevation={4}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                position: 'sticky',
                top: '100px',
                zIndex: 10,
            }}
        >
            <Box sx={{
                height: 220,
                position: 'relative',
                backgroundImage: `url(${process.env.PUBLIC_URL}/bmw.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                    display: 'flex', alignItems: 'flex-end', p: 4
                }}>
                    <Typography
                        variant="h3"
                        fontWeight={900}
                        sx={{ textTransform: 'uppercase', lineHeight: 1, color: 'white' }}>
                        Szűrés
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
                    <DatePicker
                        label="Átvétel dátuma"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                        disablePast
                    />

                    <DatePicker
                        label="Leadás dátuma"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                        minDate={startDate}
                    />
                </LocalizationProvider>


                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SearchIcon />}
                    onClick={handleClick}
                    sx={{ py: 2 }}
                >
                    Keresés
                </Button>
            </Box>
        </Paper>
    );
};

export default CarFilter;