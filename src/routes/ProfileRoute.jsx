import { ROLES } from '@/shared/constants';
import ProtectedRoute from './ProtectedRoute';
import { ProfileWorkspaceLayout } from './ProfileWorkspaceLayout';
import { ProfilePage } from './lazyPages';

export const profileRoute = {
  path: 'profile',
  element: <ProtectedRoute roles={[ROLES.STUDENT, ROLES.TRAINER]} />,
  children: [
    {
      element: <ProfileWorkspaceLayout />,
      children: [{ index: true, element: <ProfilePage /> }],
    },
  ],
};

export default profileRoute;

