"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "⚠️ Invalid credentials!");
        return;
      }

      if (data.token) {
        setMessage("✅ Login successfully!");
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("access", data.token.accessToken);
        localStorage.setItem("refresh", data.token.refreshToken);
        window.location.reload()
        
      } else {
        setMessage(data.message ||"⚠️ Something went wrong!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("⚠️ Server not responding!");
    }
    router.replace("/");
  };

  return (
    <div className='mt-5'>
      <form 
        onSubmit={handleSubmit} 
        className='flex flex-col items-center gap-2'
      >
        <input 
          type='text' 
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter your email' 
          className='px-3 border-2 border-gray-300 rounded-3xl w-full py-[1vh] outline-none'
        />

        <input 
          type='password' 
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Enter Password' 
          className='px-3 border-2 border-gray-300 rounded-3xl w-full py-[1vh] outline-none'
        />

        <button 
          type='submit' 
          className='bg-blue-500 w-full py-[1vh] font-semibold text-white text-lg rounded-3xl hover:bg-blue-700'
        >
          Login
        </button>
      </form>  

      {message && <p className="mt-3 font-semibold text-red-500">{message}</p>}
    </div>
  )
}
