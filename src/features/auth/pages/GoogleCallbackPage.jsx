import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, ErrorState, Spinner, toast } from '@/shared/components/ui';
import { GoogleIcon } from '@/shared/icons';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { ROUTES, getHomeRoute, getSafeRedirect } from '@/shared/constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { describeAuthError } from '../utils/authErrors';

function ProgressCard({ title, description }) {
  return (
    <Card padding="lg" className="mx-auto max-w-lg text-center dark:border-slate-800 dark:bg-slate-900">
      <div role="status" className="flex flex-col items-center gap-4 py-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 ring-8 ring-slate-100 dark:bg-slate-800 dark:ring-slate-800/60">
          <GoogleIcon className="h-7 w-7" aria-hidden="true" />
        </span>
        <span aria-hidden="true" className="text-brand-600 dark:text-brand-400">
          <Spinner size="md" />
        </span>
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
    </Card>
  );
}

/**
 * /auth/google/callback: Finishes the Google OAuth redirect flow safely.
 * Handles `?code=`, `?credential=`, and OAuth error params (`?error=access_denied`).
 */
export default function GoogleCallbackPage() {
  useDocumentTitle('Signing in with Google');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const startedRef = useRef(false);
  const mountedRef = useRef(true);
  const [exchangeError, setExchangeError] = useState(null);

  const code = searchParams.get('code');
  const credential = searchParams.get('credential');
  const oauthError = searchParams.get('error');
  const redirectTo = getSafeRedirect(searchParams.get('redirect')) || getSafeRedirect(searchParams.get('state'));

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    if (oauthError) return;

    if (code || credential) {
      startedRef.current = true;
      loginWithGoogle(code ? { code } : { credential })
        .then((user) => {
          toast.success('Welcome back! Signed in with Google.');
          if (mountedRef.current) {
            navigate(redirectTo ?? getHomeRoute(user), { replace: true });
          }
        })
        .catch((err) => {
          if (mountedRef.current) {
            setExchangeError(err ?? new Error('Google authorization could not be completed.'));
          }
        });
    }
  }, [code, credential, loginWithGoogle, navigate, oauthError, redirectTo]);

  const backToLogin = () => navigate(ROUTES.LOGIN, { replace: true });

  let content;
  if (oauthError) {
    const isCancelled = oauthError === 'access_denied';
    content = (
      <Card className="mx-auto max-w-lg dark:border-slate-800 dark:bg-slate-900">
        <ErrorState
          compact
          title={isCancelled ? 'Google Sign-in was cancelled' : 'Google Sign-in failed'}
          message={
            isCancelled
              ? 'You cancelled Google sign-in. No changes were made to your account.'
              : 'Google reported an authorization issue. Please try signing in again.'
          }
          onRetry={backToLogin}
          retryLabel="Back to Login"
        />
      </Card>
    );
  } else if (!code && !credential) {
    content = (
      <Card className="mx-auto max-w-lg dark:border-slate-800 dark:bg-slate-900">
        <ErrorState
          compact
          title="Nothing to finish here"
          message="This page completes Google sign-in. Start again from the login page."
          onRetry={backToLogin}
          retryLabel="Go to Login"
        />
      </Card>
    );
  } else if (exchangeError) {
    const errorDetails = describeAuthError(exchangeError);
    content = (
      <Card className="mx-auto max-w-lg dark:border-slate-800 dark:bg-slate-900">
        <ErrorState
          compact
          title={errorDetails?.title || 'Google sign-in did not complete'}
          message={errorDetails?.description || 'We could not complete your sign-in with Google. Please try again.'}
          onRetry={backToLogin}
          retryLabel="Try again"
        />
      </Card>
    );
  } else {
    content = (
      <ProgressCard
        title="Signing in with Google…"
        description="Verifying your account details. This only takes a moment."
      />
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      {content}
    </div>
  );
}
