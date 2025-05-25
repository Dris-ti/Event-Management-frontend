'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {

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
                    alert("Unauthorized");;
                    router.push("/SignIn"); 
                    return;
                }

                const data = await response.json();

                const user = data.data;

                console.log("TYPE: ", user.type)

                if(user.type != 'admin')
                {
                    alert("Unauthorized");
                    router.push("/SignIn"); 
                    return;
                }

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
