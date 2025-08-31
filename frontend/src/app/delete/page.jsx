"use client"
import { refreshingToken } from '@/component/Fetching'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function page() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const currentEmail = localStorage.getItem("email")
    const access_token = localStorage.getItem("access")

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload
        if(!confirm(`Are you sure you want to delete ${email}?`)) return;


    try {
        const res = await fetch(`http://localhost:5000/deleteCreatedUser/${encodeURIComponent(email)}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json", 
                "Authorization" : `Bearer ${access_token}`
             }
            // body optional, kyunki email URL me already hai
        });

        const data = await res.json();
        await refreshingToken(data.message)
        if(res.ok){
            alert(data.message || "User deleted successfully");
            setEmail(""); // clear input
            if (email === currentEmail) {
                localStorage.removeItem("access")
                router.push("/Account")
            }
        } else {
            if(access_token)
                alert(data.message || "Failed to delete user");
            else 
                alert("Create account First");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
}

  return (
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center w-[50%] mx-auto gap-4 my-5'>
    <input 
        className='w-[70%] px-3 py-2 border-2 border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500' 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder='Enter your registered Email id' 
    />
    <button  
        className='bg-blue-500 w-[70%] py-[1vh] font-semibold text-white text-lg rounded-3xl hover:bg-blue-700' 
        type='submit'>
        Delete
    </button>
</form>

  )
}
