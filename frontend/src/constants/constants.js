// Must match the seeded Role.Name values in the backend (Migrations/InitBerautoState).
export const ROLES = {
    ADMIN: "Admin",
    UGYINTEZO: "Officer",
    USER: "Client",
};

// CarStatus.Id values, matching the backend's CarStatusId constants.
export const CAR_STATUS = {
    AVAILABLE: 1,
    RESERVED: 2,
    RENTED: 3,
    AWAITING_INSPECTION: 4,
    MAINTENANCE: 5,
};

export const CAR_STATUS_LABEL = {
    [CAR_STATUS.AVAILABLE]: "Elérhető",
    [CAR_STATUS.RESERVED]: "Foglalt",
    [CAR_STATUS.RENTED]: "Bérelt",
    [CAR_STATUS.AWAITING_INSPECTION]: "Ellenőrzésre vár",
    [CAR_STATUS.MAINTENANCE]: "Szervizben",
};

// RentalStatus.Id values.
export const RENTAL_STATUS = {
    CONFIRMED: 1,
    ACTIVE: 2,
    RETURNED: 3,
    COMPLETED: 4,
    CANCELLED: 5,
};

export const RENTAL_STATUS_LABEL = {
    [RENTAL_STATUS.CONFIRMED]: "Megerősítve",
    [RENTAL_STATUS.ACTIVE]: "Folyamatban",
    [RENTAL_STATUS.RETURNED]: "Visszahozva",
    [RENTAL_STATUS.COMPLETED]: "Lezárva",
    [RENTAL_STATUS.CANCELLED]: "Lemondva",
};


export const ENTITY_TYPES = ["", "Car", "Rental", "User", "CarStatus", "RentalStatus", "Fuel", "Role", "AuditLog"];
export const ACTIONS = ["", "Insert", "Update", "Delete"];

export const FUEL_FILTERS = [
    { key: "all", label: "Mind", id: -1 },
    { key: "Petrol", label: "Benzin", id: 1 },
    { key: "Diesel", label: "Dízel", id: 2, },
    { key: "Hybrid", label: "Hibrid", id: 3, },
    { key: "Electric", label: "Elektromos", id: 4, },
];

export const CLOUD_NAME = "dtk9xrtrq";
export const UPLOAD_PRESET = "berauto_preset";


export const EMPTY_GUEST = {
    name: "",
    email: "",
    phone: "",
    address: "",
    drivingLicence: "",
};