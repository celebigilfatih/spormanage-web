import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import GlobalChat from "@/components/GlobalChat";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
});

export const metadata: Metadata = {
  title: "Spormanage – Web Tabanlı Spor Yönetim Platformu",
  description: "Spormanage ile spor kulübünüzün üyelerini, finansını ve antrenmanlarını tek panelden yönetin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${urbanist.variable} antialiased`}>
        {children}
        <GlobalChat />
      </body>
    </html>
  );
}
