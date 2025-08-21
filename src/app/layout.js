
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
  description: "Shop elegant fashion and accessories at DBC Elegance — timeless style for modern sophistication.",
};

export default function RootLayout({ children }) {
 

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-serif`}
     
      >
        {/* <Navbar /> */}
        {children}

       <Toaster/>
      </body>
    </html>
  );
}
