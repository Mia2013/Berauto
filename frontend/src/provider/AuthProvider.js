import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { instance } from "../API/apiCalls";
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


    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
            return decoded;
        } catch (error) {
            setAlert({ message: "Hiba történt!", severity: "error" });
        }
    };

    const logIn = (res) => {
        setToken(res.token);
        decodeToken(res.token);
        localStorage.setItem("berauto_token", res.token);
        instance.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
    };

    const logOut = () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("berauto_token");
        delete instance.defaults.headers.common["Authorization"];
        navigate("/");
    };

    useEffect(() => {
        if (token) {
            decodeToken(token);
            instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, [token]);



    return (
        <AuthContext.Provider value={{
            token,
            user,
            isAdmin,
            isUgyintezo,
            isUser,
            isAuthenticated,
            logIn,
            logOut,
            alert,
            setAlert
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};