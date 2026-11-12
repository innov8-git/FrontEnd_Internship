import { z } from 'zod';
import { PROFILE_NAME_MAX, PROFILE_NAME_MIN } from './profileValidation';

/**
 * Validation schema for editing trainer profile.
 * Covers personal details, mentoring qualifications, and professional links.
 */
export const trainerProfileSchema = z.object({
  name: z
    .string({ required_error: 'Enter your full name.' })
    .trim()
    .min(PROFILE_NAME_MIN, `Your name must be at least ${PROFILE_NAME_MIN} characters.`)
    .max(PROFILE_NAME_MAX, `Your name must be ${PROFILE_NAME_MAX} characters or fewer.`),
  domain: z
    .string({ required_error: 'Select your primary mentoring domain.' })
    .min(1, 'Select your primary mentoring domain.'),
  experience: z
    .string({ required_error: 'Select your years of experience.' })
    .min(1, 'Select your years of experience.'),
  organization: z.string().optional(),
  linkedinUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        try {
          const url = new URL(val);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'Enter a valid URL (e.g. https://linkedin.com/in/username).' },
    ),
  resume: z.any().optional(),
});

