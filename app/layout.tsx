import "@/app/globals.css";
import type { Metadata } from "next";
import { Archivo, Libre_Franklin } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "./(root)/providers";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});
const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

export const metadata: Metadata = {
  title: "WDC Template",
  icons: [
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.ico" },
  ],
  keywords: "yolo",
  description: "A simple next.js template including drizzle and lucia auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={(
          `min-h-screen bg-background antialiased,
    ${archivo.variable + " " + libre_franklin.variable},
  no-select overflow-auto `)}
      >
        <Providers>

          <div className="container mx-auto w-full">{children}</div>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
