import React, { createContext, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

interface LoadingContextType {
    apiLoading: boolean;
    pageLoading: boolean;
    setApiLoading: (loading: boolean) => void;
    setPageLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [apiLoading, setApiLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const location = useLocation();

    // Lắng nghe sự kiện chuyển trang để tự động bật pageLoading
    React.useEffect(() => {
        setPageLoading(true); // Bật loading khi bắt đầu chuyển trang
        const timeout = setTimeout(() => {
            setPageLoading(false); // Tắt loading sau khi trang chuyển
        }, 500); // Thời gian loading (tùy chỉnh)

        return () => clearTimeout(timeout); // Xóa timeout khi component unmount
    }, [location]);

    return (
        <LoadingContext.Provider
            value={{
                apiLoading,
                pageLoading,
                setApiLoading,
                setPageLoading,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

// Custom hook để sử dụng Loading Context
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
