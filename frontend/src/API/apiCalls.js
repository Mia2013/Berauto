import axios from "axios";

// Matches the backend's HTTPS profile in Properties/launchSettings.json.
// All endpoints are scoped under /api by the controllers' [Route("api/[controller]")].
const BASE_URL = "https://localhost:7011/api";

export const endpoints = {
    login: "Auth/login",
    register: "Auth/register",

    // Profile of the currently authenticated user (GET to load, PUT to update).
    usersMe: "Users/me",

    cars: "Cars",
    carRentable: "Cars/rentable",
    carPetrol: "Cars/petrol",
    carDiesel: "Cars/diesel",
    carRented: "Cars/rented",
    carAwaitingInspection: "Cars/awaiting-inspection",
    carServiced: "Cars/serviced",
    carById: (id) => `Cars/${id}`,
    carMaintenance: (id) => `Cars/${id}/maintenance`,
    carActivate: (id) => `Cars/${id}/activate`,

    rentals: "Rentals",
    rentalsGuest: "Rentals/guest",   // anonymous bookings — no JWT required
    myRentals: "Rentals/mine",
    rentalById: (id) => `Rentals/${id}`,
    rentalHandover: (id) => `Rentals/${id}/handover`,
    rentalReturn: (id) => `Rentals/${id}/return`,
    rentalInspect: (id) => `Rentals/${id}/inspect`,
    rentalCancel: (id) => `Rentals/${id}/cancel`,

    auditLog: "AuditLog",

    myReceipts: "Receipts/mine",
    receiptById: (id) => `Receipts/${id}`,
    receiptByRental: (rentalId) => `Receipts/by-rental/${rentalId}`,
};

export const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Initialise the Authorization header from localStorage so early API calls
// (e.g. on hard refresh) carry the token before AuthProvider has mounted.
const initialToken = localStorage.getItem("berauto_token");
if (initialToken) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

const extractError = (error) => {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    return data?.message || data?.title || error.message || "Ismeretlen hiba történt.";
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
