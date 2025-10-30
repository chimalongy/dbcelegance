"use client";

import { useEffect, useState } from 'react';
import {
  FiMenu, FiX, FiHome, FiUsers, FiSettings, FiFileText,
  FiShoppingCart, FiBox, FiTag, FiLogOut, FiGift, FiUser
} from 'react-icons/fi';

import { Toaster } from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore';


export default function AdminLayout({ children }) {

  const {clearAdminUser}=useAdminUserStore()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const adminuser = useAdminUserStore((state)=>state.adminuser)

 useEffect(() => {
    if (adminuser?.id) console.log(adminuser);
  }, [adminuser?.id]);

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-black text-white transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-amber-300-700">
          <h1 className="text-xl font-semibold">DBC Elegance</h1>
          <button className="lg:hidden text-white focus:outline-none" onClick={toggleSidebar}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
          <ul className="space-y-2">

            <li>
              <a href="/admin/dashboard" className="flex items-center p-2 rounded hover:bg-blue-700">
                <FiHome className="mr-3" />
                Dashboard
              </a>
            </li>

            {/* Users Section - Added this new section */}
            <li>
              <a href="/admin/dashboard/users" className="flex items-center p-2 rounded hover:bg-blue-700">
                <FiUser className="mr-3" />
                Users
              </a>
            </li>
            {/* Users Section - Added this new section */}
            <li>
              <a href="/admin/dashboard/audits" className="flex items-center p-2 rounded hover:bg-blue-700">
                <FiUser className="mr-3" />
                Audit Logs
              </a>
            </li>

            {/* Male Fashion */}
            <li className="mt-4 text-sm font-semibold text-blue-200 uppercase">Male Fashion</li>
            <li>
              <a href="/admin/dashboard/stores/male/categories" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiTag className="mr-3" />
                Categories
              </a>
            </li>
            <li>
              <a href="/admin/dashboard/stores/male/products" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiBox className="mr-3" />
                Products
              </a>
            </li>
            <li>
              <a href="/admin/dashboard/stores/male/accessories" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiGift className="mr-3" />
                Accessories
              </a>
            </li>
            <li>
              <a href="/admin/dashboard/stores/male/productgroups" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiGift className="mr-3" />
                Product Groups
              </a>
            </li>

            {/* Female Fashion */}
            <li className="mt-4 text-sm font-semibold text-blue-200 uppercase">Female Fashion</li>
            <li>
              <a href="/admin/dashboard/stores/female/categories" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiTag className="mr-3" />
                Categories
              </a>
            </li>
            <li>
              <a href="/admin/dashboard/stores/female/products" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiBox className="mr-3" />
                Products
              </a>
            </li>
            <li>
              <a href="/admin/dashboard/stores/female/accessories" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiGift className="mr-3" />
                Accessories
              </a>
            </li>
            <li>
              <a href="/admin/dashboard/stores/female/productgroups" className="flex items-center p-2 pl-6 rounded hover:bg-blue-700">
                <FiGift className="mr-3" />
                Product Groups
              </a>
            </li>


            {/* Others */}
            <li className="mt-4">
              <a href="/admin/dashboard/orders" className="flex items-center p-2 rounded hover:bg-blue-700">
                <FiShoppingCart className="mr-3" />
                Orders
              </a>
            </li>
            <li>
              <a href="/admin/dashboard/customers" className="flex items-center p-2 rounded hover:bg-blue-700">
                <FiUsers className="mr-3" />
                Customers
              </a>
            </li>
          </ul>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700" 
          onClick={()=>{clearAdminUser()}}>
            <a href="/admin" className="flex items-center p-2 rounded hover:bg-blue-700">
              <FiLogOut className="mr-3" />
              Logout
            </a>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top nav */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button className="lg:hidden text-gray-500 focus:outline-none" onClick={toggleSidebar}>
              <FiMenu size={24} />
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {/* <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span>AD</span>
              </div> */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
          <Toaster/>
        </main>

      </div>
    </div>
  );
}