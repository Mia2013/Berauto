import { useContext, createContext, useState } from "react";
import { getData, endpoints } from "../API/apiCalls";
const CarRentContext = createContext();

const CarRentProvider = ({ children }) => {
    const [cars, setCars] = useState([
        {
            id: 1,
            registrationName: "ABC-123",
            brand: "Toyota",
            modell: "Rav4",
            fuel: "Benzin",
            img: "ToyotaRav4.jpg"
        },
        {
            id: 2,
            registrationName: "XYZ-987",
            brand: "Tesla",
            modell: "Model 3",
            fuel: "Elektromos",
            img: "TeslaModel3.jpg"

        },
        {
            id: 3,
            registrationName: "QWE-456",
            brand: "Volkswagen",
            modell: "Golf",
            fuel: "Dízel",
            img: "VolkswagenGolf.jpg"

        },
        {
            id: 4,
            registrationName: "RUN-001",
            brand: "Ford",
            modell: "Focus",
            fuel: "Benzin",
            img: "FordFocus.jpg"

        },
        {
            id: 5,
            registrationName: "ECO-100",
            brand: "Hyundai",
            modell: "Ioniq",
            fuel: "Elektromos",
            img: "HyundaiIoniq.jpg"
        },
        {
            id: 6,
            registrationName: "XML-136",
            brand: "BMW",
            modell: "2",
            fuel: "Benzin",
            img: "BMW2"

        },
    ]);
    const [alert, setAlert] = useState();
    const [rents, setRents] = useState([]);

    const getCars = async () => {
        getData(endpoints.cars)
            .then(data => setCars(data))
            .catch((e) => setAlert({ message: "Hiba történt az oldal betöltése közben!", severity: "error" }))
    }
    const getRents = async () => {
        getData("purchases")
            .then(data => setRents(data))
            .catch((e) => setAlert({ message: "Hiba történt a foglalások betöltése közben!", severity: "error" }))
    }

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
                setAlert
            }}>
            {children}
        </CarRentContext.Provider>
    );

};

export default CarRentProvider;

export const useCarRent = () => {
    return useContext(CarRentContext);
};