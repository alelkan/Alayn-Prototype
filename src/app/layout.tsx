import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MobileContainer from "@/components/mobile-container";
import "./globals.css";
import { MoodProvider } from "@/context/MoodContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alayn",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MoodProvider>
          <MobileContainer>{children}</MobileContainer>
        </MoodProvider>
      </body>
    </html>
  );
}
