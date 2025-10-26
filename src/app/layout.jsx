'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import { useLoggedCustomerStore } from './lib/store/loggedCustomer';
import { useSessionTimeout } from './hooks/useSessionTimeout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  // Initialize session timeout functionality
  useSessionTimeout();

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
