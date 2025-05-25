'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: AdminDashboardLayoutProps) {

    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const router = useRouter();

    React.useEffect(() => {
        const fetchAuth = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    console.log( "Response: ",response)
                    alert(response.text);
                    router.push("/SignIn"); 
                    return;
                }

                const data = await response.json();
                console.log("User data:", data);
                setIsSuccess(true);
            } catch (error) {
                console.error("Error fetching auth:", error);
            }
        };

        fetchAuth();
    }, [router])

    if (!isSuccess) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {children}
        </div>
    )
}
