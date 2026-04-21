export const ROLES = {
    ADMIN: "admin",
    UGYINTEZO: "ugyintezo",
    USER: "user",
    GUEST: "guest"
};

export const RENT_STATUSES = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    IN_PROGRESS: "IN_PROGRESS",
    RETURNED: "RETURNED"

}

export const STATUS_UI = {
            [RENT_STATUSES.PENDING]: { label: "Igény leadva", color: "secondary" },
            [RENT_STATUSES.APPROVED]: { label: "Elfogadva", color: "success" },
            [RENT_STATUSES.IN_PROGRESS]: { label: "Átadva", color: "primary" },
            [RENT_STATUSES.RETURNED]: { label: "Visszahozva", color: "warning" },
            [RENT_STATUSES.CLOSED]: { label: "Lezárva", color: "success" },
            [RENT_STATUSES.REJECTED]: { label: "Elutasítva", color: "error" }
        };

