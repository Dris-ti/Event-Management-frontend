'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar/page';
import Footer from '../Components/Footer/page';
import { useAuth } from '../context/AuthContext';

interface UserDashboardLayoutProps {
    children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    const { user, fetchUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();

      if (!user) {
        router.push('/SignIn');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [user]); 

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
