import { useContext, createContext, useState } from "react";
import { getData, endpoints, postData, putData, deleteData } from "../API/apiCalls";
const CarRentContext = createContext();

const CarRentProvider = ({ children }) => {
    const [cars, setCars] = useState([
        { id: 1, plate: "ABC-123", brand: "Toyota", model: "Rav4", fuel: "Benzin", img: "ToyotaRav4.jpg", year: "2022", miles: 5000, isRentable: true, fee: "50000" },
        { id: 2, plate: "XYZ-987", brand: "Tesla", model: "Model 3", fuel: "Elektromos", img: "TeslaModel3.jpg", year: "2024", miles: 45000, isRentable: true, fee: "50000" },
        { id: 3, plate: "XML-136", brand: "BMW", model: "2", fuel: "Benzin", img: "BMW2.jpg", year: "2023", miles: 10000, isRentable: true, fee: "50000" },
        { id: 4, plate: "RUN-001", brand: "Ford", model: "Focus", fuel: "Benzin", img: "FordFocus.jpg", year: "2021", miles: 145000, isRentable: true, fee: "50000" },
        { id: 5, plate: "ECO-100", brand: "Hyundai", model: "Ioniq", fuel: "Elektromos", img: "HyundaiIoniq.jpg", year: "2025", miles: 1500, isRentable: true, fee: "50000" },
        { id: 6, plate: "QWE-456", brand: "Volkswagen", model: "Golf", fuel: "Dízel", img: "VolkswagenGolf.jpg", year: "2020", miles: 245000, isRentable: false, fee: "50000" },
    ]);

    const [alert, setAlert] = useState();
    const [carDetails, setCarDetails] = useState(null);
    const [rentsById, setRentsById] = useState([]);
    const [rents, setRents] = useState([
        {
            id: 101,
            user: { firstName: "János", lastName: "Kovács", email: "kovacs.janos@email.hu", phone: "+36201234567" },
            car: { brand: "Toyota", model: "Rav4", plate: "ABC-123" },
            startDate: "2024.04.20", endDate: "2024.04.25", status: "PENDING"
        },
        {
            id: 102,
            user: { firstName: "Petra", lastName: "Nagy", email: "nagy.petra@teszt.hu", phone: "+36309876543" },
            car: { brand: "Tesla", model: "Model 3", plate: "XYZ-987" },
            startDate: "2024.04.22", endDate: "2024.04.28", status: "APPROVED"
        },
        {
            id: 103,
            user: { firstName: "Béla", lastName: "Szabó", email: "szabo.bela@citromail.hu", phone: "+36701112233" },
            car: { brand: "BMW", model: "2", plate: "XML-136" },
            startDate: "2024.04.15", endDate: "2024.04.20", status: "IN_PROGRESS"
        },
        {
            id: 104,
            user: { firstName: "Erika", lastName: "Tóth", email: "toth.erika@pro.hu", phone: "+36205556677" },
            car: { brand: "Volkswagen", model: "Golf", plate: "QWE-456" },
            startDate: "2024.04.10", endDate: "2024.04.14", status: "RETURNED"
        }
    ]);

    const getCars = async (query = {}) => {
        getData(endpoints.cars, query)
            .then(data => setCars(data))
            .catch((e) => setAlert({ message: "Hiba történt az oldal betöltése közben!", severity: "error" }))
    }

    const getRents = async () => {
        getData(endpoints.getAllRents)
            .then(data => setRents(data))
            .catch((e) => setAlert({ message: "Hiba történt a foglalások betöltése közben!", severity: "error" }))
    }
    const getRentsByCarId = async (carId) => {
        const query = {carId};
        getData(endpoints.getRentsByCar, query)
            .then(data => setRents(data))
            .catch((e) => setAlert({ message: "Hiba történt a foglalások betöltése közben!", severity: "error" }))
    }

    const getCarDetails = async (id) => {
        const query = { carId: id };
        getData(endpoints.updateCar, query)
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
        getData(endpoints.invoiceRent, query)
            .then(data => setCars(data))
            .catch((e) => setAlert({ message: "Hiba történt a számla kiállítása közben!", severity: "error" }))
    };

    const updateCar = async (id, updatedFields) => {
        putData(`${endpoints.updateCar}/${id}`, updatedFields).then(() => {
            setAlert({ message: "Az autó adatai sikeresen frissítve!", severity: "success" });
            getCars();
        })
            .catch((e) => {
                setAlert({ message: "Hiba történt a frissítés során!", severity: "error" });
            });
    }

    const deleteCar = async (id) => {
        deleteData(`${endpoints.deleteCar}/${id}`)
            .then(() => {
                setAlert({ message: "Autó sikeresen törölve!", severity: "success" });
                getCars();
            })
            .catch(() => setAlert({ message: "Hiba a törlés során!", severity: "error" }));
    };

    const addCar = async (formData) => {
        postData(endpoints.addCar, formData)
            .then(() => {
                setAlert({ message: "Autó sikeresen hozzáadva!", severity: "success" });
                getRents();
            })
            .catch(() => setAlert({ message: "Hiba a hozzáadás során!", severity: "error" }));
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
                generateInvoice,
                updateCar,
                deleteCar,
                addCar,
                getRentsByCarId,
                setRentsById,
                rentsById
            }}>
            {children}
        </CarRentContext.Provider>
    );

};

export default CarRentProvider;

export const useCarRent = () => {
    return useContext(CarRentContext);
};