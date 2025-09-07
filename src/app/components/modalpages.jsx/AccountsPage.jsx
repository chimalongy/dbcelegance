"use client"
import { useState } from 'react'
import React from 'react'
import LoginForm from './Login'
import SignupForm from './Signup'

export default function AccountsPage() {
  const [showlogin, setshowLogin] = useState(false)
  return (
    <div>
      <div className='flex'>
        <div className={`flex-1 text-center border rounded-tl-2xl rounded-bl-2xl p-2 ${showlogin ? " bg-black text-white" : ""}`}
          onClick={() => { setshowLogin(true) }}
        >Login</div>
        <div className={`flex-1 text-center border rounded-tr-2xl rounded-br-2xl p-2 ${!showlogin ? " bg-black text-white" : ""}`}
          onClick={() => { setshowLogin(false) }}
        >Register</div>


      </div>

      {showlogin && <LoginForm />}
      {!showlogin && <SignupForm />}
    </div>
  )
}
