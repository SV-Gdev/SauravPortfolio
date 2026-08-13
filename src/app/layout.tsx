import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Saurav Sharma | Game Developer Portfolio",
  description:
    "Aspiring game developer with 1.5+ years of experience in Unity and 7 months in Unreal Engine. Building immersive experiences through interactable UI, intelligent AI, and polished gameplay systems.",
  keywords: [
    "game developer",
    "Unity",
    "Unreal Engine",
    "C#",
    "portfolio",
    "Saurav Sharma",
  ],
  authors: [{ name: "Saurav Sharma" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
