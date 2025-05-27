'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar/page';
import Footer from '../Components/Footer/page';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
const { user, fetchUser } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();

      if (!user) {
        router.push('/SignIn');
        return;
      }

      if (user?.type !== 'admin') {
        alert('Unauthorized');
        router.push('/SignIn');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, []); 

  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center text-[#250A63] text-5xl font-bold">
        Verifying access...
      </div>
    );
}

    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
