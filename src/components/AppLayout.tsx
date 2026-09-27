import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrentUserQuery } from '@/queries/auth.queries';
import { ROUTES } from '@/routes/paths';
import ThemeSelect from '@/components/ThemeSelect';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();
  const isAuthRoute = pathname === ROUTES.login || pathname === ROUTES.register;
  const { data: user, isLoading: isUserLoading } = useCurrentUserQuery();
  const userLabel = user?.displayName || user?.email || '';
  const userInitials = userLabel
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to={ROUTES.home} aria-label="Tech Battle, về trang chủ">
          <span className="brand-mark" aria-hidden="true">
            TB
          </span>
          <span>Tech Battle</span>
        </Link>
        <nav className="site-actions" aria-label={isAuthRoute ? 'Tùy chọn trang' : 'Tài khoản'}>
          {!isAuthRoute && (
            <>
              {isUserLoading ? (
                <span className="account-loading" aria-label="Đang tải tài khoản" />
              ) : user ? (
                <Link className="account-link" to={ROUTES.profile}>
                  <span className="account-avatar" aria-hidden="true">
                    {userInitials}
                  </span>
                  <span className="account-name">{userLabel}</span>
                </Link>
              ) : (
                <>
                  <Link className="auth-link" to={ROUTES.login}>
                    Đăng nhập
                  </Link>
                  <Link className="auth-link auth-link--primary" to={ROUTES.register}>
                    Đăng ký
                  </Link>
                </>
              )}
            </>
          )}
          <ThemeSelect />
        </nav>
      </header>
      <div className="app-content">{children}</div>
    </div>
  );
}
