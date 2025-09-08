"use client"
import { useState } from 'react'
import LoginForm from './Login'
import SignupForm from './Signup'

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState('login')
  
  return (
    <div className="max-w-md mx-auto mt-10 bg-white  overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 border-t-0">
        <button
          className={`flex-1 py-4 text-center font-light tracking-wide transition-all duration-300 ${
            activeTab === 'login' 
              ? "text-black border-b-2 border-black" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab('login')}
        >
          LOGIN
        </button>
        <button
          className={`flex-1 py-4 text-center font-light tracking-wide transition-all duration-300 ${
            activeTab === 'signup' 
              ? "text-black border-b-2 border-black" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab('signup')}
        >
          REGISTER
        </button>
      </div>
      
      {/* Form Content */}
      <div className="p-6 md:p-8">
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  )
}