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

  return (
    <AuthCard
      title="Create your student account"
      description="Take a short assessment, unlock your merit discount and start building real projects."
      showSocialAuth
      socialAuthMode="register"
      footer={
        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to={loginTo} className={AUTH_LINK_CLASS}>
            Log in
          </Link>
        </div>
      }
    >
      <StudentRegisterForm onSubmit={registerStudent} isPending={isPending} loginTo={loginTo} />
    </AuthCard>
  );
}

export default RegisterPage;
