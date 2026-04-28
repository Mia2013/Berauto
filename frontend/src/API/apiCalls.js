import axios from "axios";
// src/API/apiCalls.js

export const controllers = {
    AUTH: "Auth",
    CARS: "Cars",
    RENTALS: "Rentals"
};

export const endpoints = {
    registerUser: `${controllers.AUTH}/register`,
    loginUser: `${controllers.AUTH}/login`,
    updateUser: `${controllers.AUTH}/update`,
    getUser: `${controllers.AUTH}/getuser`,

    getCars: `${controllers.CARS}/getall`,
    updateCar: `${controllers.CARS}/updatecar`,
    deleteCar: `${controllers.CARS}/deletecar`,
    addCar: `${controllers.CARS}/addcar`,

    getAllRents: `${controllers.RENTALS}/getall`,
    updateRent: `${controllers.RENTALS}/updaterent`,
    invoiceRent: `${controllers.RENTALS}/invoicerent`,

};

export const instance = axios.create({
    baseURL: "https://localhost:7011",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getData = async (endpoint, query = {}) => {
    try {
        const result = await instance.get(`/${endpoint}`, { params: query });
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
        const result = await instance.delete(`/${endpoint}`, { params: query });
        return result.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
    }
};



