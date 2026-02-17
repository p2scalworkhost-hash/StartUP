'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'แดชบอร์ด', icon: '📊' },
    { href: '/assessment', label: 'การประเมิน', icon: '📋' },
    { href: '/company', label: 'โปรไฟล์บริษัท', icon: '🏢' },
    { href: '/settings', label: 'ตั้งค่า', icon: '⚙️' },
];

const ADMIN_ITEMS = [
    { href: '/admin/laws', label: 'จัดการกฎหมาย', icon: '⚖️' },
    { href: '/admin/obligations', label: 'จัดการข้อกำหนด', icon: '📑' },
    { href: '/admin/companies', label: 'จัดการบริษัท', icon: '🏗️' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { role, companyName } = useAuthStore();
    const { isSidebarOpen } = useUIStore();

    if (!isSidebarOpen) return null;

    return (
        <aside className="sticky top-0 h-screen overflow-y-auto w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <span className="text-lg font-bold text-white">S</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white">SHEQ</h1>
                        <p className="text-xs text-slate-400">Platform</p>
                    </div>
                </div>
            </div>

            {/* Company */}
            {companyName && (
                <div className="px-6 py-3 border-b border-slate-800">
                    <p className="text-xs text-slate-500 mb-0.5">บริษัทปัจจุบัน</p>
                    <p className="text-sm text-slate-300 font-medium truncate">{companyName}</p>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map(item => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${isActive
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }
              `}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Admin section */}
                {role === 'admin' && (
                    <>
                        <div className="pt-4 pb-2">
                            <p className="px-3 text-xs text-slate-600 uppercase tracking-wider font-semibold">
                                Admin
                            </p>
                        </div>
                        {ADMIN_ITEMS.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-150
                    ${isActive
                                            ? 'bg-amber-500/10 text-amber-400'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }
                  `}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <p className="text-xs text-slate-600 text-center">v1.0.0</p>
            </div>
        </aside>
    );
}
