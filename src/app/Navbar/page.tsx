'use client'


import React from 'react'
import { FaGift } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className='bg-white/10 backdrop-blur-sm text-indigo-900 fixed top-0 left-0 w-full h-[10%] z-10 px=6 py-4'>


    <div className='max-w-7xl mx-auto px-6 py-6 fixed top-0 left-0'>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaGift className="text-xl" />
                  <span className="text-xl font-semibold">
                    Event buddy<span className="text-purple-700">.</span>
                  </span>
                </div>
    </div>
    </div>
        </nav>
  )
}
