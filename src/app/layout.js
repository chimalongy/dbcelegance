import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ModalMain from "./components/modalpages.jsx/ModalMain";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DBC Elegance",
  description:
    "Shop elegant fashion and accessories at DBC Elegance — timeless style for modern sophistication.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-serif`}
      >
        {/* <Navbar /> */}
        {children}

        <Toaster
          position="top-right"
          expand={true}
          richColors
          toastOptions={{
            classNames: {
              toast:
                "rounded-2xl shadow-lg p-4 bg-white border border-gray-200 flex items-center space-x-3",
              title: "text-gray-900 font-semibold text-base",
              description: "text-gray-600 text-sm",
              actionButton:
                "bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm",
              cancelButton:
                "bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg text-sm",
            },
          }}
        />
      </body>
    </html>
  );
}
