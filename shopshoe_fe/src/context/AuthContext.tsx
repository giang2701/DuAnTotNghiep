import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../interface/User";
import instance from "../api";

export interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAdmin: boolean;
    mappedPermissions: string[];
}
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [permissionsList, setPermissionsList] = useState([]);
    const nav = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const user = JSON.parse(localStorage.getItem("user") || "");
            setUser(user);
        }
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("favorites");
        setUser(user);
        // nav(user.role === "admin" ? "/admin" : "/");
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("favorites");
        setUser(null);
        nav("/login");
        window.location.reload();
    };

    useEffect(() => {
        (async () => {
            if (user?._id) {
                const { data: userData } = await instance.get(
                    `/user/${user._id}`
                );
                setUserPermissions(userData.data.permissions);

                // Lấy danh sách quyền
                const { data: permissionsData } = await instance.get(
                    "/permissions"
                );
                setPermissionsList(permissionsData);
            }
        })();
    }, [user]);

    // Ánh xạ ID quyền với tên quyền
    const mappedPermissions = userPermissions
        .map((permissionId) => {
            const permission = permissionsList.find(
                (p: User) => p._id === permissionId
            );
            return permission ? permission.name : null;
        })
        .filter((name) => name); // Lọc các quyền có tên
    console.log("mappedPermissions", mappedPermissions);
    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAdmin: user?.role === "admin",
                mappedPermissions,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
