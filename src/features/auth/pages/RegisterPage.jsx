import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/shared/hooks';
import { paths } from '@/shared/constants';
import { AuthCard } from '../components/AuthCard';
import { StudentRegisterForm } from '../components/StudentRegisterForm';
import { AUTH_LINK_CLASS } from '../components/authStyles';
import { useStudentRegister } from '../hooks/useRegister';

/** /register — dedicated guest page for student registration. */
export function RegisterPage() {
  useDocumentTitle('Create your account');
  const { registerStudent, isPending, redirectTo } = useStudentRegister();
  const loginTo = paths.login(redirectTo);
  const trainerRegisterTo = paths.registerTrainer(redirectTo);

  return (
    <AuthCard
      title="Create your student account"
      description="Take a short assessment, unlock your merit discount and start building real projects."
      showSocialAuth
      socialAuthMode="register"
      footer={
        <div className="space-y-2 text-center">
          <div>
            Already have an account?{' '}
            <Link to={loginTo} className={AUTH_LINK_CLASS}>
              Log in
            </Link>
          </div>
          <div className="text-xs text-slate-500">
            Want to mentor students?{' '}
            <Link to={trainerRegisterTo} className={AUTH_LINK_CLASS}>
              Apply as a Trainer
            </Link>
          </div>
        </div>
      }
    >
      <StudentRegisterForm onSubmit={registerStudent} isPending={isPending} loginTo={loginTo} />
    </AuthCard>
  );
}

export default RegisterPage;
