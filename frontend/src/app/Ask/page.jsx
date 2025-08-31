"use client"
import { refreshingToken } from '@/component/Fetching';
import React, { useEffect, useState } from 'react'

export default function Ask({ ask, setAsk }) {
  const [data, setData] = useState({ email: "", question: "" })
  const [send, setSend] = useState(false)

  const handleChange = (e) => {
    e.preventDefault()
    setSend(false)
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const access_token = localStorage.getItem("access");
    try {
      const response = await fetch("http://localhost:5000/sendQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${access_token}`
         },
        body: JSON.stringify(data)
      })
      if (response.ok) {
  setSend(true);
  setData({ email: "", question: "" });  // inputs clear
}

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='flex flex-col items-center gap-[5vh]'>
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-[2vh]'>
        <input required 
          value={data.email}
          name="email"
          onChange={handleChange}
          className='border border-gray-300 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none w-[70vw] h-[5vh] p-3'
          type='email'
          placeholder='Enter Your Email here'
        />
        <textarea required
  value={data.question}
  name="question"
  onChange={handleChange}
  placeholder="Ask a question..."
          className="w-[70vw] p-3 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none h-28"
        />
        <button
          type='submit' 
          className="font-semibold text-white text-lg bg-purple-600 w-[160px] text-center py-2 rounded-full hover:bg-purple-700 transition-all duration-300"
        >
          {send ? "SENT" : "Send Question"}
        </button>
      </form>

      <button
        onClick={() => setAsk(!ask)}
        className="font-semibold text-white text-lg bg-purple-600 w-[160px] text-center py-2 rounded-full hover:bg-purple-700 transition-all duration-300"
      >
        Go Back
      </button>
    </div>
  )
}
