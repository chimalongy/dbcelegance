import React from 'react'
import { FaCircleNotch } from "react-icons/fa";

export default function Loader() {
  return (
    <div className="h-screen flex justify-center items-center">
        <div className="flex justify-center items-center p-2 bg-black border-8 border-amber-500 h-[200px]">
          <p className="flex gap-1">
            <span className="text-amber-500 font-extrabold">DBC</span>
            <span className="text-white">Elegance</span>
          </p>
         <FaCircleNotch className="text-amber-500 animate-spin" />
        </div>
      </div>
  )
}
