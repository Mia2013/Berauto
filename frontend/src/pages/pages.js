import React from "react";
import { ROLES } from "../constants/constants";

const Home = React.lazy(() => import("./Home"));
const Register = React.lazy(() => import("./Register"));
const Profile = React.lazy(() => import("./Profile"));
const Cars = React.lazy(() => import("./Cars"));
const CarDetails = React.lazy(() => import("./CarDetails"));
const ManageRentals = React.lazy(() => import("./ManageRentals"));
const Invoice = React.lazy(() => import("./Invoice"));
const Admin = React.lazy(() => import("./Admin"));

export const allPages = [
    {
        name: "Kezdőlap",
        path: "/",
        component: <Home />,
        showInNavbar: true,
        roles: [ROLES.GUEST, ROLES.USER, ROLES.ADMIN, ROLES.UGYINTEZO]
    },
    {
        name: "Regisztráció",
        path: "/register",
        component: <Register />,
        showInNavbar: true,
        roles: [ROLES.GUEST, ROLES.UGYINTEZO, ROLES.ADMIN]
    },
    {
        name: "Autók",
        path: "/cars",
        component: <Cars />,
        showInNavbar: true,
        roles: [ROLES.GUEST, ROLES.USER, ROLES.ADMIN, ROLES.UGYINTEZO]
    },
    {
        name: "Profil",
        path: "/profile",
        component: <Profile />,
        showInNavbar: true,
        roles: [ROLES.USER]
    },
    {
        name: "Autó részletek",
        path: "/model/:carId",
        component: <CarDetails />,
        showInNavbar: false,
        roles: [ROLES.GUEST, ROLES.USER, ROLES.ADMIN, ROLES.UGYINTEZO]
    },
    {
        name: "Bérlések",
        path: "/manage-rents",
        component: <ManageRentals />,
        showInNavbar: true,
        roles: [ROLES.UGYINTEZO, ROLES.ADMIN]
    },
    {
        name: "Számlázás",
        path: "/invoice",
        component: <Invoice />,
        showInNavbar: false,
        roles: [ROLES.UGYINTEZO, ROLES.ADMIN]
    },
    {
        name: "Flotta",
        path: "/admin",
        component: <Admin />,
        showInNavbar: true,
        roles: [ROLES.UGYINTEZO, ROLES.ADMIN]
    }
];