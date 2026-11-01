import { Link } from 'react-router-dom';
import {
  ASSESSMENT_MAX_SCORE,
  ROUTES,
  SUPPORT_EMAIL,
  TEAM_MAX_MEMBERS,
} from '@/shared/constants';
import { ChevronDown } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const FAQS = [
  {
    question: 'Is there a pass mark for the assessment?',
    answer: `No. There is no pass or fail. Every score from 0 to ${ASSESSMENT_MAX_SCORE} can continue directly to enrollment — your score only decides your individual merit discount.`,
  },
  {
    question: 'How many times can I take the assessment?',
    answer:
      'Once per internship. Your score is saved and applies whenever you enroll in that internship as an individual. Unanswered questions count as wrong, so review before you submit.',
  },
  {
    question: 'Do teams get the merit discount?',
    answer: `No. Team enrollments pay the standard plan price. A team can have up to ${TEAM_MAX_MEMBERS} members, including the leader, and everyone collaborates from one shared GitHub repository.`,
  },
  {
    question: 'What do I submit for each day-wise task?',
    answer:
      'Screenshots of your working build, a brief description of what you implemented, and a link to your GitHub Pull Request. A dedicated trainer reviews every submission and either approves it or provides actionable feedback.',
  },
  {
    question: 'When can I see the full daily schedule and SOPs?',
    answer:
      'You can preview the day titles of any plan before you pay. The full daily guides, detailed task requirements, and protected SOPs unlock as soon as your enrollment is confirmed.',
  },
  {
    question: 'How can an employer or recruiter verify my certificate?',
    answer: (
      <>
        Every certificate has a unique identification number and a permanent public verification URL.
        Anyone can verify authenticity instantly on the{' '}
        <Link to={ROUTES.VERIFY_CERTIFICATE} className="link">
          certificate verification portal
        </Link>
        .
      </>
    ),
  },
];

/** Home page FAQ: native <details> disclosure widgets (keyboard and screen reader friendly). */
export function Faq({ className }) {
  return (
    <section aria-labelledby="faq-heading" className={cn('bg-white py-16 sm:py-24 transition-colors duration-200 dark:bg-slate-950', className)}>
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div>
          <p className="eyebrow">Frequently Asked Questions</p>
          <h2
            id="faq-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Everything You Need to Know
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Have questions about ALFRE internships? We are here to help. Email our team at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="link break-all">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200/90 bg-white shadow-card dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {FAQS.map(({ question, answer }) => (
            <details key={question} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="-mx-2 flex min-h-[3.25rem] cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-2 py-4 text-left text-sm font-semibold text-slate-900 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-white dark:hover:text-brand-400 sm:text-base">
                {question}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none dark:text-slate-500"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
