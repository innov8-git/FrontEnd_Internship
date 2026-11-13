import { z } from 'zod';

/**
 * Validation schema for domain-based capstone projects.
 * Enforces data integrity before dispatching network requests.
 */

export const PROJECT_TITLE_MIN = 3;
export const PROJECT_TITLE_MAX = 100;
export const PROJECT_DESCRIPTION_MAX = 1000;

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(PROJECT_TITLE_MIN, `Title must be at least ${PROJECT_TITLE_MIN} characters.`)
    .max(PROJECT_TITLE_MAX, `Title must be ${PROJECT_TITLE_MAX} characters or fewer.`),
  slug: z.string().trim().optional(),
  domainId: z.string().trim().min(1, 'Please select a domain.'),
  designationId: z.string().trim().optional(),
  starterRepoUrl: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      'Please enter a valid URL (starting with http:// or https://) or leave empty.',
    )
    .optional(),
  appStarterRepoUrl: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      'Please enter a valid URL (starting with http:// or https://) or leave empty.',
    )
    .optional(),
  description: z
    .string()
    .trim()
    .max(
      PROJECT_DESCRIPTION_MAX,
      `Description must be ${PROJECT_DESCRIPTION_MAX} characters or fewer.`,
    )
    .optional(),
  technologies: z.union([z.string(), z.array(z.string())]).optional(),
  webTechStack: z.union([z.string(), z.array(z.string())]).optional(),
  webDeliverables: z.string().trim().optional(),
  appTechStack: z.union([z.string(), z.array(z.string())]).optional(),
  appDeliverables: z.string().trim().optional(),
  durationsSupported: z
    .array(z.number())
    .min(1, 'Select at least one supported internship duration.'),
  isDefault: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

