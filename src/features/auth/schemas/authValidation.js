import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@/shared/constants';

/**
 * Client-side validation for the auth screens (SN3, SN4). The server re-validates everything;
 * these schemas only give fast, friendly feedback before a request is sent.
 */

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 80;
export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MAX_LENGTH = 128;

/** Shown live under new-password fields. `requirement` is used inside sentences. */
export const PASSWORD_RULES = Object.freeze([
  {
    id: 'length',
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    requirement: `at least ${PASSWORD_MIN_LENGTH} characters`,
    test: (value) => String(value ?? '').length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: 'letter',
    label: 'At least one letter',
    requirement: 'a letter',
    test: (value) => /[A-Za-z]/.test(String(value ?? '')),
  },
  {
    id: 'number',
    label: 'At least one number',
    requirement: 'a number',
    test: (value) => /\d/.test(String(value ?? '')),
  },
]);

/** [{ id, label, passed }] for the PasswordRules checklist. */
export function getPasswordRuleResults(value) {
  return PASSWORD_RULES.map((rule) => ({ id: rule.id, label: rule.label, passed: rule.test(value) }));
}

export function isPasswordStrongEnough(value) {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

/** ['a', 'b', 'c'] -> "a, b and c" */
function joinWithAnd(parts) {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

const emailField = z
  .string({ required_error: 'Enter your email address.' })
  .trim()
  .min(1, 'Enter your email address.')
  .max(EMAIL_MAX_LENGTH, 'This email address is too long.')
  .email('Enter a valid email address, like name@example.com.');

function newPasswordField(emptyMessage) {
  return z
    .string({ required_error: emptyMessage })
    .max(PASSWORD_MAX_LENGTH, `Use ${PASSWORD_MAX_LENGTH} characters or fewer.`)
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: emptyMessage });
        return;
      }
      const missing = PASSWORD_RULES.filter((rule) => !rule.test(value));
      if (missing.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Your password needs ${joinWithAnd(missing.map((rule) => rule.requirement))}.`,
        });
      }
    });
}

const nameField = z
  .string({ required_error: 'Enter your full name.' })
  .trim()
  .min(1, 'Enter your full name.')
  .min(NAME_MIN_LENGTH, `Your name needs at least ${NAME_MIN_LENGTH} characters.`)
  .max(NAME_MAX_LENGTH, `Use ${NAME_MAX_LENGTH} characters or fewer.`);

/** Login only checks presence: older accounts may predate the current password rules. */
export const loginSchema = z.object({
  email: emailField,
  password: z.string({ required_error: 'Enter your password.' }).min(1, 'Enter your password.'),
});

export const TRAINER_DOMAINS = Object.freeze([
  'Full Stack Web Development',
  'AI & Machine Learning',
  'Data Science & Analytics',
  'Cloud & DevOps Engineering',
  'Cybersecurity & Ethical Hacking',
  'Mobile App Development',
  'UI/UX Design & Product',
]);

export const EXPERIENCE_LEVELS = Object.freeze([
  '1-2 years',
  '3-5 years',
  '5-8 years',
  '8+ years',
]);

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: newPasswordField('Create a password.'),
    confirmPassword: z
      .string({ required_error: 'Confirm your password.' })
      .min(1, 'Confirm your password.'),
    role: z.enum(['STUDENT', 'TRAINER']).default('STUDENT'),
    domain: z.string().optional(),
    experience: z.string().optional(),
    linkedinUrl: z.string().optional(),
    organization: z.string().optional(),
  })
  .refine((values) => !values.confirmPassword || values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match.",
  })
  .refine(
    (values) =>
      values.role !== 'TRAINER' || (typeof values.domain === 'string' && values.domain.trim().length > 0),
    {
      path: ['domain'],
      message: 'Select your primary mentoring domain.',
    },
  )
  .refine(
    (values) =>
      values.role !== 'TRAINER' ||
      (typeof values.experience === 'string' && values.experience.trim().length > 0),
    {
      path: ['experience'],
      message: 'Select your years of experience.',
    },
  )
  .refine(
    (values) => {
      if (!values.linkedinUrl || values.linkedinUrl.trim() === '') return true;
      try {
        const url = new URL(values.linkedinUrl);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    {
      path: ['linkedinUrl'],
      message: 'Enter a valid URL (e.g. https://linkedin.com/in/username).',
    },
  );

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resendSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: newPasswordField('Create a new password.'),
    confirmPassword: z
      .string({ required_error: 'Re-enter your new password.' })
      .min(1, 'Re-enter your new password.'),
  })
  .refine((values) => !values.confirmPassword || values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match.",
  });

export const LOGIN_DEFAULTS = Object.freeze({ email: '', password: '' });
export const REGISTER_DEFAULTS = Object.freeze({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'STUDENT',
  domain: '',
  experience: '',
  linkedinUrl: '',
  organization: '',
});
export const RESET_PASSWORD_DEFAULTS = Object.freeze({ password: '', confirmPassword: '' });
