import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, toast } from '@/shared/components/ui';
import { useAuth, useDocumentTitle } from '@/shared/hooks';
import { getHomeRoute, getSafeRedirect, hasRole, paths, ROLES, ROUTES } from '@/shared/constants';
import { ArrowLeft, ArrowRight, KeyRound, MailCheck, RefreshCw } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { getErrorMessage } from '@/shared/utils/errors';
import { isValidEmail } from '@/shared/utils/helpers';
import { AuthCard } from '../components/AuthCard';
import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { ResendVerificationForm } from '../components/ResendVerificationForm';
import { AUTH_LINK_CLASS } from '../components/authStyles';
import { useCooldown } from '../hooks/useCooldown';
import * as authService from '@/services/authService';

export function CheckEmailPage() {
  useDocumentTitle('Verify your email');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loginWithOtp } = useAuth();

  const paramEmail = (searchParams.get('email') ?? '').trim();
  const fallbackEmail = user && !user.emailVerified ? (user.email ?? '') : '';
  const email = isValidEmail(paramEmail) ? paramEmail : fallbackEmail;
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  // 60-second cooldown for OTP resends
  const cooldown = useCooldown(60);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!email || otp.trim().length !== 6) return;

    setIsVerifying(true);
    setVerifyError(null);

    try {
      const verifiedUser = await loginWithOtp({ email, otp: otp.trim() });
      toast.success('Email verified successfully!');
      const target =
        redirectTo &&
        redirectTo !== ROUTES.LOGIN &&
        !redirectTo.startsWith('/register') &&
        !redirectTo.startsWith('/check-email')
          ? redirectTo
          : getHomeRoute(verifiedUser);
      navigate(target, { replace: true });
    } catch (err) {
      setVerifyError(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || cooldown.isActive || isResending) return;
    setIsResending(true);
    try {
      await authService.resendOtp({ email, purpose: 'REGISTRATION_VERIFY' });
      cooldown.start();
      toast.success('Verification code sent!', {
        description: 'A new 6-digit OTP has been sent to your email address.',
      });
    } catch (err) {
      toast.error('Failed to resend code', {
        description: getErrorMessage(err, 'Please wait and try again shortly.'),
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard
      align="center"
      icon={MailCheck}
      title="Enter verification code"
      description={
        email ? (
          <>
            We sent a 6-digit OTP code to{' '}
            <span className="break-all font-medium text-slate-900 dark:text-slate-100">{email}</span>.
            The code expires in 5 minutes.
          </>
        ) : (
          'Enter the 6-digit verification code sent to your email.'
        )
      }
      footer={
        <Link
          to={paths.login(redirectTo)}
          className={cn(AUTH_LINK_CLASS, 'inline-flex items-center gap-1.5')}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to log in
        </Link>
      }
    >
      <div className="space-y-5">
        {verifyError ? <AuthErrorBanner error={verifyError} /> : null}

        {email ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              label="6-Digit OTP Code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              placeholder="e.g. 123456"
              leftIcon={KeyRound}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              hint="Check your inbox or spam folder for the code."
              required
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              rightIcon={ArrowRight}
              loading={isVerifying}
              disabled={otp.trim().length !== 6 || isVerifying}
            >
              {isVerifying ? 'Verifying code…' : 'Verify & Continue'}
            </Button>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                disabled={cooldown.isActive || isResending}
                onClick={handleResendOtp}
                className={cn(
                  'font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400',
                  cooldown.isActive ? 'cursor-not-allowed text-slate-400' : 'underline cursor-pointer',
                )}
              >
                {cooldown.isActive
                  ? `Resend available in ${cooldown.remaining}s`
                  : isResending
                    ? 'Sending…'
                    : 'Resend code'}
              </button>
            </div>
          </form>
        ) : (
          <ResendVerificationForm submitLabel="Send verification code" />
        )}

        {user ? null : (
          <p className="text-center text-xs text-slate-500">
            Entered the wrong email?{' '}
            <Link to={paths.register(redirectTo)} className={AUTH_LINK_CLASS}>
              Register again
            </Link>
          </p>
        )}
      </div>
    </AuthCard>
  );
}

export default CheckEmailPage;
