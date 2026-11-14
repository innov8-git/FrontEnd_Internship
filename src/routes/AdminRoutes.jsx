import AdminLayout from '@/shared/components/layout/AdminLayout';
import { ROLES } from '@/shared/constants';
import ProtectedRoute from './ProtectedRoute';
import {
  AdminCertificatesPage,
  AdminDashboardPage,
  AdminPaymentsPage,
  AssignmentsPage,
  AuditLogPage,
  DesignationsPage,
  DomainsPage,
  ProjectsPage,
  ProjectAssignmentsPage,
  DomainQuestionsPage,
  PlansPage,
  TrainersPage,
  UsersPage,
} from './lazyPages';

export const adminRoutes = {
  path: 'admin',
  element: <ProtectedRoute roles={[ROLES.ADMIN]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'users', element: <UsersPage /> },
        { path: 'designations', element: <DesignationsPage /> },
        { path: 'domains', element: <DomainsPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'project-assignments', element: <ProjectAssignmentsPage /> },
        { path: 'domains/:domainId/questions', element: <DomainQuestionsPage /> },
        { path: 'plans', element: <PlansPage /> },
        { path: 'payments', element: <AdminPaymentsPage /> },
        { path: 'assignments', element: <AssignmentsPage /> },
        { path: 'trainers', element: <TrainersPage /> },
        { path: 'certificates', element: <AdminCertificatesPage /> },
        { path: 'audit', element: <AuditLogPage /> },
      ],
    },
  ],
};

export default adminRoutes;
