import React from "react";

const Home = React.lazy(() => import("./Home"));
const Register = React.lazy(() => import("./Register"));
const Profile = React.lazy(() => import("./Profile"));
const Cars = React.lazy(() => import("./Cars"));
  
export const pagesForPublic = [
  {
    name: "Kezdőlap",
    path: "/",
    component: <Home />,
  },
    {
    name: "Regisztáció",
    path: "/register",
    component: <Register />,
   },
    {
    name: "Autók",
    path: "/cars",
    component: <Cars />,
   },

];


export const pagesForAuthenticatedOnly = [
  {
    name: "Profil",
    path: "/profile",
    component: <Profile />,
   }


];
