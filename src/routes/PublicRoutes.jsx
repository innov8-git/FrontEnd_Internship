import { Navigate } from 'react-router-dom';
import Layout from '@/shared/components/layout/Layout';
import CatalogWorkspaceLayout from './CatalogWorkspaceLayout';
import {
  CatalogPage,
  DesignationDetailPage,
  ForbiddenPage,
  HomePage,
  NotFoundPage,
  TeamInvitePage,
  TermsPage,
  TrainerRegisterPage,
  UiKitPage,
  VerifyCertificatePage,
} from './lazyPages';

/** Public marketing, catalog, terms, certificate verification and team-invite pages. */
export const publicRoutes = {
  children: [
    {
      element: <CatalogWorkspaceLayout />,
      children: [
        { path: 'internships', element: <CatalogPage /> },
        { path: 'internships/:slug', element: <DesignationDetailPage /> },
      ],
    },
    {
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'register/trainer', element: <TrainerRegisterPage /> },
        { path: 'domain-assessment', element: <Navigate to="/internships" replace /> },
        { path: 'terms', element: <TermsPage /> },
        { path: 'verify', element: <VerifyCertificatePage /> },
        { path: 'verify/:number', element: <VerifyCertificatePage /> },
        { path: 'team/invite/:token', element: <TeamInvitePage /> },
        { path: 'dev/ui', element: <UiKitPage /> },
        { path: '403', element: <ForbiddenPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
};

export default publicRoutes;
