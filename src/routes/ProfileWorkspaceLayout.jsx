import { useAuth } from '@/shared/hooks/useAuth';
import { ROLES } from '@/shared/constants';
import StudentLayout from '@/shared/components/layout/StudentLayout';
import TrainerLayout from '@/shared/components/layout/TrainerLayout';

/**
 * Dynamically renders the correct workspace shell (Student or Trainer)
 * for shared routes like /profile depending on the active user's role.
 */
export function ProfileWorkspaceLayout() {
  const { hasRole } = useAuth();

  if (hasRole(ROLES.TRAINER) && !hasRole(ROLES.STUDENT)) {
    return <TrainerLayout />;
  }

  return <StudentLayout />;
}

export default ProfileWorkspaceLayout;

