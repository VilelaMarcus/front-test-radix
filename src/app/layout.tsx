import type { Metadata } from "next";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radix Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <UserProvider>
          <body>
            <Navbar />
            {children}
          </body>
        </UserProvider>
      </html>
    );
}

