import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ProductProvider } from "@/context/ProductContext";

export const metadata: Metadata = {
  title: "Product Admin Dashboard | Nexgensis",
  description: "Modern Admin Dashboard to manage products, inventory, and categories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <ToastProvider>
          <AuthProvider>
            <ProductProvider>{children}</ProductProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
