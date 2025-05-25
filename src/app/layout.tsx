/*
  RootLayout je globalni layout aplikacije.
  Ovdje se nalazi globalni izbornik (navigacija) i globalni CSS.
  Izbornik prima props (ili context) za dinamički sadržaj ovisno o stranici.
  ZAŠTO: Izbornik je ovdje jer želimo dosljednu navigaciju na svim stranicama i centraliziranu kontrolu.
*/
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Izbornik from "@/components/Izbornik";
import { AuthProvider, AuthButtons } from '@/components/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IFDB - TV serije",
  description: "Najbolje TV serije, epizode i glumci s TVmaze API-ja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ZAŠTO: Izbornik je uvijek prikazan, a sadržaj se može prilagoditi putem contexta ili propsa
  // ZAŠTO: AuthProvider omogućuje globalni pristup sessionu za NextAuth
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-green-50 min-h-screen`}
      >
        <AuthProvider>
          <Izbornik />
          <div className="flex justify-end px-4"><AuthButtons /></div>
          <main className="max-w-6xl mx-auto px-2 md:px-8 py-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
