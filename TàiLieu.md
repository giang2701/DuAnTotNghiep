# Cài đặt môi trường (.......)

-   npm create vite -- --template react-ts +Tên dự án
-   npm i sass -D :cài đặt sass
-   Cài đặt tailwins

        -   B1: npm install -D tailwindcss postcss autoprefixer
        -   B2: npx tailwindcss init -p
        -   B3:

            -   Cập nhật lại tsconfig.app.json:
                "baseUrl": ".",
                "paths": {
                "@/_": [
                "./src/_"
                ]
                }

            -   vite.config.ts:
                import path from "path"
                import react from "@vitejs/plugin-react"
                import { defineConfig } from "vite"

                    export default defineConfig({
                    plugins: [react()],
                    resolve: {
                        alias: {
                        "@": path.resolve(__dirname, "./src"),
                        },
                    },
                    })

            -   npm i -D @types/node : cài đặt đêr file hiểu dc path ( trong import path from "path" vite.config.ts:)
            -   tailwind.config.json
                content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
            -   app.css:
                    @tailwind base;
                    @tailwind components;
                    @tailwind utilities;

# Các thư viện khác

-   npm i axios
-   npm i @hookform/resolvers
-   npm i concurrently
    (sửa thành: concurrently \"vite --port 5173\" \"json-server --watch db.json --port 3000 -m ./node_modules/json-server-auth\")
-   npm i json-server@0.17.0
-   npm i json-server-auth
-   npm i react-hook-form
-   npm i react-router-dom
-   npm i joi
