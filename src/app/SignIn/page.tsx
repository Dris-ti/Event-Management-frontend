'use client'

import React from 'react'
import Navbar from '../Navbar/page'
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function signin() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}auth/login` || "", {
        email,
        password
      }, {
        withCredentials: true,
      });

      if(response.status === 200){
        router.replace("/Home");
      }

    }catch(error){
      if (axios.isAxiosError(error) && error.response) {
                // Handle server response errors
                const { status, data } = error.response;
                if (status === 401) {
                    alert(data?.error?.message || "Invalid email or password");
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
            } else {
                // Handle unexpected errors
                console.error("Error:", error);
                alert("Network or server error. Please try again. " + error);
            }
    }
  }


  return (
    <div className='w-full h-screen bg-[#ECEEFF]'>
      <Navbar />

      <div className='flex items-center justify-center min-h-screen'>

        <div className="bg-white p-8 rounded-lg shadow-md w-96 relative">
          {/* Top corners */}
          {/* <div className="absolute -top-2 -left-2 w-4 h-4 bg-indigo-50 rounded-tr-md"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-50 rounded-tl-md"></div> */}

            {/* Text heading */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign in</h2>
          <p className="mb-6 text-sm text-[#8570AD]">
            New User?{" "}
            <a href="/SignUp" className="text-purple-700 underline hover:text-purple-800">
              Create an account
            </a>
          </p>

          {/* Form */}
          <form className="space-y-4"
            onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="enter your email"
                value={email}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="enter your password"
                 value={password}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-md shadow hover:from-indigo-500 hover:to-indigo-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
