import { useAuth } from '@/shared/hooks/useAuth';
import { ROLES } from '@/shared/constants';
import Layout from '@/shared/components/layout/Layout';
import StudentLayout from '@/shared/components/layout/StudentLayout';
import TrainerLayout from '@/shared/components/layout/TrainerLayout';

/**
 * Dynamically renders the correct workspace shell for catalog pages:
 * - If a Student is logged in: renders StudentLayout (with student sidebar).
 * - If a Trainer is logged in: renders TrainerLayout (with trainer sidebar).
 * - If unauthenticated: renders public Layout (navbar + footer, no sidebar).
 */
export function CatalogWorkspaceLayout() {
  const { isAuthenticated, hasRole } = useAuth();

  if (isAuthenticated && hasRole(ROLES.STUDENT)) {
    return <StudentLayout />;
  }

  if (isAuthenticated && hasRole(ROLES.TRAINER)) {
    return <TrainerLayout />;
  }

  return <Layout />;
}

export default CatalogWorkspaceLayout;

