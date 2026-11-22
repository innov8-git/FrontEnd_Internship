import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '@/shared/hooks';
import { ROUTES, USE_MOCKS, paths } from '@/shared/constants';
import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';
import { AUTH_LINK_CLASS } from '../components/authStyles';
import { useLogin } from '../hooks/useLogin';

/** Demo credentials auto-filled in mock mode only. */
const DEMO_EMAIL = 'student@demo.dev';
const DEMO_PASSWORD = 'Password@123';

/** /login (SN3) — guest only; honours ?redirect= through useLogin. */
export function LoginPage() {
  useDocumentTitle('Log in');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isPending, error, redirectTo } = useLogin();
  const defaultEmail = typeof location.state?.email === 'string' ? location.state.email : '';

  // Auto-fill demo credentials only when running against the MSW mock API
  const redirectTarget = searchParams.get('redirect');
  const isInternshipRedirect = Boolean(
    USE_MOCKS &&
      redirectTarget &&
      (redirectTarget === ROUTES.CATALOG ||
        redirectTarget.includes('internship') ||
        redirectTarget.includes('assessment')),
  );
  const autoFillEmail = isInternshipRedirect && !defaultEmail ? DEMO_EMAIL : defaultEmail;
  const autoFillPassword = isInternshipRedirect && !defaultEmail ? DEMO_PASSWORD : '';

  return (
    <AuthCard
      title="Log in to your account"
      description={
        redirectTo
          ? 'Log in to continue where you left off.'
          : 'Welcome back. Enter your details to continue.'
      }
      showSocialAuth
      socialAuthMode="login"
      footer={
        <>
          New here?{' '}
          <Link to={paths.register(redirectTo)} className={AUTH_LINK_CLASS}>
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm
        onSubmit={login}
        isPending={isPending}
        error={error}
        defaultEmail={autoFillEmail}
        defaultPassword={autoFillPassword}
      />
    </AuthCard>
  );
}

export default LoginPage;
