'use client';

import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { logout } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export function Header() {
    const { email, role } = useAuthStore();
    const { toggleSidebar } = useUIStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                {role === 'admin' && (
                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                        Admin
                    </span>
                )}

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                            {email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-700">{email || 'User'}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="ออกจากระบบ"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
