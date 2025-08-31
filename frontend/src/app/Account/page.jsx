"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Login from '../Login/page'
export default function Account() {
  return (
    <div className='flex flex-col items-center gap-4 mt-10'>
      <div className="w-[300px]">
        <Login/>
      </div>
      <Link 
            href="/CreateAccount"
        className='px-3 py-2 w-[200px] text-lg font-semibold text-center text-white 
                   bg-black border-2 border-black rounded-md 
                   transition-all duration-300 
                   hover:bg-transparent hover:text-black hover:shadow-lg hover:rounded-xl'
      >
        Create Account
          </Link> 

      
    </div>
  )
}
