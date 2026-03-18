'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, ExternalLink, LogOut } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: '링크 관리', icon: LayoutDashboard },
  { href: '/dashboard/settings', label: '설정', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-surface-secondary">
        <aside className="fixed left-0 top-0 z-10 flex h-full w-64 flex-col border-r border-border bg-surface">
          <div className="border-b border-border p-6">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              MyLight Link
            </Link>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-text-secondary hover:bg-surface-secondary hover:text-text',
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border p-4">
            {user?.page?.slug && (
              <a
                href={`/${user.page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-surface-secondary hover:text-text"
              >
                <ExternalLink size={16} />
                내 페이지 보기
              </a>
            )}
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-red-50 hover:text-danger"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
