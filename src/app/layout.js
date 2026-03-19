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
    <html lang="en">
      <head>
        <link rel="icon" href="/appwrite.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:opsz,wght@14..32,100..900&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/appwrite.svg" />
      </head>
      <body className={"bg-[#FAFAFB] font-[Inter] text-sm text-[#56565C] min-h-screen pt-20 overflow-x-hidden"}>
        <QueryProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}

