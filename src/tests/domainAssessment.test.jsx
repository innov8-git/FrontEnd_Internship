import { describe, expect, it } from 'vitest';
import {
  domainQuestionSchema,
  MAX_DOMAIN_QUESTIONS,
  QUESTION_TEXT_MIN,
  QUESTION_TEXT_MAX,
} from '@/features/catalog/schemas/questionValidation';
import { DOMAIN_QUESTION_BANK, getQuestionsForDomain } from '@/mocks/seed/content/domainQuestions';

describe('Domain Question Bank Schema & Logic', () => {
  it('validates a correct question object', () => {
    const valid = {
      text: 'What is the primary role of an idempotent payment API endpoint in core banking?',
      options: [
        'To speed up database searches',
        'To prevent duplicate debits on client retries',
        'To bypass double-entry ledgers',
        'To compress receipts',
      ],
      correctIndex: 1,
      explanation: 'Idempotency prevents duplicate charges.',
    };

    const parsed = domainQuestionSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects question text that is too short or too long', () => {
    const shortText = {
      text: 'Why?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
    };
    const parsedShort = domainQuestionSchema.safeParse(shortText);
    expect(parsedShort.success).toBe(false);

    const longText = {
      text: 'A'.repeat(QUESTION_TEXT_MAX + 10),
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctIndex: 0,
    };
    const parsedLong = domainQuestionSchema.safeParse(longText);
    expect(parsedLong.success).toBe(false);
  });

  it('rejects questions with duplicate options', () => {
    const duplicateOptions = {
      text: 'Which database isolation level prevents phantom reads?',
      options: [
        'Serializable',
        'Repeatable Read',
        'Serializable', // Duplicate option
        'Read Committed',
      ],
      correctIndex: 0,
    };

    const parsed = domainQuestionSchema.safeParse(duplicateOptions);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors[0]?.message;
      expect(errorMsg).toMatch(/distinct/i);
    }
  });

  it('rejects invalid correctIndex', () => {
    const invalidIndex = {
      text: 'What does ACID stand for in database architecture?',
      options: ['Opt A', 'Opt B', 'Opt C', 'Opt D'],
      correctIndex: 4, // Out of range 0..3
    };

    const parsed = domainQuestionSchema.safeParse(invalidIndex);
    expect(parsed.success).toBe(false);
  });

  it('enforces maximum pool capacity constant of 100 questions', () => {
    expect(MAX_DOMAIN_QUESTIONS).toBe(100);
  });

  it('verifies seeded question bank has adequate questions for key domains', () => {
    const bankingQuestions = getQuestionsForDomain('banking');
    expect(bankingQuestions.length).toBeGreaterThanOrEqual(15);

    const healthcareQuestions = getQuestionsForDomain('healthcare');
    expect(healthcareQuestions.length).toBeGreaterThanOrEqual(15);

    const ecommerceQuestions = getQuestionsForDomain('e-commerce');
    expect(ecommerceQuestions.length).toBeGreaterThanOrEqual(15);
  });

  it('ensures all seeded domain questions have valid 4 options and correctIndex 0..3', () => {
    Object.entries(DOMAIN_QUESTION_BANK).forEach(([_domain, questions]) => {
      questions.forEach((q) => {
        expect(q.text.length).toBeGreaterThanOrEqual(QUESTION_TEXT_MIN);
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
        const unique = new Set(q.options.map((o) => o.toLowerCase()));
        expect(unique.size).toBe(4);
      });
    });
  });

  it('simulates Fisher-Yates shuffle sampling 15 unique questions from pool', () => {
    const pool = getQuestionsForDomain('banking');
    const copy = [...pool];

    // Fisher-Yates
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    const sampled = copy.slice(0, 15);
    expect(sampled).toHaveLength(15);

    // Verify 15 unique questions
    const uniqueTexts = new Set(sampled.map((q) => q.text));
    expect(uniqueTexts.size).toBe(15);
  });
});

