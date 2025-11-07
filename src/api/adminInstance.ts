import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api/v1" // ✅ adjust if needed
//const BASE_URL =  "http://localhost:8080/api/v1" // ✅ adjust if needed
console.log ("BASE_URL", BASE_URL)

const adminInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Attach token dynamically
adminInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Global error handler
adminInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized. Redirect to login or refresh token.");
            // You can dispatch logout or redirect logic here
        }
        return Promise.reject(error);
    }
);

export default adminInstance;
