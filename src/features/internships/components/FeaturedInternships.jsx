import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import {
  ArrowRight,
  Building2,
  FileText,
  Phone,
  Sparkles,
  Users,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { ALL_DOMAINS, PARTNER_COMPANIES } from '../data/companyInternshipsData';
import { CompanyInternshipCard } from './CompanyInternshipCard';
import { InternshipDetailsModal } from './InternshipDetailsModal';

export function FeaturedInternships({ className }) {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [activePartnerModal, setActivePartnerModal] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState('details');

  const filteredPartners = useMemo(() => {
    if (selectedDomain === 'all') return PARTNER_COMPANIES;
    return PARTNER_COMPANIES.filter((p) => p.domainCategory === selectedDomain);
  }, [selectedDomain]);

  const handleOpenDetails = (partner, tab = 'details') => {
    setActivePartnerModal(partner);
    setModalInitialTab(tab);
  };

  const handleApply = (partner) => {
    setActivePartnerModal(partner);
    setModalInitialTab('apply');
  };

  const handleCloseModal = () => {
    setActivePartnerModal(null);
  };

  return (
    <section
      aria-labelledby="featured-heading"
      className={cn('bg-slate-50/70 py-16 sm:py-24 dark:bg-slate-950/60', className)}
    >
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/60 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Verified Industry Partner Tracks</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h2
              id="featured-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
            >
              Real Industry Internships with Top Tech Partners
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Work remotely on live production systems across Banking, Telecom, Healthcare, and Enterprise AI.
              All internships are 100% online remote with real enterprise code reviews, official experience
              letters, 1-on-1 mentorship, and dedicated placement calls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              as={Link}
              to={ROUTES.CATALOG}
              variant="outline"
              rightIcon={ArrowRight}
              className="bg-white dark:bg-slate-900"
            >
              Explore all tracks
            </Button>
          </div>
        </div>

        {/* Value Highlights Pill Bar */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">4 Tech Partners</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Fixed domain assignments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Experience Letter</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Official corporate credentials</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">1-on-1 Mentor</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Weekly senior reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Placement Calls</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Interview opportunities</p>
            </div>
          </div>
        </div>

        {/* Interactive Domain Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Filter by Domain:
          </span>
          {ALL_DOMAINS.map((tab) => {
            const isActive = selectedDomain === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDomain(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800',
                )}
              >
                <span>{tab.label}</span>
                {tab.company ? (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-md',
                      isActive
                        ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                    )}
                  >
                    {tab.company}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Companies & Internships Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredPartners.map((partner) => (
            <CompanyInternshipCard
              key={partner.id}
              partner={partner}
              onSelect={handleOpenDetails}
              onApply={handleApply}
            />
          ))}
        </div>
      </div>

      {/* Details & Quick Apply Modal */}
      <InternshipDetailsModal
        partner={activePartnerModal}
        open={Boolean(activePartnerModal)}
        onClose={handleCloseModal}
        initialTab={modalInitialTab}
      />
    </section>
  );
}

export default FeaturedInternships;
