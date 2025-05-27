'use client'
import React from 'react'
import BookingHistory from '../Components/BookingHistory/page'
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <div className='min-h-screen bg-[#f7f7ff]'>
      <div className='px-4 sm:px-6 md:px-12 pt-20'>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#242565] mb-2">
          Dashboard
        </h1>
        <p className="text-[#8570AD] text-sm sm:text-base mb-6">
          Welcome back, {user?.name}! Here you can manage your event registrations.
        </p>

        <BookingHistory />
      </div>
    </div>
  )
}
