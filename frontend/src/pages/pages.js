import React from "react";

const Home = React.lazy(() => import("./Home"));
const Register = React.lazy(() => import("./Register"));
const Profile = React.lazy(() => import("./Profile"));
const Cars = React.lazy(() => import("./Cars"));
const CarDetails = React.lazy(() => import("./CarDetails"));

export const pagesForPublic = [
  {
    name: "Kezdőlap",
    path: "/",
    component: <Home />,
    showInNavbar: true
  },
  {
    name: "Regisztáció",
    path: "/register",
    component: <Register />,
    showInNavbar: true

  },
  {
    name: "Autók",
    path: "/cars",
    component: <Cars />,
    showInNavbar: true

  },
  {
    name: "Autó részletek",
    path: "/model/:carId",
    component: <CarDetails />,
    showInNavbar: false
  },
];


export const pagesForAuthenticatedOnly = [
  {
    name: "Profil",
    path: "/profile",
    component: <Profile />,
    showInNavbar: true

  }


];
