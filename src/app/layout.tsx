import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FEBNIKS KITCHEN",
  description: "Premium food ordering web application for FEBNIKS KITCHEN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background min-h-screen flex flex-col`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '16px',
                fontWeight: 'bold',
              },
              success: {
                style: {
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #10B981',
                },
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
