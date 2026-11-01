import { BadgeCheck, Quote, Star } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const TESTIMONIALS = [
  {
    name: 'Aarav Sharma',
    role: 'SDE-1 @ FinTech Innovations',
    track: 'Java Banking Domain',
    avatarInitials: 'AS',
    score: '14/15 (10% merit discount)',
    quote:
      'The day-wise banking SOPs taught me real enterprise transaction patterns and concurrency controls that came up directly in my technical interview. The trainer code reviews on GitHub made all the difference.',
  },
  {
    name: 'Priya Patel',
    role: 'Full Stack Engineer @ ScaleWave',
    track: 'Full Stack React & Node',
    avatarInitials: 'PP',
    score: '15/15 (20% merit discount)',
    quote:
      'I loved that my tuition discount was based on my assessment score. Having a verified ALFRE certificate linked directly to my GitHub repository gave recruiters undeniable proof of my capabilities.',
  },
  {
    name: 'Vikram Desai',
    role: 'Cloud Associate @ InfraCloud',
    track: 'DevOps & Kubernetes',
    avatarInitials: 'VD',
    score: '13/15 (10% merit discount)',
    quote:
      'No other platform gives you actual senior engineer feedback on your Dockerfiles, CI/CD pipelines, and Kubernetes manifests. ALFRE bridges the gap between college theory and real engineering.',
  },
];

/**
 * Realistic student success stories section.
 */
export function StudentTestimonials({ className }) {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className={cn(
        'relative bg-white py-16 sm:py-24 transition-colors duration-200 dark:bg-slate-950',
        className,
      )}
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">🎓 Proven Career Outcomes</p>
          <h2
            id="testimonials-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            From Interns to Hired Engineers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Hear from developers who proved their skills, shipped production projects, and leveraged
            their verified credentials to launch tech careers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, track, avatarInitials, score, quote }) => (
            <div
              key={name}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-amber-500/30 dark:text-amber-400/20" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-slate-200/80 pt-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-white shadow-sm">
                    {avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {name}
                    </p>
                    <p className="truncate text-xs font-medium text-amber-700 dark:text-amber-400">
                      {role}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{track}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Challenge: {score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StudentTestimonials;

