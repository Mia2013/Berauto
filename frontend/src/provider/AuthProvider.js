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
        } catch (error) {
            console.error("Token decoding error:", error);
            setAlert({ message: "Hiba történt!", severity: "error" });
        }
    };

    const logIn = (resToken) => {
        setToken(resToken);
        decodeToken(resToken);
        localStorage.setItem("berauto_token", resToken);
        instance.defaults.headers.common["Authorization"] = `Bearer ${resToken}`;
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
            console.log(token)
            logIn(token);
        }
         else {
            localStorage.setItem("berauto_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTU0LCJ1c2VybmFtZSI6InVzZXJfamFub3MiLCJlbWFpbCI6Imphbm9zQG1haWwuaHUiLCJyb2xlIjoiVVNFUiIsImZpcnN0TmFtZSI6Ik9zendlbiIsImxhc3ROYW1lIjoiSsOhbm9zIiwicGhvbmUiOiIrMzY3MDk4NzY1NDMiLCJhZGRyZXNzIjoiNDAwMCBEZWJyZWNlbiwgUGl0YmFzIHUuIDUuIiwiZHJpdmluZ0xpY2VuY2UiOiJLTDk4NzY1NCIsImlhdCI6MTcxMzYwOTg3OSwiZXhwIjoyMTEzNjA5ODc5fQ.dummy_signature");
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