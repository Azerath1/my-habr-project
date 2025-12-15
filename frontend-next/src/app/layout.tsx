// src/app/layout.tsx - добавлен ThemeProvider для тем, темный по умолчанию
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes"; // Установи: npm i next-themes

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Habr",
  description: "Блог на Next.js + FastAPI с Shadcn UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Темный по умолчанию
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
