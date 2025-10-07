

import adminInstance from "../api/adminInstance";

interface LoginData {
    usernameOrEmail: string;
    password: string;
}

export const loginUser = async (data: LoginData) => {
    try {
        const response = await adminInstance.post("/user/login", data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || "Login failed");
    }
};
