import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { instance, postData, putData, endpoints } from "../API/apiCalls";
import { ROLES } from "../constants/constants";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("berauto_token") || "");
    const [user, setUser] = useState({ role: ROLES.GUEST });
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

    const setupSession = (activeToken) => {
        setToken(activeToken);
        localStorage.setItem("berauto_token", activeToken);
        instance.defaults.headers.common["Authorization"] = `Bearer ${activeToken}`;
        decodeToken(activeToken);
    };

    const logIn = (email, password) => {
        postData(endpoints.loginUser, { email, password })
            .then(data => {
                setupSession(data.token);
                setAlert({ message: "Sikeres bejelentkezés!", severity: "success" });
            })
            .catch(error => setAlert({ message: error.message || "Hiba a bejelentkezés során!", severity: "error" }));
    };

    const register = (formData) => {
        postData(endpoints.registerUser, formData)
            .then(() => {
                setAlert({ message: "Sikeres regisztráció!", severity: "success" });
                navigate("/login");
            })
            .catch(e => setAlert({ message: e.message || "Hiba a regisztráció során!", severity: "error" }));
    };

    const updateUser = (formData) => {
        putData(`${endpoints.updateUser}/${user.id}`, formData)
            .then(updatedUser => {
                setUser(prev => ({ ...prev, ...updatedUser }));
                setAlert({ message: "Profil sikeresen frissítve!", severity: "success" });
            })
            .catch(error => setAlert({ message: error.message || "Hiba a frissítés során!", severity: "error" }));
    };

    const logOut = () => {
        setToken("");
        localStorage.removeItem("berauto_token");
        delete instance.defaults.headers.common["Authorization"];
        setUser({ role: ROLES.GUEST });
        navigate("/");
    };

    const testToken = {
        ugyintezo: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoidWd5X2VyaWthIiwiZW1haWwiOiJlcmlrYUBiZXJhdXRvLmh1Iiwicm9sZSI6InVneWludGV6byIsImZpcnN0TmFtZSI6IkVyaWthIiwibGFzdE5hbWUiOiJVZ3lpbnRlem8iLCJpYXQiOjE3MTM2MDk4NzksImV4cCI6MjExMzYwOTg3OX0.dummy_signature",
        admin: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbl9wYWwiLCJlbWFpbCI6ImFkbWluQGJlcmF1dG8uaHUiLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJQw6FsIiwibGFzdE5hbWUiOiJBZG1pbiIsImlhdCI6MTcxMzYwOTg3OSwiZXhwIjoyMTEzNjA5ODc5fQ.dummy_signature",
        user: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTU0LCJ1c2VybmFtZSI6InVzZXJfamFub3MiLCJlbWFpbCI6Imphbm9zQG1haWwuaHUiLCJyb2xlIjoidXNlciIsImZpcnN0TmFtZSI6Ikphbm9zIiwibGFzdE5hbWUiOiJLb3bDoWNzIiwicGhvbmUiOiIrMzYyMDEyMzQ1NjciLCJhZGRyZXNzIjoiNDAwMCBEZWJyZWNlbiwgVGVzenQgdS4gMS4iLCJkcml2aW5nTGljZW5jZSI6IktMOTg3NjU0IiwiaWF0IjoxNzEzNjA5ODc5LCJleHAiOjIxMTM2MDk4Nzl9.dummy_signature"
    };

    // useEffect(() => {
    //     if (token) {
    //         setupSession(token);
    //     } 
    //     // eslint-disable-next-line 
    // }, []);

     useEffect(() => {
        setupSession(testToken.ugyintezo);
    }, []);

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