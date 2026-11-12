import { z } from 'zod';

export const PROFILE_NAME_MIN = 2;
export const PROFILE_NAME_MAX = 80;

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^(https?:\/\/)?([\w.-]+)+([/\w\-._~:?#[\]@!$&'()*+,;=.]*)*$/i.test(val),
    { message: 'Enter a valid web link (e.g. https://linkedin.com/in/username).' },
  );

/**
 * Editable profile fields (GP11). The server re-validates; these rules give immediate feedback.
 * Supports personal details, academic background, contact information, and portfolio links.
 */
export const profileSchema = z.object({
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
  college: z
    .string()
    .trim()
    .max(120, 'College / University name must be 120 characters or fewer.')
    .optional(),
  degree: z
    .string()
    .trim()
    .max(100, 'Degree must be 100 characters or fewer.')
    .optional(),
  graduationYear: z
    .string()
    .trim()
    .max(4, 'Graduation year must be 4 digits.')
    .optional()
    .refine(
      (val) => !val || /^(19|20)\d{2}$/.test(val),
      { message: 'Enter a valid 4-digit graduation year (e.g. 2026).' },
    ),
  location: z
    .string()
    .trim()
    .max(100, 'Location must be 100 characters or fewer.')
    .optional(),
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  bio: z
    .string()
    .trim()
    .max(600, 'Bio must be 600 characters or fewer.')
    .optional(),
});

export default profileSchema;
