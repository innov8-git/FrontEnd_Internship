import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, ErrorState, Modal, Skeleton, SkeletonText } from '@/shared/components/ui';
import { ROUTES, buildPath } from '@/shared/constants';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Sparkles,
  ZoomIn,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { useDomains } from '../hooks/useDomains';
import { getDomainVisual } from '../utils/designationVisuals';

/* ─── Rich Domain Knowledge & Sample Industry Projects ─── */
const DOMAIN_EXTRAS = {
  banking: {
    tagline: 'Fintech & Transaction Systems',
    badge: 'High Security & ACID',
    shortDesc: 'Double-entry banking ledgers, idempotent payment APIs, and real-time fraud heuristics.',
    highlights: [
      'Double-entry banking ledgers & audit trails',
      'Idempotent payment & fund transfer APIs',
      'Real-time fraud heuristics & account reconciliation',
    ],
    techStack: ['Spring Boot', 'PostgreSQL', 'Kafka'],
    color: { from: '#3b82f6', to: '#6366f1', glow: 'rgba(99, 102, 241, 0.3)' },
  },
  'e-commerce': {
    tagline: 'Retail & Order Logistics',
    badge: 'High Concurrency',
    shortDesc: 'Cart reservation state machines, Stripe webhooks, and scalable inventory pipelines.',
    highlights: [
      'Cart reservation state machines with timeout locks',
      'Secure Stripe / Razorpay payment gateway webhooks',
      'Catalog full-text search & automated discount engine',
    ],
    techStack: ['Node.js / React', 'Redis', 'Queues'],
    color: { from: '#f59e0b', to: '#ef4444', glow: 'rgba(245, 158, 11, 0.3)' },
  },
  healthcare: {
    tagline: 'Patient & Clinic Platforms',
    badge: 'HIPAA & FHIR',
    shortDesc: 'Encrypted patient records, automated clinic scheduling, and diagnostic doctor workflows.',
    highlights: [
      'Encrypted patient records with role-based access control',
      'Clinic appointment scheduling with automated SMS/email',
      'Diagnostic test pipeline & doctor consult workflows',
    ],
    techStack: ['Java / Python', 'REST & GraphQL', 'Audit Logs'],
    color: { from: '#ec4899', to: '#f43f5e', glow: 'rgba(236, 72, 153, 0.3)' },
  },
  telecom: {
    tagline: 'Subscriber & Billing Infrastructure',
    badge: 'High-Throughput CDR',
    shortDesc: 'High-throughput CDR rating engines, SIM lifecycle state machines, and real-time bandwidth alerts.',
    highlights: [
      'Call Detail Record (CDR) rating and billing engine',
      'SIM lifecycle state machine & plan provisioning',
      'Real-time data bandwidth threshold monitoring',
    ],
    techStack: ['Microservices', 'Time-Series DB', 'gRPC'],
    color: { from: '#8b5cf6', to: '#a855f7', glow: 'rgba(139, 92, 246, 0.3)' },
  },
  insurance: {
    tagline: 'Underwriting & Claims Pipelines',
    badge: 'Automated Rules',
    shortDesc: 'Multi-stage claim verification, fraud scoring algorithms, and automated policy renewal.',
    highlights: [
      'Multi-stage claim verification and fraud scoring',
      'Premium rate calculations based on risk heuristics',
      'Policy renewal automation with document verification',
    ],
    techStack: ['.NET / Java', 'Document Store', 'PostgreSQL'],
    color: { from: '#10b981', to: '#14b8a6', glow: 'rgba(16, 185, 129, 0.3)' },
  },
};

const DEFAULT_EXTRA = {
  tagline: 'Real-World Production Workflows',
  badge: 'Production Grade',
  shortDesc: 'Real-world architecture patterns, scalable API design, and peer-reviewed GitHub pull requests.',
  highlights: [
    'Production-grade feature development & tests',
    'Clean architectural patterns and documentation',
    'Trainer reviews on every GitHub pull request',
  ],
  techStack: ['Git Flow', 'REST APIs', 'Cloud DB'],
  color: { from: '#6366f1', to: '#8b5cf6', glow: 'rgba(99, 102, 241, 0.3)' },
};

