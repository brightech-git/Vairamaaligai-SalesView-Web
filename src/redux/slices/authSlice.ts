"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../service/AuthService";
import { toast } from "react-toastify";

interface AuthState {
    user: any;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};


// ✅ Async thunk for login
export const login = createAsyncThunk(
    "auth/login",
    async (credentials: { usernameOrEmail: string; password: string }, { rejectWithValue }) => {
        try {
            const data = await loginUser(credentials);
            sessionStorage.setItem("auth_token", data.token);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            sessionStorage.removeItem("auth_token");
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                toast.success("Login successful!");
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error("Invalid username or password");
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
