import { useLocation, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import {
    Container, Paper, Box, Typography, Grid, Divider, Button, Card, CardContent
} from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useCarRent } from "../provider/CarRentProvider";

const Invoice = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { generateInvoice } = useCarRent();
    const rent = state?.rent;

    if (!rent) return <Typography sx={{ p: 4 }}>Hiba: Nincs kiválasztott bérlés!</Typography>;

    const calculateDays = (start, end) => {
        const d1 = dayjs(start);
        const d2 = dayjs(end);
        const diffInDays = Math.ceil(d2.diff(d1, 'hour') / 24);
        return diffInDays > 0 ? diffInDays : 1;
    };

    const days = calculateDays(rent.startDate, rent.endDate);
    const dailyPrice = 15000;
    const totalAmount = days * dailyPrice;

    const handleClick = () => {
        generateInvoice(rent.id);
        setTimeout(() => navigate("/manage-rents"), 2000);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Vissza a bérlésekhez
            </Button>

            <Paper elevation={10} sx={{ p: 6, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                    SZÁMLA
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <Typography variant="body2" color="text.secondary">
                            Bérautó Kft.<br />
                            1111 Budapest, Fő utca 1.<br />
                            info@berauto.hu
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <Typography variant="subtitle2">SZÁMLA ADATAI</Typography>
                        <Typography variant="body2">
                            Sorszám: #{rent.id}/{dayjs().format('YYYY')}<br />
                            Kelt: {dayjs().format('YYYY.MM.DD')}
                        </Typography>
                    </Grid>


                    <Grid size={{ xs: 12, sm: 6, md: 4 }}             >
                        <Typography variant="subtitle2" >VEVŐ ADATAI</Typography>
                        <Typography variant="body2">
                            {rent.user.lastName} {rent.user.firstName}<br />
                            {rent.user.email}<br />
                            {rent.user.phone}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}         >
                        <Typography
                            variant="h6"
                        > BÉRLEMÉNY</Typography>
                        <Typography variant="h6">Márka, típus: {rent.car.brand} {rent.car.model}</Typography>
                        <Typography variant="h6">Rendszám: {rent.car.registrationName}</Typography>
                        <Typography variant="h6">Időszak: {rent.startDate} - {rent.endDate}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}             >
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Bérlési napok száma:</Typography>
                                    <Typography>{days} nap</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Napi díj:</Typography>
                                    <Typography>{dailyPrice.toLocaleString()} Ft</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, gap: 4 }}>
                                    <Typography variant="h6" fontWeight={700}>ÖSSZESEN: </Typography>
                                    <Typography variant="h6" fontWeight={700}>
                                        {totalAmount.toLocaleString()} Ft
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 6, display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={() => window.print()}
                    >
                        Nyomtatás
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<ReceiptIcon />}
                        onClick={handleClick}
                    >
                        Számla kiállítása és lezárás
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Invoice;