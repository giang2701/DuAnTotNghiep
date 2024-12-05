import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ProductProvider from "./context/ProductContext.tsx";
import CategoryProvider from "./context/CategoryContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { SizeProvider } from "./context/Size.tsx";
import { CartProvider } from "./context/cart.tsx";
import { UserProvider } from "./context/user.tsx";
import { VoucherProvider } from "./context/Voucher.tsx";
import BrandProvider from "./context/Brand.tsx";
import { LoadingProvider } from "./context/Loading.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <LoadingProvider>
                <AuthProvider>
                    <SizeProvider>
                        <ProductProvider>
                            <CategoryProvider>
                                <CartProvider>
                                    <UserProvider>
                                        <VoucherProvider>
                                            <BrandProvider>
                                                <App />
                                            </BrandProvider>
                                        </VoucherProvider>
                                    </UserProvider>
                                </CartProvider>
                            </CategoryProvider>
                        </ProductProvider>
                    </SizeProvider>
                </AuthProvider>
            </LoadingProvider>
        </BrowserRouter>
    </React.StrictMode>
);
