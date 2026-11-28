import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ROLES } from '@/shared/constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { PageLoader } from '@/shared/components/ui';
import { NotFoundPage, TpoPortalPage } from './lazyPages';

/**
 * Stealth route guard for the private TPO portal.
 * - Unauthenticated guests, Students, and Trainers see a standard 404 NotFoundPage
 *   (never a 403 or login redirect that would disclose the hidden route's existence).
 * - Only authenticated users holding TPO or ADMIN roles can render the portal.
 */
// eslint-disable-next-line react-refresh/only-export-components
function StealthTpoGuard() {
  const { status, hasAnyRole } = useAuth();

  if (status === 'loading') {
    return <PageLoader fullScreen label="Loading…" />;
  }

  if (status !== 'authenticated' || !hasAnyRole([ROLES.TPO, ROLES.ADMIN])) {
    return (
      <Suspense fallback={<PageLoader fullScreen />}>
        <NotFoundPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader fullScreen />}>
      <Outlet />
    </Suspense>
  );
}

export const tpoRoutes = {
  path: 'tpo',
  element: <StealthTpoGuard />,
  children: [
    { index: true, element: <TpoPortalPage /> },
    { path: 'portal', element: <TpoPortalPage /> },
  ],
};

export default tpoRoutes;
