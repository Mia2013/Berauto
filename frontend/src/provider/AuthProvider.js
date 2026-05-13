import { useContext, createContext, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { instance } from "../API/apiCalls";
import { ROLES } from "../constants/constants";

const AuthContext = createContext(null);
const TOKEN_KEY = "berauto_token";
const USER_KEY = "berauto_user";

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem(USER_KEY);
        try {
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const navigate = useNavigate();

    const { isAdmin, isUgyintezo, isUser, isStaff, isAuthenticated } = useMemo(() => {
        const role = user?.role;
        const admin = role === ROLES.ADMIN;
        const officer = role === ROLES.UGYINTEZO;
        return {
            isAdmin: admin,
            isUgyintezo: officer,
            isUser: role === ROLES.USER,
            isStaff: admin || officer,
            isAuthenticated: !!token,
        };
    }, [user, token]);

    const logIn = useCallback(({ token: newToken, user: newUser }) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        instance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }, []);

    const logOut = useCallback(() => {
        setToken("");
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        delete instance.defaults.headers.common["Authorization"];
        navigate("/");
    }, [navigate]);

    // Ensure axios has the Authorization header if we restored a token.
    useEffect(() => {
        if (token) {
            instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 401 interceptor: if a request comes back unauthorized (token expired etc.),
    // clear local auth state and redirect to login.
    useEffect(() => {
        const interceptorId = instance.interceptors.response.use(
            (res) => res,
            (err) => {
                const status = err.response?.status;
                const url = err.config?.url || "";
                // Don't auto-logout on a failed login attempt itself.
                if (status === 401 && !url.includes("Auth/login") && !url.includes("Auth/register")) {
                    logOut();
                }
                return Promise.reject(err);
            }
        );
        return () => instance.interceptors.response.eject(interceptorId);
    }, [logOut]);

    return (
        <AuthContext.Provider value={{
            token,
            user,
            isAdmin,
            isUgyintezo,
            isUser,
            isStaff,
            isAuthenticated,
            logIn,
            logOut,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>.");
    }
    return ctx;
};
