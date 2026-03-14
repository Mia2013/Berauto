import { useContext, createContext, useState } from "react";
import { getData, endpoints } from "../API/apiCalls";
const CarRentContext = createContext();

const CarRentProvider = ({ children }) => {
    const [cars, setCars] = useState([]);
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