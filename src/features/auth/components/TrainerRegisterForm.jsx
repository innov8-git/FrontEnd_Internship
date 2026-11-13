import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, PasswordInput, Select } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { Award, Building2, FileText, Globe, Info, Lock, Mail, User } from '@/shared/icons';
import { isErrorCode } from '@/shared/utils/errors';
import {
  EXPERIENCE_LEVELS,
  TRAINER_DOMAINS,
  TRAINER_REGISTER_DEFAULTS,
  trainerRegisterSchema,
} from '../schemas/authValidation';
import { AUTH_ERROR_CODES, applyKnownFieldErrors } from '../utils/authErrors';
import { AuthErrorBanner } from './AuthErrorBanner';
import { PasswordRules } from './PasswordRules';
import { AUTH_LINK_CLASS } from './authStyles';

const TRAINER_REGISTER_FIELDS = [
  'name',
  'email',
  'password',
  'confirmPassword',
  'domain',
  'experience',
  'organization',
  'linkedinUrl',
  'resumeUrl',
];
const EMAIL_TAKEN_ERROR = 'emailTaken';

export function TrainerRegisterForm({ onSubmit, isPending = false, loginTo = ROUTES.LOGIN, className }) {
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
    resolver: zodResolver(trainerRegisterSchema),
    mode: 'onTouched',
    defaultValues: { ...TRAINER_REGISTER_DEFAULTS },
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
      const field = applyKnownFieldErrors(error, setError, TRAINER_REGISTER_FIELDS);
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

        {/* Administrative Review Notice */}
        <div
          data-testid="trainer-review-note"
          className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300"
        >
          <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Trainer Onboarding:</strong> Trainer registrations undergo administrative review. Once verified by an administrator, mentor evaluation and project review privileges will be activated.
          </span>
        </div>

        <Input
          label="Full name"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="e.g. Dr. Jane Doe"
          leftIcon={User}
          hint="Displayed on student evaluation reports and mentor profile."
          error={errors.name}
          {...register('name')}
        />

        <Input
          label="Work or Personal Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="jane@company.com"
          leftIcon={Mail}
          hint="We'll send a 6-digit verification code to this address."
          error={emailError}
          {...register('email')}
        />

        {/* Trainer Qualifications Card */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <Award className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <span>Professional Qualifications</span>
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
              hint="e.g. Google, TCS, Freelance"
              error={errors.organization}
              {...register('organization')}
            />
          </div>

          <Input
            label="LinkedIn / Professional Profile URL"
            type="url"
            placeholder="https://linkedin.com/in/username"
            leftIcon={Globe}
            hint="Helps admin verify your background during review."
            error={errors.linkedinUrl}
            {...register('linkedinUrl')}
          />

          <Input
            label="Resume / CV Link (Google Drive / Cloud Link)"
            type="url"
            placeholder="https://drive.google.com/file/d/..."
            leftIcon={FileText}
            hint="Ensure link access is set to 'Anyone with the link can view'."
            error={errors.resumeUrl}
            {...register('resumeUrl')}
          />
        </div>

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
          {busy ? 'Submitting Application…' : 'Register as Trainer'}
        </Button>

        <p className="text-center text-xs leading-5 text-slate-500">
          By registering you agree to the{' '}
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

export default TrainerRegisterForm;

