"use client"
import { useNewOrderStorage } from '@/app/lib/store/neworder'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserCart } from '@/app/lib/store/userCart'


function Page() {
  const newneworder = useNewOrderStorage((state) => state.newOrder)
  let clearNewOrder = useNewOrderStorage((state)=> state.clearNewOrder)
  let clearcart = useUserCart((state)=> state.clearCart)
  const router = useRouter()


  useEffect(() => {
    // prevent back navigation
    const handlePopState = () => {
      router.replace("/home") // redirect to store instead of going back
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [router])

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div>
        <h1 className="text-2xl lg:text-3xl">Your order has been received.</h1>

        <div></div>

        <button
          className="mt-15 bg-black text-white p-3"
          onClick={() => {
            console.log(newneworder)
            clearNewOrder()
            clearcart()
            router.push("/home") // go to store explicitly
          }}
        >
          Back to store
        </button>
      </div>
    </div>
  )
}

export default Page
