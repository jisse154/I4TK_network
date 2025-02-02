"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import RainbowKitAndWagmiProvider from "./RainbowKitAndWagmiProvider";
import Layout from "@/components/shared/Layout";

import { AppContextProvider } from "@/contexts/AppContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <RainbowKitAndWagmiProvider>
          <AppContextProvider>
            <Layout>{children}</Layout>
          </AppContextProvider>
        </RainbowKitAndWagmiProvider>
      </body>
    </html>
  );
}
