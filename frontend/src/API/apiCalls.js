import axios from "axios";

export const endpoints = {
    // Auth (AuthController)
    registerUser: "Auth/register",
    loginUser:    "Auth/login",

    // User (UserController)
    getUser:    "User",
    updateUser: "User",

    // Car (CarController)
    getCars:   "Car",
    getCar:    (id) => `Car/${id}`,
    addCar:    "Car",
    updateCar: (id) => `Car/${id}`,
    deleteCar: (id) => `Car/${id}`,

    // Rental (RentalController)
    getAllRents:      "Rental",
    getRent:         (id) => `Rental/${id}`,
    addNewRent:      "Rental",
    confirmHandover: (id) => `Rental/${id}/handover`,
    confirmReturn:   (id) => `Rental/${id}/return`,
    deleteRental:    (id) => `Rental/${id}`,
};

export const instance = axios.create({
    baseURL: "https://localhost:7011/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach JWT token to every request
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("berauto_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getData = async (endpoint, query = {}) => {
    try {
        const result = await instance.get(`/${endpoint}`, { params: query });
        return result.data;
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        throw new Error(errorMessage);
    }
};

export const postData = async (endpoint, data) => {
    try {
        const result = await instance.post(`/${endpoint}`, data);
        return result.data;
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        throw new Error(errorMessage);
    }
};

export const putData = async (endpoint, data) => {
    try {
        const result = await instance.put(`/${endpoint}`, data);
        return result.data;
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        throw new Error(errorMessage);
    }
};

export const deleteData = async (endpoint) => {
    try {
        const result = await instance.delete(`/${endpoint}`);
        return result.data;
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        throw new Error(errorMessage);
    }
};
