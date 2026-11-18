import { z } from 'zod';
import { PROFILE_NAME_MAX, PROFILE_NAME_MIN } from './profileValidation';

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^(https?:\/\/)?([\w.-]+)+([/\w\-._~:?#[\]@!$&'()*+,;=.]*)*$/i.test(val),
    { message: 'Enter a valid web link (e.g. https://linkedin.com/in/username).' },
  );

/**
 * Validation schema for Administrator profile details:
 * Name, professional headline, phone, department, organization, location, linkedin, and bio.
 */
export const adminProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter your full name.')
    .min(PROFILE_NAME_MIN, `Your name must be at least ${PROFILE_NAME_MIN} characters.`)
    .max(PROFILE_NAME_MAX, `Your name must be ${PROFILE_NAME_MAX} characters or fewer.`)
    .regex(/\p{L}/u, 'Your name must contain letters.'),
  headline: z
    .string()
    .trim()
    .max(120, 'Headline must be 120 characters or fewer.')
    .optional(),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number must be 25 characters or fewer.')
    .optional()
    .refine(
      (val) => !val || /^[+0-9\s\-()]{7,25}$/.test(val),
      { message: 'Enter a valid phone number (e.g. +91 98765 43210).' },
    ),
  department: z
    .string()
    .trim()
    .max(120, 'Department name must be 120 characters or fewer.')
    .optional(),
  organization: z
    .string()
    .trim()
    .max(120, 'Organization name must be 120 characters or fewer.')
    .optional(),
  location: z
    .string()
    .trim()
    .max(100, 'Location must be 100 characters or fewer.')
    .optional(),
  linkedinUrl: optionalUrl,
  bio: z
    .string()
    .trim()
    .max(600, 'Bio must be 600 characters or fewer.')
    .optional(),
});

export default adminProfileSchema;

