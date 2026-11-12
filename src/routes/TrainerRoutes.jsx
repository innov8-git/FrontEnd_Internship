import TrainerLayout from '@/shared/components/layout/TrainerLayout';
import { ROLES } from '@/shared/constants';
import ProtectedRoute from './ProtectedRoute';
import { ProfilePage, ReviewPage, TrainerDashboardPage, TrainerReportsPage } from './lazyPages';

export const trainerRoutes = {
  path: 'trainer',
  element: <ProtectedRoute roles={[ROLES.TRAINER]} />,
  children: [
    {
      element: <TrainerLayout />,
      children: [
        { index: true, element: <TrainerDashboardPage /> },
        { path: 'review/:submissionId', element: <ReviewPage /> },
        { path: 'reports', element: <TrainerReportsPage /> },
        { path: 'profile', element: <ProfilePage /> },
      ],
    },
  ],
};

export default trainerRoutes;
