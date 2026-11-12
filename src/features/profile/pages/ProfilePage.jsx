import { PageHeader, PageLoader } from '@/shared/components/ui';
import { useEnrollments } from '@/features/applications/hooks/useApplications';
import { useMyTeams } from '@/features/teams/hooks/useMyTeams';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { ROLES } from '@/shared/constants';
import { AccountDetails } from '../components/AccountDetails';
import { ProfileForm } from '../components/ProfileForm';
import { TrainerProfileForm } from '../components/TrainerProfileForm';
import { ProfileGithubSection } from '../components/ProfileGithubSection';
import { ResumeSection } from '../components/ResumeSection';
import { useProfile } from '../hooks/useProfile';
import { useScrollToHash } from '../hooks/useScrollToHash';

/**
 * /profile (GP11):
 *  - For Students: account details, editable name, GitHub connection and internship record.
 *  - For Trainers: account details, editable trainer qualifications (domain, experience, org, linkedin) and resume.
 */
export default function ProfilePage() {
  useDocumentTitle('Profile');
  const { user } = useProfile();
  const isTrainer = Boolean(user?.roles?.includes(ROLES.TRAINER));

  const enrollmentsQuery = useEnrollments({ enabled: !isTrainer });
  const teamsQuery = useMyTeams({ enabled: !isTrainer });

  // Wait until the GitHub section has its final layout before jumping to #github (students only).
  useScrollToHash(!isTrainer && Boolean(user) && !enrollmentsQuery.isLoading && !teamsQuery.isLoading);

  if (!user) return <PageLoader label="Loading your profile…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description={
          isTrainer
            ? 'Manage your personal details, professional qualifications, mentoring domain, and resume.'
            : 'Manage your account, your GitHub connection and your internship record.'
        }
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <AccountDetails user={user} className="xl:col-span-2" />
        {isTrainer ? (
          <TrainerProfileForm user={user} className="xl:col-span-3" />
        ) : (
          <ProfileForm user={user} className="xl:col-span-3" />
        )}
      </div>

      {!isTrainer ? (
        <>
          <ProfileGithubSection className="pt-2" />
          <ResumeSection className="pt-2" />
        </>
      ) : null}
    </div>
  );
}