/* ─── Seamless Keyframe Animations ─── */
const CAROUSEL_STYLES = `
@keyframes auroraShift {
  0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
  25%      { transform: translate(5%, -3%) rotate(90deg) scale(1.1); }
  50%      { transform: translate(-3%, 5%) rotate(180deg) scale(0.95); }
  75%      { transform: translate(4%, 2%) rotate(270deg) scale(1.05); }
}
@keyframes floatParticle {
  0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
  25%      { transform: translateY(-20px) translateX(10px) scale(1.2); opacity: 0.8; }
  50%      { transform: translateY(-8px) translateX(-8px) scale(0.9); opacity: 0.5; }
  75%      { transform: translateY(-25px) translateX(5px) scale(1.1); opacity: 0.7; }
}
/* Infinite smooth marquee translation */
@keyframes continuousSlide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.continuous-marquee-track {
  display: flex;
  gap: 1.25rem;
  width: max-content;
  animation: continuousSlide 36s linear infinite;
  will-change: transform;
}
/* Hovering over any card or the track stops the animation immediately */
.continuous-marquee-wrapper:hover .continuous-marquee-track,
.continuous-marquee-track:hover,
.continuous-marquee-track.is-paused {
  animation-play-state: paused !important;
}
`;

function DomainSkeletonSlider() {
  return (
    <div role="status">
      <span className="sr-only">Loading domains…</span>
      <div className="flex gap-4 overflow-hidden py-4 justify-center" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="w-[270px] shrink-0 rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10" rounded="xl" />
              <Skeleton className="h-5 w-20" rounded="full" />
            </div>
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-2 h-3.5 w-1/2" />
            <SkeletonText lines={2} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Floating particles for ambient visual effect ─── */
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: '0s', dur: '6s' },
    { size: 3, x: '25%', y: '70%', delay: '1s', dur: '8s' },
    { size: 5, x: '75%', y: '15%', delay: '2s', dur: '7s' },
    { size: 3, x: '85%', y: '60%', delay: '0.5s', dur: '9s' },
    { size: 4, x: '50%', y: '80%', delay: '3s', dur: '6.5s' },
    { size: 3, x: '60%', y: '30%', delay: '1.5s', dur: '7.5s' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-brand-400/30 dark:bg-brand-500/20"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.x,
            top: p.y,
            animation: `floatParticle ${p.dur} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Compact, sleek domain card with short explanation & interactive hover effects
 */
function CompactDomainCard({ domain, onZoom }) {
  const visual = getDomainVisual(domain.slug || domain.name);
  const Icon = visual.icon;
  const key = String(domain.slug || domain.name).toLowerCase();
  const extra = DOMAIN_EXTRAS[key] || DEFAULT_EXTRA;

  // Short, crisp explanation (1-2 lines)
  const shortExplanation =
    extra.shortDesc ||
    domain.description ||
    'Build real business backends and customer-facing interfaces.';

  return (
    <div
      onClick={() => onZoom(domain)}
      className={cn(
        'group relative flex w-[260px] sm:w-[280px] shrink-0 flex-col rounded-2xl p-4 sm:p-5 cursor-pointer select-none text-left',
        'backdrop-blur-xl border transition-all duration-300',
        'bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-slate-800/80 shadow-sm',
        'hover:shadow-xl hover:-translate-y-1 hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-900',
      )}
      style={{
        boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.06)',
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${domain.name} domain details`}
    >
      {/* Top Header: Icon + Badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-110',
            visual.tint,
          )}
          style={{
            boxShadow: `0 4px 12px ${extra.color.glow}`,
          }}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>

        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 transition-colors"
          style={{
            borderColor: `${extra.color.from}40`,
            color: extra.color.from,
            backgroundColor: `${extra.color.from}14`,
          }}
        >
          {extra.badge}
        </span>
      </div>

      {/* Domain Title & Subtitle */}
      <div className="mt-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {domain.name}
        </h3>
        <p
          className="text-xs font-semibold mt-0.5 line-clamp-1"
          style={{ color: extra.color.from }}
        >
          {extra.tagline}
        </p>
      </div>

      {/* Short Crisp Explanation */}
      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[32px]">
        {shortExplanation}
      </p>

      {/* Tech Stack Pills (compact) */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {extra.techStack.slice(0, 2).map((tech, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Bottom Footer: Click to Explore */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
        <span className="font-semibold text-brand-600 dark:text-brand-400 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
          Explore track
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
        <ZoomIn className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
      </div>
    </div>
  );
}

/**
 * Zoomed Spotlight Modal for in-depth immersion
 */
function ZoomedDomainModal({ domain, open, onClose }) {
  const navigate = useNavigate();
  if (!domain) return null;

  const visual = getDomainVisual(domain.slug || domain.name);
  const Icon = visual.icon;
  const key = String(domain.slug || domain.name).toLowerCase();
  const extra = DOMAIN_EXTRAS[key] || DEFAULT_EXTRA;

  const handleExplore = () => {
    onClose();
    navigate(buildPath(ROUTES.CATALOG, {}, { domain: domain._id }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={null}
      className="p-0 overflow-hidden"
    >
      {/* Top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${extra.color.from}, ${extra.color.to})` }}
      />

      <div className="p-6 sm:p-8">
        {/* Header with Visual Icon & Badges */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg',
                visual.tint,
              )}
              style={{ boxShadow: `0 8px 30px ${extra.color.glow}` }}
            >
              <Icon className="h-9 w-9" />
            </span>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800 mb-1">
                <Sparkles className="w-3 h-3 text-brand-600" />
                <span>Industry Domain</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {domain.name}
              </h2>
              <p className="text-sm font-semibold" style={{ color: extra.color.from }}>
                {extra.tagline}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {extra.badge}
          </span>
        </div>

        {/* Detailed Domain Overview */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Industry Context & Challenges:
          </h4>
          <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
            {domain.description ||
              extra.shortDesc ||
              'Work directly with authentic data models, system constraints, and compliance requirements that reflect real industry standards.'}
          </p>
        </div>

        {/* What You Build in this Domain */}
        <div className="mt-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>What You Build & Ship:</span>
          </h4>
          <ul className="mt-3 space-y-2.5">
            {extra.highlights.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: extra.color.from }} />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture & Tech Stack Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
            Tech Focus:
          </span>
          {extra.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleExplore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${extra.color.from}, ${extra.color.to})`,
            }}
          >
            <span>Explore {domain.name} Internships</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Home page band of published industry domains with:
 * - Small compact cards
 * - Short crisp explanation
 * - Continuous smooth sliding carousel (marquee effect)
 * - Automatic pause/stop on hover
 */
export function DomainStrip({ className }) {
  const { data: domains = [], isLoading, isError, error, refetch } = useDomains();
  const [zoomedDomain, setZoomedDomain] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Keyboard navigation: Escape to close modal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && zoomedDomain) setZoomedDomain(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomedDomain]);

  const isPaused = Boolean(zoomedDomain) || isHovered;

  let content;
  if (isLoading) {
    content = <DomainSkeletonSlider />;
  } else if (isError) {
    content = (
      <ErrorState compact error={error} title="We couldn't load domains" onRetry={refetch} />
    );
  } else if (domains.length === 0) {
    content = (
      <EmptyState
        compact
        icon={Building2}
        title="Domains are on their way"
        description="Industry domains appear here as soon as they're published."
      />
    );
  } else {
    // Generate repeated items for an ultra-smooth, seamless infinite marquee
    const repeatRounds = Math.max(2, Math.ceil(8 / (domains.length || 1)));
    const baseList = Array.from({ length: repeatRounds }, () => domains).flat();
    // Two identical halves: translating from 0% to -50% loops perfectly
    const marqueeList = [...baseList, ...baseList];

    content = (
      <div
        className="relative group/carousel py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right gradient edge masks so cards blend into background */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-20 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-20 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90"
          aria-hidden="true"
        />



        {/* Continuous Marquee Track */}
        <div className="relative overflow-hidden w-full continuous-marquee-wrapper py-2">
          <div
            className={cn(
              'continuous-marquee-track',
              isPaused && 'is-paused',
            )}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {marqueeList.map((domain, idx) => (
              <CompactDomainCard
                key={`${domain._id || domain.slug || 'd'}-${idx}`}
                domain={domain}
                onZoom={(d) => setZoomedDomain(d)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="domains-heading"
      className={cn(
        'relative overflow-hidden py-14 sm:py-18',
        className,
      )}
    >
      {/* Inject animation styles */}
      <style>{CAROUSEL_STYLES}</style>

      {/* Aurora mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-amber-50/20 to-slate-50/80 dark:from-slate-950 dark:via-amber-950/10 dark:to-slate-950" />

        {/* Animated aurora blobs */}
        <div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-25 dark:opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25), transparent 70%)',
            animation: 'auroraShift 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.2), transparent 70%)',
            animation: 'auroraShift 25s ease-in-out 5s infinite reverse',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15), transparent 70%)',
            animation: 'auroraShift 18s ease-in-out 3s infinite',
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Dot matrix subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="container-page relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Industry Domains</span>
          </div>

          <h2
            id="domains-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Build for <span className="text-brand-600 dark:text-brand-400">Real Businesses</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Every plan pairs a role with an industry, so your project mirrors how banks, clinics, and
            online stores actually run. Hover to freeze, click to explore.
          </p>
        </div>

        {/* Continuous Sliding Carousel Content */}
        {content}

        {/* Zoomed Card Spotlight Modal */}
        <ZoomedDomainModal
          domain={zoomedDomain}
          open={Boolean(zoomedDomain)}
          onClose={() => setZoomedDomain(null)}
        />
      </div>
    </section>
  );
}

export default DomainStrip;
