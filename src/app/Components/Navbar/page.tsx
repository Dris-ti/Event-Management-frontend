'use client'


import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar({ user }: { user: any }) {
    const router = useRouter();
  //const path = router.pathname;

  // // Hide navbar on login or signup pages
  // if (path === '/SignIn' || path === '/SignUp') {
  //   return null;
  // }

  return (
    <nav className='bg-white/10 backdrop-blur-sm text-indigo-900 fixed top-0 left-0 w-full h-[10%] z-10 px=6 py-4'>


      <div className='max-w-7xl mx-auto px-6 py-6 fixed top-0 left-0'>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-7 h-7 rounded-full"
            />

            <span className="text-xl font-semibold">
              Event buddy<span className="text-purple-700">.</span>
            </span>
          </div>

          {/* Auth area */}
          {user?.name ? (
            <div className="flex items-center gap-4">
              <span className="text-md text-[#242565]">Hello, {user.name}</span>
              <button
                onClick={() => {
                  // Clear auth token and redirect to login
                  document.cookie = 'token=; Max-Age=0';
                  router.push('/login');
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 hover:opacity-90 transition"
              >
                <img src="/logout.svg" alt="" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
              <Link href="/signup" className="text-sm text-blue-600 hover:underline">Sign Up</Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}
