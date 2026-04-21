import { useContext, createContext, useState } from "react";
import { getData, endpoints, postData } from "../API/apiCalls";
const CarRentContext = createContext();

const CarRentProvider = ({ children }) => {
    const [cars, setCars] = useState([
        { id: 1, registrationName: "ABC-123", brand: "Toyota", model: "Rav4", fuel: "Benzin", img: "ToyotaRav4.jpg", year: "2022" },
        { id: 2, registrationName: "XYZ-987", brand: "Tesla", model: "Model 3", fuel: "Elektromos", img: "TeslaModel3.jpg", year: "2024" },
        { id: 3, registrationName: "XML-136", brand: "BMW", model: "2", fuel: "Benzin", img: "BMW2.jpg", year: "2023" },
        { id: 4, registrationName: "RUN-001", brand: "Ford", model: "Focus", fuel: "Benzin", img: "FordFocus.jpg", year: "2021" },
        { id: 5, registrationName: "ECO-100", brand: "Hyundai", model: "Ioniq", fuel: "Elektromos", img: "HyundaiIoniq.jpg", year: "2025" },
        { id: 6, registrationName: "QWE-456", brand: "Volkswagen", model: "Golf", fuel: "Dízel", img: "VolkswagenGolf.jpg", year: "2020" },
    ]);
    
    const [alert, setAlert] = useState();
    const [carDetails, setCarDetails] = useState(null);
    const [rents, setRents] = useState([
        {
            id: 101,
            user: { firstName: "János", lastName: "Kovács", email: "kovacs.janos@email.hu", phone: "+36201234567" },
            car: { brand: "Toyota", model: "Rav4", registrationName: "ABC-123" },
            startDate: "2024.04.20", endDate: "2024.04.25", status: "PENDING"
        },
        {
            id: 102,
            user: { firstName: "Petra", lastName: "Nagy", email: "nagy.petra@teszt.hu", phone: "+36309876543" },
            car: { brand: "Tesla", model: "Model 3", registrationName: "XYZ-987" },
            startDate: "2024.04.22", endDate: "2024.04.28", status: "APPROVED"
        },
        {
            id: 103,
            user: { firstName: "Béla", lastName: "Szabó", email: "szabo.bela@citromail.hu", phone: "+36701112233" },
            car: { brand: "BMW", model: "2", registrationName: "XML-136" },
            startDate: "2024.04.15", endDate: "2024.04.20", status: "IN_PROGRESS"
        },
        {
            id: 104,
            user: { firstName: "Erika", lastName: "Tóth", email: "toth.erika@pro.hu", phone: "+36205556677" },
            car: { brand: "Volkswagen", model: "Golf", registrationName: "QWE-456" },
            startDate: "2024.04.10", endDate: "2024.04.14", status: "RETURNED"
        }
    ]);

    const getCars = async (query = {}) => {
        getData(endpoints.cars, query)
            .then(data => setCars(data))
            .catch((e) => setAlert({ message: "Hiba történt az oldal betöltése közben!", severity: "error" }))
    }
    const getRents = async () => {
        getData(endpoints.rents)
            .then(data => setRents(data))
            .catch((e) => setAlert({ message: "Hiba történt a foglalások betöltése közben!", severity: "error" }))
    }

    const getCarDetails = async (id) => {
        const query = { carId: id };
        getData(endpoints.cars, query)
            .then(data => setCarDetails(data))
            .catch((e) => setAlert({ message: "Hiba történt az autó adatainak betöltése közben!", severity: "error" }))
    }

    const updateRentStatus = async (rentId, newStatus) => {
        postData(endpoints.updateCarRent, { rentId, status: newStatus })
            .then(() => {
                setAlert({ message: "Státusz sikeresen frissítve!", severity: "success" });
                getRents();
            })
            .catch(() => setAlert({ message: "Hiba a frissítés során!", severity: "error" }));
    };

    const generateInvoice = async (rentId) => {
        const query = { rentId };
        getData(endpoints.getInvoice, query)
            .then(data => setCars(data))
            .catch((e) => setAlert({ message: "Hiba történt a számla kiállítása közben!", severity: "error" }))
    };

    return (
        <CarRentContext.Provider
            value={{
                cars,
                setCars,
                getCars,
                rents,
                setRents,
                getRents,
                alert,
                setAlert,
                getCarDetails,
                carDetails,
                setCarDetails,
                updateRentStatus,
                generateInvoice

            }}>
            {children}
        </CarRentContext.Provider>
    );

};

export default CarRentProvider;

export const useCarRent = () => {
    return useContext(CarRentContext);
};