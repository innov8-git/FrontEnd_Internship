import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, SUPPORT_EMAIL } from '@/shared/constants';
import {
  Building2,
  ChevronDown,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'eligibility', label: 'Eligibility & Format' },
  { id: 'durations-domains', label: 'Durations & Domains' },
  { id: 'mentorship-placement', label: 'Mentors & Placement' },
  { id: 'discounts', label: 'Merit Discounts' },
];

const FAQS = [
  {
    id: 'who-can-apply',
    category: 'eligibility',
    categoryLabel: 'Eligibility',
    question: 'Who is eligible to do this internship? Who can apply?',
    icon: GraduationCap,
    answer: (
      <>
        This internship is open to <strong>all college students</strong> (B.Tech, B.E, BCA, MCA,
        B.Sc IT, diploma students across 1st to final year) as well as <strong>recent graduates and career transitioners</strong>.
        No prior corporate work experience is required. Basic programming fundamentals and an eagerness
        to build real-world software are all you need to get started.
      </>
    ),
  },
  {
    id: 'available-durations',
    category: 'durations-domains',
    categoryLabel: 'Durations',
    question: 'Which durations are available? (1, 2, 3, or 6 months)',
    icon: Clock,
    answer: (
      <>
        We offer four flexible duration tracks across every partner company:
        <ul className="mt-2.5 space-y-1.5 pl-1">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span><strong>1 Month</strong> — Rapid sprint focusing on core deliverables & foundational tasks.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span><strong>2 Months</strong> — End-to-end full stack feature development with deployment.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span><strong>3 Months</strong> — Industry standard comprehensive track with deep architecture reviews.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span><strong>6 Months</strong> — Extended enterprise residency, ideal for final-semester college credits & placement.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'partner-domains',
    category: 'durations-domains',
    categoryLabel: 'Domains',
    question: 'Which industry domains and companies are available?',
    icon: Building2,
    answer: (
      <>
        We partner with 4 vetted tech enterprises across 8 industry domains (2 domains per company), offering both <strong>Trainee Software Engineer – Web Development</strong> and <strong>Trainee Software Engineer – App Development</strong> tracks:
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-semibold text-slate-900 dark:text-white">🏦 Banking & Finance</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Inlarge Software · Core banking, payments & financial ledgers (Web & App)</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-semibold text-slate-900 dark:text-white">📡 Telecom & E-Commerce</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Couldinger · 5G self-care & high-concurrency retail checkouts (Web & App)</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-semibold text-slate-900 dark:text-white">🏥 Healthcare & Insurance</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Proton · HIPAA clinical telemetry & health claims management (Web & App)</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-semibold text-slate-900 dark:text-white">⚡ ERP/CRM & Loan Management</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Ady Nexes · Multi-tenant CRM suites & automated lending workflows (Web & App)</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'is-remote',
    category: 'eligibility',
    categoryLabel: 'Work Mode',
    question: 'Is this internship 100% online and remote?',
    icon: Globe,
    answer: (
      <>
        <strong>Yes, absolutely 100% Online Remote.</strong> You do not need to relocate or travel.
        All task assignments, day-wise standard operating procedures (SOPs), GitHub pull requests,
        and weekly 1-on-1 mentor syncs are conducted completely online from anywhere in India or internationally.
      </>
    ),
  },
  {
    id: 'experience-letter-placement',
    category: 'mentorship-placement',
    categoryLabel: 'Outcomes',
    question: 'Will I receive an official Internship Completion Letter and Placement Support?',
    icon: FileText,
    answer: (
      <>
        Yes! On successful completion of your internship track, you will be awarded:
        <ul className="mt-2 space-y-1 pl-1">
          <li>• <strong>Official Internship Completion Letter</strong> issued directly by the partner enterprise.</li>
          <li>• <strong>Verifiable Certificate of Completion</strong> with a permanent tamper-proof online verification URL.</li>
          <li>• <strong>Dedicated Placement Support & Interview Drives</strong> coordinated with our hiring partner network.</li>
          <li>• <strong>1-on-1 Senior Industry Mentorship</strong> with GitHub code reviews on your live commits.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'discount-slabs',
    category: 'discounts',
    categoryLabel: 'Discounts',
    question: 'How do the assessment percentage discounts work?',
    icon: Sparkles,
    answer: (
      <>
        We award direct merit fee discounts based on your assessment percentage score:
        <ul className="mt-2 space-y-1 pl-1">
          <li>• <strong>100% Score:</strong> Unlocks <strong>20% Maximum Discount</strong>.</li>
          <li>• <strong>90% – 99% Score:</strong> Unlocks <strong>10% Discount</strong>.</li>
          <li>• <strong>80% – 89% Score:</strong> Unlocks <strong>5% Discount</strong>.</li>
        </ul>
        <span className="mt-2 block text-xs text-slate-500">
          Your unlocked discount percentage is automatically applied to your invoice during checkout.
        </span>
      </>
    ),
  },
  {
    id: 'how-to-verify',
    category: 'mentorship-placement',
    categoryLabel: 'Verification',
    question: 'How can employers or universities verify my internship credential?',
    icon: Phone,
    answer: (
      <>
        Every certificate and experience credential has an assigned unique cryptographically verifiable ID.
        Recruiters, HR teams, and college registrars can verify authenticity instantly on our public{' '}
        <Link to={ROUTES.VERIFY_CERTIFICATE} className="link font-semibold">
          Certificate Verification Portal
        </Link>
        .
      </>
    ),
  },
];

export function Faq({ className }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState('who-can-apply');

  const filteredFaqs =
    activeCategory === 'all'
      ? FAQS
      : FAQS.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className={cn('bg-slate-50/70 py-16 sm:py-24 dark:bg-slate-950/70', className)}
    >
      <div className="container-page">
        {/* Header & Subtitle */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/60 dark:text-brand-300">
            <HelpCircle className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
          >
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Got questions about our 100% online remote internships, 1–6 month durations,
            partner domains, or placement support? Here are all the answers.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-150',
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Left Help Card & Right Accordion */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Support Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                Still have questions?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Can&apos;t find what you&apos;re looking for? Reach out directly to our student support
                and admissions counseling desk.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-semibold text-slate-700 transition hover:border-brand-500 hover:bg-white dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-brand-500"
                >
                  <Mail className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <span className="truncate">{SUPPORT_EMAIL}</span>
                </a>

                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Admissions desk active now</span>
                </div>
              </div>

              {/* Quick Feature Badges */}
              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Platform Highlights
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>100% Online Remote Work</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>1, 2, 3 & 6 Months Durations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                    <span>Official Internship Completion Letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Placement Support & Drives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Accordion List */}
          <div className="space-y-3.5 lg:col-span-8">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const Icon = faq.icon;
              return (
                <div
                  key={faq.id}
                  className={cn(
                    'overflow-hidden rounded-2xl border transition-all duration-200',
                    isOpen
                      ? 'border-brand-500/80 bg-white shadow-md dark:border-brand-500/60 dark:bg-slate-900'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                          isOpen
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {faq.question}
                        </span>
                        <span className="ml-2.5 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {faq.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-180 text-brand-600 dark:text-brand-400',
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600 dark:border-slate-800/80 dark:text-slate-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
