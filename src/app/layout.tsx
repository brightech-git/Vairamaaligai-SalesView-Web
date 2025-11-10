"use client";

import "./globals.css";
import ReduxProvider from "../redux/Providers";
import { ThemeContextProvider } from "../context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "@/context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React,{ ReactNode, useState } from "react";
import Head from "next/head";

// src/app/layout.tsx

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <html lang="en">
      <Head>
        <title>Jaiguru Sales View</title>
        <link rel="icon" href="/images/logo/icon.png" />
      </Head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider>
            <ThemeContextProvider>
              <AppProvider>
                {children}
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar
                />
              </AppProvider>
            </ThemeContextProvider>
          </ReduxProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}