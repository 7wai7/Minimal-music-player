import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type UserDTO from "../types/user";
import { fetchLogout, fetchMe } from "../API/auth";
import { useNavigate } from "react-router-dom";

type UserContextType = {
    user: UserDTO | null;
    setUser: (user: UserDTO | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    logout: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const navigate = useNavigate();

    const logout = () => {
        fetchLogout()
            .then(() => {
                setUser(null);
                navigate('/');
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchMe()
            .then((user) => {
                setUser(user);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserContext");
    return context;
};
export { UserContext };
