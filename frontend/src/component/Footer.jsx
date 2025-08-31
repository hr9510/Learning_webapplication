import React from 'react'

export default function Footer() {
  return (
    <footer className="sticky bottom-0 w-full py-6 mt-10 text-center text-white bg-gray-800 shadow-inner ">
        
        <span className="text-sm md:text-base">&copy; {new Date().getFullYear()} Himanshu Rajoriya. All rights reserved.</span>
    </footer>
  )
}
