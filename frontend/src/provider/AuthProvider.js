// src/provider/AuthProvider.js
import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { instance, postData, putData, endpoints } from "../API/apiCalls";
import { ROLES } from "../constants/constants";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("berauto_token") || "");
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState();
    const navigate = useNavigate();

    const { isAdmin, isUgyintezo, isUser, isAuthenticated } = useMemo(() => ({
        isAdmin: user?.role === ROLES.ADMIN,
        isUgyintezo: user?.role === ROLES.UGYINTEZO,
        isUser: user?.role === ROLES.USER,
        isAuthenticated: !!token
    }), [user, token]);

    const decodeToken = (_token) => {
        try {
            const decoded = jwtDecode(_token);
            setUser(decoded);
            return decoded;
        } catch (error) {
            setAlert({ message: "Érvénytelen munkamenet!", severity: "error" });
            logOut();
        }
    };

    const logIn = async (email, password) => {
        try {
            const data = await postData(endpoints.auth.login, { email, password });
            const resToken = data.token;
            setToken(resToken);
            decodeToken(resToken);
            localStorage.setItem("berauto_token", resToken);
            instance.defaults.headers.common["Authorization"] = `Bearer ${resToken}`;
            setAlert({ message: "Sikeres bejelentkezés!", severity: "success" });
            navigate("/");
        } catch (error) {
            setAlert({ message: error.message || "Hiba a bejelentkezés során!", severity: "error" });
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            await postData(endpoints.auth.register, formData);
            setAlert({ message: "Sikeres regisztráció!", severity: "success" });
            navigate("/login"); // Vagy automatikus beléptetés
        } catch (error) {
            setAlert({ message: error.message || "Hiba a regisztráció során!", severity: "error" });
            throw error;
        }
    };

    const updateUser = async (formData) => {
        try {
            const updatedUser = await putData(`${endpoints.auth.profile}/${user.id}`, formData);
            // Frissítjük a lokális user állapotot is, hogy a UI azonnal változzon
            setUser(prev => ({ ...prev, ...updatedUser }));
            setAlert({ message: "Profil sikeresen frissítve!", severity: "success" });
        } catch (error) {
            setAlert({ message: error.message || "Hiba a frissítés során!", severity: "error" });
            throw error;
        }
    };

    const logOut = () => {
        setToken("");
        localStorage.removeItem("berauto_token");
        delete instance.defaults.headers.common["Authorization"];
        setUser({ role: ROLES.GUEST });
        navigate("/");
    };

    useEffect(() => {
        if (token) {
            instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            decodeToken(token);
        } else {
            setUser({ role: ROLES.GUEST });
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{
            token, user,
            isAdmin, isUgyintezo, isUser, isAuthenticated,
            logIn, logOut, register, updateUser, 
            alert, setAlert
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);