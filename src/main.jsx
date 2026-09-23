import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./styles/index.css";
import { AuthProvider } from "./features/auth/context/AuthProvider.jsx";
import { queryClient } from "./lib/queryClient.js";
import App from "./app/App";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>,
);