import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SHEQ Platform — AI Legal Compliance & Gap Analysis",
  description:
    "ระบบวิเคราะห์ความสอดคล้องกฎหมาย SHEQ ด้วย AI สำหรับธุรกิจไทย ประเมินช่องว่างด้านความปลอดภัย สิ่งแวดล้อม และคุณภาพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
