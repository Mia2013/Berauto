import axios from "axios";

const BASE_URL = "https://localhost:7011/api";

export const endpoints = {
    adminRegister: "Auth/admin-register",
    carAllAdmin: `/Cars/all`,
    adminuserUpdateById: (id) => `Users/${id}`,
    auditLog: "AuditLog",
    carActivate: (id) => `Cars/${id}/activate`,
    carAwaitingInspection: "Cars/awaiting-inspection",
    carById: (id) => `Cars/${id}`,
    carDelById: (id) => `Cars/${id}`,
    carDiesel: "Cars/diesel",
    carMaintenance: (id) => `Cars/${id}/maintenance`,
    cars: "Cars",
    carPetrol: "Cars/petrol",
    carRented: "Cars/rented",
    carRentable: "Cars/rentable",
    carServiced: "Cars/serviced",
    login: "Auth/login",
    myRentals: "Rentals/mine",
    myReceipts: "Receipts/mine",
    register: "Auth/register",
    receiptById: (id) => `Receipts/${id}`,
    receiptByRental: (rentalId) => `Receipts/by-rental/${rentalId}`,
    rentalById: (id) => `Rentals/${id}`,
    rentals: "Rentals",
    rentalsByUserId: (id) => `Rentals/user/${id}`,
    rentalCancel: (id) => `Rentals/${id}/cancel`,
    rentalsGuest: "Rentals/guest",
    rentalHandover: (id) => `Rentals/${id}/handover`,
    rentalInspect: (id) => `Rentals/${id}/inspect`,
    rentalReturn: (id) => `Rentals/${id}/return`,
    usersMe: "Users/me",
    users: "Users",
    userDelById: (id) => `Users/${id}`,
    userUpdateById:  (id) => `Users/${id}`,
    validateRegnum: (id) => `cars/validate-regnum/${id}`,

};

export const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


const initialToken = localStorage.getItem("berauto_token");
if (initialToken) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

const extractError = (error) => {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    return data?.message || data?.title || error?.message || "Ismeretlen hiba történt.";
};

export const getData = async (endpoint, query = {}) => {
    try {
        const result = await instance.get(endpoint, { params: query });
        return result.data;
    } catch (error) {
        throw new Error(extractError(error));
    }
};

export const postData = async (endpoint, data) => {
    try {
        const result = await instance.post(endpoint, data);
        return result.data;
    } catch (error) {
        throw new Error(extractError(error));
    }
};

export const putData = async (endpoint, data) => {
    try {
        const result = await instance.put(endpoint, data);
        return result.data;
    } catch (error) {
        throw new Error(extractError(error));
    }
};

export const deleteData = async (endpoint, query) => {
    try {
        const result = await instance.delete(endpoint, { params: query });
        return result.data;
    } catch (error) {
        throw new Error(extractError(error));
    }
};
