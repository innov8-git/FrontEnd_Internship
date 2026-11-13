/**
 * Catalog seed content for the mock API (ticket GP1). Pure data: no imports, no logic.
 *
 * - DESIGNATIONS / DOMAINS: { name, slug, description, status: 'PUBLISHED' | 'DRAFT' }
 * - PLAN_MATRIX: which designation/domain pairs get plans. The seed creates one plan per
 *   duration in DURATION_OPTIONS (1, 2, 3, 4, 6 months) for every pair, with the row status.
 * - Plan base price (integer paise) =
 *     BASE_PRICE_BY_DURATION[durationMonths] + PRICE_ADJUSTMENT_BY_DESIGNATION[designationSlug]
 *   e.g. Java Developer, 3 months = 1299900 paise (Rs 12,999); DevOps Engineer, 3 months = 1399900.
 */

export const DESIGNATIONS = [
  {
    name: 'Trainee Software Engineer',
    slug: 'trainee-software-engineer',
    description:
      'Comprehensive enterprise software engineering internship covering both Web Development and Mobile App Development across industry domains. Master modern architectures, responsive web frontends, mobile client applications, RESTful APIs, databases, and production Git workflows.',
    status: 'PUBLISHED',
  },
];

export const DOMAINS = [
  {
    name: 'Banking',
    slug: 'banking',
    description:
      'Accounts, fund transfers, ledgers and statements for a retail bank, where correctness, auditability and safe transaction handling come first.',
    status: 'PUBLISHED',
  },
  {
    name: 'Finance',
    slug: 'finance',
    description:
      'Treasury operations, automated payment settlements, portfolio tracking, and multi-currency ledger management.',
    status: 'PUBLISHED',
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    description:
      'Appointments, patient records and clinical workflows for a chain of clinics, built with strict privacy rules and role-based access to sensitive data.',
    status: 'PUBLISHED',
  },
  {
    name: 'Telecom',
    slug: 'telecom',
    description:
      'Usage rating, billing and subscriber services for a mobile operator that processes millions of call and data records every day and must stay available around the clock.',
    status: 'PUBLISHED',
  },
  {
    name: 'E-commerce',
    slug: 'e-commerce',
    description:
      'Product catalogues, carts, checkout, payments and order tracking for an online store, where speed and reliability directly affect revenue.',
    status: 'PUBLISHED',
  },
  {
    name: 'Insurance',
    slug: 'insurance',
    description:
      'Policy administration, premium calculation and claims processing for a general insurer, with a clear audit trail for every decision.',
    status: 'PUBLISHED',
  },
  {
    name: 'Loan',
    slug: 'loan',
    description:
      'End-to-end loan origination systems (LOS), EMI amortization calculation, credit bureau scoring, and loan lifecycle processing.',
    status: 'PUBLISHED',
  },
  {
    name: 'ERP/CRM',
    slug: 'erp-crm',
    description:
      'Multi-tenant enterprise resource planning, sales pipelines, inventory workflows, and customer ticketing systems.',
    status: 'PUBLISHED',
  },
];

export const PLAN_MATRIX = [
  {
    designation: 'trainee-software-engineer',
    domains: ['banking', 'finance', 'telecom', 'e-commerce', 'healthcare', 'insurance', 'loan', 'erp-crm'],
    status: 'PUBLISHED',
  },
];

/** Base price in paise for each duration (months). */
export const BASE_PRICE_BY_DURATION = {
  1: 499900,
  2: 899900,
  3: 1299900,
  4: 1599900,
  6: 2199900,
};

/** Paise added to the base price of every duration for a designation. */
export const PRICE_ADJUSTMENT_BY_DESIGNATION = {
  'trainee-software-engineer': 0,
};
