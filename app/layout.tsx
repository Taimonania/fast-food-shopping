import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import ConvexClientProvider from "@/components/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fast Food Shopping",
  description: "Fast Food Shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${inter.variable} min-h-[calc(100vh-2rem)] flex flex-col gap-4 antialiased`}
      >
        <ConvexClientProvider>
          <Navbar />
          <main className="px-4 md:px-16 lg:px-32 pt-8 grow flex flex-col">
            {children}
          </main>
          <Toaster position="top-center" closeButton />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
