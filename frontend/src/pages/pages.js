import React from "react";
import { ROLES } from "../constants/constants";

const Home = React.lazy(() => import("./Home"));
const Cars = React.lazy(() => import("./Cars"));
const Login = React.lazy(() => import("./Login"));
const Register = React.lazy(() => import("./Register"));
const MyRentals = React.lazy(() => import("./MyRentals"));
const MyReceipts = React.lazy(() => import("./MyReceipts"));
const Profile = React.lazy(() => import("./Profile"));
const AdminRentals = React.lazy(() => import("./AdminRentals"));
const AdminCars = React.lazy(() => import("./AdminCars"));
const AdminAuditLog = React.lazy(() => import("./AdminAuditLog"));


export const pagesForPublic = [
    { name: "Kezdőlap", path: "/", component: <Home />, hideWhenAuthed: false },
    { name: "Autók", path: "/cars", component: <Cars />, hideWhenAuthed: false },
    { name: "Bejelentkezés", path: "/login", component: <Login />, hideWhenAuthed: true },
    { name: "Regisztráció", path: "/register", component: <Register />, hideWhenAuthed: true },
];

export const pagesForAuthenticatedOnly = [
    { name: "Bérléseim", path: "/my-rentals", component: <MyRentals />, allowedRoles: null },
    { name: "Bizonylataim", path: "/receipts", component: <MyReceipts />, allowedRoles: null },
    { name: "Profilom", path: "/profile", component: <Profile />, allowedRoles: null },
];

export const pagesForStaff = [
    {
        name: "Bérlések kezelése",
        path: "/admin/rentals",
        component: <AdminRentals />,
        allowedRoles: [ROLES.ADMIN, ROLES.UGYINTEZO],
    },
    {
        name: "Autók kezelése",
        path: "/admin/cars",
        component: <AdminCars />,
        allowedRoles: [ROLES.ADMIN, ROLES.UGYINTEZO],
    },
    {
        name: "Napló",
        path: "/admin/audit-log",
        component: <AdminAuditLog />,
        allowedRoles: [ROLES.ADMIN, ROLES.UGYINTEZO],
    },
];
