import { useAuth } from '@/shared/hooks/useAuth';
import { ROLES } from '@/shared/constants';
import StudentLayout from '@/shared/components/layout/StudentLayout';
import TrainerLayout from '@/shared/components/layout/TrainerLayout';
import AdminLayout from '@/shared/components/layout/AdminLayout';

/**
 * Dynamically renders the correct workspace shell (Admin, Student, or Trainer)
 * for shared routes like /profile depending on the active user's role.
 */
export function ProfileWorkspaceLayout() {
  const { hasRole } = useAuth();

  if (hasRole(ROLES.ADMIN)) {
    return <AdminLayout />;
  }

  if (hasRole(ROLES.TRAINER) && !hasRole(ROLES.STUDENT)) {
    return <TrainerLayout />;
  }

  return <StudentLayout />;
}

export default ProfileWorkspaceLayout;

