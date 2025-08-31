"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

export default function LogoutPage() {
  const router = useRouter()

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem("access")
    localStorage.removeItem("refresh") // ✅ refresh bhi hata do agar ho
    router.push("/")
    alert("Logged out successfully ✅")
  }

  return (
    <div className="flex items-center justify-center">
      <button 
        onClick={handleLogout}
        className="px-6 py-2 font-semibold text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}
