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
