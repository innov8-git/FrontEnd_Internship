import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, PasswordInput } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { Lock, Mail, User } from '@/shared/icons';
import { isErrorCode } from '@/shared/utils/errors';
import {
  STUDENT_REGISTER_DEFAULTS,
  studentRegisterSchema,
} from '../schemas/authValidation';
import { AUTH_ERROR_CODES, applyKnownFieldErrors } from '../utils/authErrors';
import { AuthErrorBanner } from './AuthErrorBanner';
import { PasswordRules } from './PasswordRules';
import { AUTH_LINK_CLASS } from './authStyles';

const STUDENT_REGISTER_FIELDS = ['name', 'email', 'password', 'confirmPassword'];
const EMAIL_TAKEN_ERROR = 'emailTaken';

export function StudentRegisterForm({ onSubmit, isPending = false, loginTo = ROUTES.LOGIN, className }) {
  const rulesId = useId();
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentRegisterSchema),
    mode: 'onTouched',
    defaultValues: { ...STUDENT_REGISTER_DEFAULTS },
  });

  const password = watch('password');

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit?.(values);
    } catch (error) {
      if (isErrorCode(error, AUTH_ERROR_CODES.EMAIL_TAKEN)) {
        setError(
          'email',
          { type: EMAIL_TAKEN_ERROR, message: 'An account with this email already exists.' },
          { shouldFocus: true },
        );
        return;
      }
      const field = applyKnownFieldErrors(error, setError, STUDENT_REGISTER_FIELDS);
      if (field) {
        setFocus(field);
        return;
      }
      setFormError(error);
    }
  });

  const emailError =
    errors.email?.type === EMAIL_TAKEN_ERROR ? (
      <>
        {errors.email.message}{' '}
        <Link
          to={loginTo}
          state={{ email: getValues('email') }}
          className="rounded-sm font-medium text-rose-700 underline underline-offset-2 hover:text-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          Log in instead
        </Link>
      </>
    ) : (
      errors.email
    );

  const busy = isSubmitting || isPending;

  return (
    <form onSubmit={submit} noValidate className={className}>
      <div className="space-y-5">
        {formError ? <AuthErrorBanner error={formError} /> : null}

        <Input
          label="Full name"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Your full name"
          leftIcon={User}
          hint="Shown on your certificate, so use your real name."
          error={errors.name}
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          leftIcon={Mail}
          hint="We'll send a 6-digit verification code to this address."
          error={emailError}
          {...register('email')}
        />

        <div className="space-y-3">
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            leftIcon={Lock}
            placeholder="Create a password"
            aria-describedby={rulesId}
            error={errors.password}
            {...register('password')}
          />
          <PasswordRules id={rulesId} value={password} />
        </div>

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          leftIcon={Lock}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" fullWidth loading={busy}>
          {busy ? 'Creating your account…' : 'Create Student Account'}
        </Button>

        <p className="text-center text-xs leading-5 text-slate-500">
          By creating an account you agree to the{' '}
          <Link
            to={ROUTES.TERMS}
            target="_blank"
            rel="noopener noreferrer"
            className={AUTH_LINK_CLASS}
          >
            Terms &amp; Conditions
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

export default StudentRegisterForm;

