'use client'

import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, setUser, fetchUser  } = useAuth();
  

  const logout = async () => {
    try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}auth/logout`, {
      withCredentials: true,
    });

    if (response.status === 200) {
        setUser(null); // update context so "Hello, name" disappears
        router.push('/Homepage');
      }
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to logout.");
  }
  }

  return (
    <nav className='bg-white/10 backdrop-blur-sm text-[#250A63] fixed top-0 left-0 w-full h-[10%] z-10 px-6 py-4'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        {/* Left Side: Logo + App Name */}
        <div className="cursor-pointer flex items-center gap-2"
        onClick={() => router.push('/Homepage')}>
          <img src="/logo.svg" alt="Logo" className="w-7 h-7 rounded-full" />
          <span className="text-xl font-semibold">
            Event buddy<span className="text-[#250A63]">.</span>
          </span>
        </div>

        {/* Right Side: Auth Options (conditionally shown) */}
        {
          user?.email ? (
            <div className="flex items-center gap-4">
              <span className="text-md text-[#242565]">
                {user.type === 'user' ? (
                  <Link href="/UserDashboard" className="hover:underline">
                    Hello, {user.name || user.name.split(' ')[0]}
                  </Link>
                ) : (
                  <>Hello, {user.name || user.name.split(' ')[0]}</>
                )}
              </span>
              <button
                onClick={() => logout() }
                style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
                className="cursor-pointer text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 hover:opacity-90 transition"
              >
                <img src="/logout.svg" alt="" className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
              style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
               href="/SignIn" className="pt-2 pb-2 pl-4 pr-4 rounded-md text-sm text-[#fff]">Sign in</Link>
              <Link
              style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }} 
              href="/SignUp" className="pt-2 pb-2 pl-4 pr-4 rounded-md text-sm text-[#fff]">Sign up</Link>

            </div>
          )
        }
      </div>
    </nav>
  )
}
