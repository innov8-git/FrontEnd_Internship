import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, PasswordInput, Select } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { Award, Briefcase, Building2, Globe, GraduationCap, Info, Lock, Mail, User } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { isErrorCode } from '@/shared/utils/errors';
import {
  EXPERIENCE_LEVELS,
  REGISTER_DEFAULTS,
  TRAINER_DOMAINS,
  registerSchema,
} from '../schemas/authValidation';
import { AUTH_ERROR_CODES, applyKnownFieldErrors } from '../utils/authErrors';
import { AuthErrorBanner } from './AuthErrorBanner';
import { PasswordRules } from './PasswordRules';
import { AUTH_LINK_CLASS } from './authStyles';

const REGISTER_FIELDS = [
  'name',
  'email',
  'password',
  'confirmPassword',
  'role',
  'domain',
  'experience',
  'linkedinUrl',
  'organization',
];
const EMAIL_TAKEN_ERROR = 'emailTaken';

/**
 * Registration form (SN3):
 *  - Role selection toggle: Student vs Trainer onboarding
 *  - Name, email, password with live rules checklist
 *  - Confirm password field with matching validation
 *  - Conditional Trainer onboarding fields (Domain, Experience, Organization, LinkedIn)
 *
 * `onSubmit(values)` must return a promise that rejects with the ApiError on failure:
 *  - 409 EMAIL_TAKEN -> field error on email with a "Log in instead" link (`loginTo`)
 *  - 422 -> server messages under the matching fields
 *  - anything else (offline, 5xx) -> a form-level banner; the form keeps what was typed
 */
export function RegisterForm({ onSubmit, isPending = false, loginTo = ROUTES.LOGIN, className }) {
  const rulesId = useId();
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { ...REGISTER_DEFAULTS },
  });

  const password = watch('password');
  const selectedRole = watch('role') || 'STUDENT';

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
      const field = applyKnownFieldErrors(error, setError, REGISTER_FIELDS);
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

        {/* Role Selection Toggle */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            I am registering as:
          </label>
          <div
            role="radiogroup"
            aria-label="I am registering as"
            className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedRole === 'STUDENT'}
              data-testid="role-student"
              onClick={() => setValue('role', 'STUDENT', { shouldDirty: true, shouldValidate: true })}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-sm font-medium transition-all duration-150 select-none',
                selectedRole === 'STUDENT'
                  ? 'bg-white text-brand-700 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:text-brand-300 dark:ring-slate-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Student</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={selectedRole === 'TRAINER'}
              data-testid="role-trainer"
              onClick={() => setValue('role', 'TRAINER', { shouldDirty: true, shouldValidate: true })}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-sm font-medium transition-all duration-150 select-none',
                selectedRole === 'TRAINER'
                  ? 'bg-white text-brand-700 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:text-brand-300 dark:ring-slate-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              <Briefcase className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Trainer</span>
            </button>
          </div>
          <input type="hidden" {...register('role')} />

          {selectedRole === 'TRAINER' ? (
            <div
              data-testid="trainer-review-note"
              className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300 animate-fade-in"
            >
              <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Trainer Onboarding:</strong> Trainer registrations are placed under administrative review. Once verified by an admin, trainer evaluation and review privileges will be unlocked.
              </span>
            </div>
          ) : null}
        </div>

        <Input
          label="Full name"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Your full name"
          leftIcon={User}
          hint={
            selectedRole === 'TRAINER'
              ? 'Displayed on student review reports and trainer profile.'
              : 'Shown on your certificate, so use your real name.'
          }
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
          hint="We'll send a verification link to this address."
          error={emailError}
          {...register('email')}
        />

        {/* Trainer-Specific Mentoring Profile Fields */}
        {selectedRole === 'TRAINER' ? (
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              <Award className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span>Trainer Qualifications</span>
            </div>

            <Select
              label="Primary Mentoring Domain"
              placeholder="Select your domain of expertise"
              options={TRAINER_DOMAINS}
              error={errors.domain}
              required
              {...register('domain')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Years of Experience"
                placeholder="Select experience"
                options={EXPERIENCE_LEVELS}
                error={errors.experience}
                required
                {...register('experience')}
              />

              <Input
                label="Current Organization"
                placeholder="Company / Institution"
                leftIcon={Building2}
                hint="e.g. Google, Infosys, Freelance"
                error={errors.organization}
                {...register('organization')}
              />
            </div>

            <Input
              label="LinkedIn / Portfolio Profile URL"
              type="url"
              placeholder="https://linkedin.com/in/username"
              leftIcon={Globe}
              hint="Helps admin verify your background during review."
              error={errors.linkedinUrl}
              {...register('linkedinUrl')}
            />
          </div>
        ) : null}

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
          {busy
            ? 'Creating your account…'
            : selectedRole === 'TRAINER'
              ? 'Register as Trainer'
              : 'Create account'}
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

export default RegisterForm;
