import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ModalMain from "./components/modalpages.jsx/ModalMain";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Nav";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import Script from "next/script";
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
          toastOptions={{
            classNames: {
              // Base toast style
              toast:
                "shadow-xl p-8 bg-white text-black border border-gray-200 flex items-center space-x-3 transform transition-all duration-300 ease-in-out",

              // Title and description
              title: "text-black font-semibold text-base",
              description: "text-gray-600 text-sm",

              // Buttons
              actionButton:
                "flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-3 py-1.5  text-sm font-medium shadow-sm",
              cancelButton:
                "flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 text-sm",
            },

            // Variant overrides (black & white theme with icons)
            success: {
              className: " bg-white border border-gray-300 text-black",
              icon: <FiCheckCircle size={35} className="text-black text-lg" />,
            },
            error: {
              className: "bg-white border border-gray-300 text-black",
              icon: <FiXCircle size={35} className="text-black text-lg" />,
            },
          }}
        />

        <Script
          src="https://checkout.flutterwave.com/v3.js"
          strategy="afterInteractive" // Loads after the hydration
        />
      </body>
    </html>
  );
}
