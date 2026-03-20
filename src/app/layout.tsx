import "@/app/app.css";
import QueryProvider from "@/providers/query-provider";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "V-Marketplace: Modern E-commerce",
  description: "A premium marketplace powered by Appwrite and Next.js",
};

import { ToastContainer } from "@/components/ui/toast-container";
import { Navbar } from "@/components/ui/navbar";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/appwrite.svg" />
      </head>
      <body 
        className="bg-bg-main text-text-main font-sans min-h-screen pt-20 overflow-x-hidden antialiased"
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}

