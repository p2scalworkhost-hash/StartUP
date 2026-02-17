'use client';

import { useEffect } from 'react';
import { onAuthChange } from '@/lib/firebase/auth';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, clearAuth, setLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            if (user) {
                // User is signed in
                setUser({
                    uid: user.uid,
                    email: user.email || '',
                    role: 'user', // Default, maybe fetch capability later
                });

                // If on public pages (login/register), redirect to dashboard
                if (pathname === '/login' || pathname === '/register') {
                    router.push('/dashboard');
                }
            } else {
                // User is signed out
                clearAuth();
                // If on protected pages, optional redirect (middleware handles this mainly)
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, clearAuth, setLoading, router, pathname]);

    return <>{children}</>;
}
