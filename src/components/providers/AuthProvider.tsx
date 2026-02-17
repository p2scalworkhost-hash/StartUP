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
        const unsubscribe = onAuthChange(async (user) => {
            if (user) {
                // User is signed in
                setUser({
                    uid: user.uid,
                    email: user.email || '',
                    role: 'user',
                });

                // If on auth pages, sync session and redirect
                if (pathname === '/login' || pathname === '/register') {
                    try {
                        let token = 'mock-token';
                        if (typeof user.getIdToken === 'function') {
                            token = await user.getIdToken();
                        }

                        // Sync cookie
                        await fetch('/api/auth/session', {
                            method: 'POST',
                            body: JSON.stringify({ idToken: token }),
                        });

                        router.push('/dashboard');
                    } catch (err) {
                        console.error('Session sync failed:', err);
                    }
                }
            } else {
                // User is signed out
                clearAuth();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, clearAuth, setLoading, router, pathname]);

    return <>{children}</>;
}
