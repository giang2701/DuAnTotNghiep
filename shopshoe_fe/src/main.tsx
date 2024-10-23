import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ProductProvider from "./context/ProductContext.tsx";
import CategoryProvider from "./context/CategoryContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { SizeProvider } from "./context/Size.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <SizeProvider>
                    <ProductProvider>
                        <CategoryProvider>
                            <App />
                        </CategoryProvider>
                    </ProductProvider>
                </SizeProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
