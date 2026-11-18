import { PageHeader, PageLoader } from '@/shared/components/ui';
import { useEnrollments } from '@/features/applications/hooks/useApplications';
import { useMyTeams } from '@/features/teams/hooks/useMyTeams';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { ROLES } from '@/shared/constants';
import { AccountDetails } from '../components/AccountDetails';
import { ProfileForm } from '../components/ProfileForm';
import { TrainerProfileForm } from '../components/TrainerProfileForm';
import { AdminProfileForm } from '../components/AdminProfileForm';
import { ProfileGithubSection } from '../components/ProfileGithubSection';
import { ResumeSection } from '../components/ResumeSection';
import { useProfile } from '../hooks/useProfile';
import { useScrollToHash } from '../hooks/useScrollToHash';

/**
 * /profile and /admin/profile (GP11):
 *  - For Students: account details, editable name, GitHub connection and internship record.
 *  - For Trainers: account details, editable trainer qualifications (domain, experience, org, linkedin) and resume.
 *  - For Admins: account details, editable administrator credentials (name, headline, phone, department, organization, location, linkedin, bio) and profile picture management.
 */
export default function ProfilePage() {
  useDocumentTitle('Profile');
  const { user } = useProfile();
  const isAdmin = Boolean(user?.roles?.includes(ROLES.ADMIN));
  const isTrainer = !isAdmin && Boolean(user?.roles?.includes(ROLES.TRAINER));
  const isStudent = !isAdmin && !isTrainer;

  const enrollmentsQuery = useEnrollments({ enabled: isStudent });
  const teamsQuery = useMyTeams({ enabled: isStudent });

  // Wait until the GitHub section has its final layout before jumping to #github (students only).
  useScrollToHash(isStudent && Boolean(user) && !enrollmentsQuery.isLoading && !teamsQuery.isLoading);

  if (!user) return <PageLoader label="Loading your profile…" />;

  const getPageDescription = () => {
    if (isAdmin) {
      return 'Manage your administrator details, profile picture, contact information, and account settings.';
    }
    if (isTrainer) {
      return 'Manage your personal details, professional qualifications, mentoring domain, and resume.';
    }
    return 'Manage your personal details, profile picture, academic background, and internship record.';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? 'Administrator Profile' : 'Profile'}
        description={getPageDescription()}
      />

      <div className="grid gap-6 xl:grid-cols-5 items-start">
        <AccountDetails user={user} className="xl:col-span-2" />
        {isAdmin ? (
          <AdminProfileForm user={user} className="xl:col-span-3" />
        ) : isTrainer ? (
          <TrainerProfileForm user={user} className="xl:col-span-3" />
        ) : (
          <ProfileForm user={user} className="xl:col-span-3" />
        )}
      </div>

      {isStudent ? (
        <>
          <ProfileGithubSection className="pt-2" />
          <ResumeSection className="pt-2" />
        </>
      ) : null}
    </div>
  );
}
