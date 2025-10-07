"use client";

import "./globals.css";
import ReduxProvider from "../redux/Providers";
import { ThemeContextProvider } from "../context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "@/context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

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
      <body>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider>
            <ThemeContextProvider>
              <AppProvider>
                {children}
                <ToastContainer
                  position="top-right"
                  autoClose={2000}
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