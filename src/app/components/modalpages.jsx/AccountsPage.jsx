"use client"
import { useState } from 'react'
import React from 'react'
import LoginForm from './Login'
import SignupForm from './Signup'

export default function AccountsPage() {
 const [showlogin, setshowLogin]= useState(false)
  return (
    <div>
       {showlogin &&  <LoginForm/>}
       {!showlogin &&  <SignupForm/>}
    </div>
  )
}
