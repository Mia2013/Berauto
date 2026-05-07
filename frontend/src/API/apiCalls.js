    import axios from "axios";

    export const controllers = {
        AUTH: "Auth",
        CARS: "Car",
        RENTALS: "Rental",
        USER: "User",
    };

    export const endpoints = {
        registerUser: `${controllers.AUTH}/register`,
        loginUser: `${controllers.AUTH}/login`,
        updateUser: `${controllers.USER}/update`,
        getUser: `${controllers.USER}/getuser`,

        getCars: `${controllers.CARS}`,
        updateCar: `${controllers.CARS}`,
        deleteCar: `${controllers.CARS}/deletecar`,
        addCar: `${controllers.CARS}/addcar`,

        getAllRents: `${controllers.RENTALS}`,
        updateRent: `${controllers.RENTALS}/updaterent`,
        invoiceRent: `${controllers.RENTALS}/invoicerent`,
        getRentsByCar: `${controllers.RENTALS}/getrents`,
        addNewRent: `${controllers.RENTALS}`,
        handoverRent:  `${controllers.RENTALS}/handover`,
        returnRent: `${controllers.RENTALS}/return`,
        
    };

    export const instance = axios.create({
        baseURL: "http://localhost:5158/api/",
        headers: {
            "Content-Type": "application/json",
        },
    });

    export const getData = async (endpoint, query = {}) => {
        try {
            const result = await instance.get(endpoint, { params: query });
            return result.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    };

    export const postData = async (endpoint, data) => {
        try {
            const result = await instance.post(endpoint, data);
            return result.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    };

    export const putData = async (endpoint, data) => {
        try {
            const result = await instance.put(endpoint, data);
            return result.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    };

    export const deleteData = async (endpoint, query) => {
        try {
            const result = await instance.delete(endpoint, { params: query });
            return result.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    };



