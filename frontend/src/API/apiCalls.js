import axios from "axios";

export const endpoints = {
    login: "login",
    register: "register",
    cars: "cars",
    rents: "rents",
    profile: "profile",
    addNewCar: "add-new-car",
    updateCarRent: "update-car-rent",
    getInvoice: "get-invoice"
}

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



