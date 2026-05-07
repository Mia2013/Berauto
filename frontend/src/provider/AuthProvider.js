import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { instance, postData, putData, endpoints } from "../API/apiCalls";
import { ROLES } from "../constants/constants";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("berauto_token") || "");
    const [user, setUser]   = useState({ role: ROLES.GUEST });
    const [alert, setAlert] = useState();
    const navigate = useNavigate();

    const { isAdmin, isUgyintezo, isUser, isAuthenticated } = useMemo(() => ({
        isAdmin:         user?.role === ROLES.ADMIN,
        isUgyintezo:     user?.role === ROLES.UGYINTEZO,
        isUser:          user?.role === ROLES.USER,
        isAuthenticated: !!token
    }), [user, token]);

    // Map backend role name ("Admin","Officer","Client") to frontend ROLES constant
    const mapRole = (roleName) => {
        if (!roleName) return ROLES.GUEST;
        const lower = roleName.toLowerCase();
        if (lower === "admin")   return ROLES.ADMIN;
        if (lower === "officer") return ROLES.UGYINTEZO;
        if (lower === "client")  return ROLES.USER;
        return ROLES.GUEST;
    };

    const setupSession = (activeToken, name, role) => {
        const mappedRole = mapRole(role);
        setToken(activeToken);
        setUser({ name, role: mappedRole });
        localStorage.setItem("berauto_token", activeToken);
        localStorage.setItem("berauto_name", name);
        localStorage.setItem("berauto_role", role);
        instance.defaults.headers.common["Authorization"] = `Bearer ${activeToken}`;
    };

    const logIn = (email, password) => {
        postData(endpoints.loginUser, { email, password })
            .then(data => {
                // data = { token, expires, name, role } — from AuthResponseDto
                setupSession(data.token, data.name, data.role);
                setAlert({ message: "Sikeres bejelentkezés!", severity: "success" });
                navigate("/");
            })
            .catch(error => setAlert({ message: error.message || "Hiba a bejelentkezés során!", severity: "error" }));
    };

    const register = (formData) => {
        // Backend RegisterDto only needs: name, email, password
        const payload = {
            name:     `${formData.lastName} ${formData.firstName}`.trim(),
            email:    formData.email,
            password: formData.password,
        };
        postData(endpoints.registerUser, payload)
            .then(() => {
                setAlert({ message: "Sikeres regisztráció!", severity: "success" });
                navigate("/");
            })
            .catch(e => setAlert({ message: e.message || "Hiba a regisztráció során!", severity: "error" }));
    };

    const updateUser = (formData) => {
        // Backend UpdateUserDto: password, phone, address, drivingLicence (all nullable)
        const payload = {
            password:       formData.password       || null,
            phone:          formData.phone          || null,
            address:        formData.address        || null,
            drivingLicence: formData.drivingLicence || null,
        };
        putData(endpoints.updateUser, payload)
            .then(() => {
                setAlert({ message: "Profil sikeresen frissítve!", severity: "success" });
            })
            .catch(error => setAlert({ message: error.message || "Hiba a frissítés során!", severity: "error" }));
    };

    const logOut = () => {
        setToken("");
        localStorage.removeItem("berauto_token");
        localStorage.removeItem("berauto_name");
        localStorage.removeItem("berauto_role");
        delete instance.defaults.headers.common["Authorization"];
        setUser({ role: ROLES.GUEST });
        navigate("/");
    };

    // Restore session on page refresh
    useEffect(() => {
        const savedToken = localStorage.getItem("berauto_token");
        const savedName  = localStorage.getItem("berauto_name");
        const savedRole  = localStorage.getItem("berauto_role");
        if (savedToken && savedName && savedRole) {
            setupSession(savedToken, savedName, savedRole);
        }
        // eslint-disable-next-line
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
