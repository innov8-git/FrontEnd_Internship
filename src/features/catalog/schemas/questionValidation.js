import { z } from 'zod';

export const QUESTION_TEXT_MIN = 5;
export const QUESTION_TEXT_MAX = 1000;
export const OPTION_TEXT_MAX = 300;
export const MAX_DOMAIN_QUESTIONS = 100;

export const domainQuestionSchema = z
  .object({
    text: z
      .string()
      .trim()
      .min(QUESTION_TEXT_MIN, `Question must be at least ${QUESTION_TEXT_MIN} characters.`)
      .max(QUESTION_TEXT_MAX, `Question must not exceed ${QUESTION_TEXT_MAX} characters.`),
    options: z
      .array(
        z
          .string()
          .trim()
          .min(1, 'Option cannot be empty.')
          .max(OPTION_TEXT_MAX, `Option must not exceed ${OPTION_TEXT_MAX} characters.`),
      )
      .length(4, 'Exactly 4 options are required.'),
    correctIndex: z
      .number({ invalid_type_error: 'Select the correct answer option.' })
      .int()
      .min(0, 'Select a valid correct option.')
      .max(3, 'Select a valid correct option.'),
    explanation: z
      .string()
      .trim()
      .max(1000, 'Explanation must not exceed 1000 characters.')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      const unique = new Set(data.options.map((opt) => opt.toLowerCase()));
      return unique.size === 4;
    },
    {
      message: 'All 4 options must be distinct from one another.',
      path: ['options'],
    },
  );

