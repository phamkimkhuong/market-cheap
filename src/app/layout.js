import "@/app/app.css";
import QueryProvider from "@/providers/query-provider";

export const metadata = {
  title: "V-Marketplace: Modern E-commerce",
  description: "A premium marketplace powered by Appwrite and Next.js",
};

import { ToastContainer } from "@/components/ui/toast-container";
import { Navbar } from "@/components/ui/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/appwrite.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:opsz,wght@14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/appwrite.svg" />
      </head>
      <body className="bg-bg-main text-text-main font-sans min-h-screen pt-20 overflow-x-hidden antialiased">
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

