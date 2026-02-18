'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, QuerySnapshot } from 'firebase/firestore';

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    const { uid, companyId, setCompany } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function checkCompany() {
            if (!uid) return;

            // Handle Mock User explicitly to prevent hanging/redirect loops
            if (uid === 'mock-user-123') {
                console.log('Mock user detected, setting dummy company...');
                setCompany({ id: 'mock-company-id', name: 'Mock Company Co., Ltd.' });
                return;
            }

            // If we already have companyId, no need to query
            if (companyId) return;

            try {
                // Wrap query in a timeout to prevent infinite hanging
                const queryPromise = new Promise<QuerySnapshot>((resolve, reject) => {
                    const timer = setTimeout(() => reject(new Error('Firestore timeout')), 5000);
                    const q = query(
                        collection(db, 'companies'),
                        where('owner_uid', '==', uid)
                    );
                    getDocs(q).then(res => {
                        clearTimeout(timer);
                        resolve(res);
                    }).catch(err => {
                        clearTimeout(timer);
                        reject(err);
                    });
                });

                const snap = await queryPromise;

                if (!snap.empty) {
                    const doc = snap.docs[0];
                    setCompany({ id: doc.id, name: doc.data().name });
                } else {
                    // No company found -> Redirect to assessment if not already there
                    if (pathname && !pathname.includes('/assessment')) {
                        console.log('No company profile found, redirecting to assessment...');
                        router.push('/assessment');
                    }
                }
            } catch (error) {
                console.error('Error checking company:', error);
                // If blocked/timeout, do NOT redirect. Let user navigate freely (or show error toast elsewhere)
            }
        }

        checkCompany();
    }, [uid, companyId, pathname, router, setCompany]);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
