import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/shared/hooks';
import { paths } from '@/shared/constants';
import { AuthCard } from '../components/AuthCard';
import { TrainerRegisterForm } from '../components/TrainerRegisterForm';
import { AUTH_LINK_CLASS } from '../components/authStyles';
import { useTrainerRegister } from '../hooks/useRegister';

/** /register/trainer — dedicated onboarding page for industry mentors and trainers. */
export function TrainerRegisterPage() {
  useDocumentTitle('Apply as Trainer & Mentor');
  const { registerTrainer, isPending, redirectTo } = useTrainerRegister();
  const loginTo = paths.login(redirectTo);
  const studentRegisterTo = paths.register(redirectTo);

  return (
    <AuthCard
      title="Join as Industry Mentor"
      description="Empower the next generation of engineers. Guide student capstone projects and evaluate industry-level assignments."
      footer={
        <div className="space-y-2 text-center">
          <div>
            Already have an account?{' '}
            <Link to={loginTo} className={AUTH_LINK_CLASS}>
              Log in
            </Link>
          </div>
          <div className="text-xs text-slate-500">
            Are you a student looking for internships?{' '}
            <Link to={studentRegisterTo} className={AUTH_LINK_CLASS}>
              Register as Student
            </Link>
          </div>
        </div>
      }
    >
      <TrainerRegisterForm onSubmit={registerTrainer} isPending={isPending} loginTo={loginTo} />
    </AuthCard>
  );
}

export default TrainerRegisterPage;

