"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function CreateAccount() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Password validation conditions
  const conditions = {
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[@$!%*?&]/.test(formData.password),
    minLength: formData.password.length >= 8,
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) return "Strong";
    return "Medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
    setMessage(""); // clear previous message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    if (passwordStrength !== "Strong") {
      setMessage("⚠️ Please use a stronger password!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Account created successfully! Login now");
        router.push("/")
      }
      else {
        setMessage(data.message || "⚠️ Something went wrong!");
      }
    } catch (err) {
      setMessage("⚠️ Network error or Email already exists");
    }
  };

  return (
    <div className='flex flex-col items-center px-4 mt-10'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center w-full max-w-md gap-4 p-6 bg-white shadow-lg rounded-xl'
      >
        <h2 className='mb-2 text-3xl font-bold text-gray-800'>Create Account</h2>

        {/* Name Input */}
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Enter your name'
          className='w-full px-3 py-2 border-2 border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500'
        />

        {/* Email Input */}
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter your email'
          className='w-full px-3 py-2 border-2 border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500'
        />

        {/* Password Input */}
        <input
          type='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Enter Password (min 8 chars with symbol, number, uppercase)'
          className='w-full px-3 py-2 border-2 border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500'
        />

        {/* Password strength */}
        {formData.password && (
          <p className={`font-semibold ${
            passwordStrength === "Weak" ? "text-red-500" :
            passwordStrength === "Medium" ? "text-yellow-500" : "text-green-600"
          }`}>
            Password Strength: {passwordStrength}
          </p>
        )}

        {/* Password rules */}
        <div className="grid w-full grid-cols-1 gap-1 mt-1 text-sm text-gray-700">
          <p className={`flex items-center gap-2 ${conditions.hasUpper ? "text-green-600" : "text-red-500"}`}>
            <input type="checkbox" checked={conditions.hasUpper} readOnly /> At least one Uppercase
          </p>
          <p className={`flex items-center gap-2 ${conditions.hasLower ? "text-green-600" : "text-red-500"}`}>
            <input type="checkbox" checked={conditions.hasLower} readOnly /> At least one Lowercase
          </p>
          <p className={`flex items-center gap-2 ${conditions.hasNumber ? "text-green-600" : "text-red-500"}`}>
            <input type="checkbox" checked={conditions.hasNumber} readOnly /> At least one Number
          </p>
          <p className={`flex items-center gap-2 ${conditions.hasSpecial ? "text-green-600" : "text-red-500"}`}>
            <input type="checkbox" checked={conditions.hasSpecial} readOnly /> At least one Special Character
          </p>
          <p className={`flex items-center gap-2 ${conditions.minLength ? "text-green-600" : "text-red-500"}`}>
            <input type="checkbox" checked={conditions.minLength} readOnly /> Minimum 8 Characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={passwordStrength !== "Strong"}
          className={`w-full py-2 font-semibold text-lg rounded-xl transition-all
            ${passwordStrength === "Strong"
              ? "bg-blue-500 hover:bg-blue-700 text-white cursor-pointer"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
        >
          Create Account
        </button>

        {/* Message */}
        {message && (
          <p className={`mt-2 font-semibold text-center 
            ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
