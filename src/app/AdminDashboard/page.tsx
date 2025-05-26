'use client'
import React from 'react'
import Navbar from '../Components/Navbar/page';
import Footer from '../Components/Footer/page';
import EventManagementTable from '../Components/EventMangementTable.tsx/page';



export default function AdminDashboard() {

  return (
    <div className='min-h-screen bg-[#f7f7ff]'>
      <div className='p-8 pt-20 pl-25 pr-25'>
        <h1 className="text-4xl font-bold text-[#242565] mb-2">Admin Dashboard</h1>
            <p className="text-[#8570AD] mb-6">
                Manage events, view registrations, and monitor your platform.
            </p>

      <EventManagementTable/>

      </div>

      

      
    </div>
  )
}
