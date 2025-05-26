'use client'
import React from 'react'
import BookingHistory from '../Components/BookingHistory/page'
import Navbar from '../Components/Navbar/page'
import Footer from '../Components/Footer/page'
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <div className='min-h-screen bg-[#f7f7ff]'>
      <div className=' p-8 pt-20 pl-25 pr-25'>
        <h1 className="text-4xl font-bold text-[#242565] mb-2">Dashboard</h1>
        <p className="text-[#8570AD] mb-6">
          Welcome back, {user?.name}! Here you can manage your event registrations.
        </p>

        <BookingHistory />
      </div>



      

    </div>
  )
}
