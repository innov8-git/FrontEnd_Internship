import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import {
  ArrowRight,
  Building2,
  Code2,
  FileText,
  Phone,
  Smartphone,
  Sparkles,
  Users,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import {
  ALL_DOMAINS,
  DOMAIN_CHIPS,
  PARTNER_COMPANIES,
  TRACK_OPTIONS,
} from '../data/companyInternshipsData';
import { CompanyInternshipCard } from './CompanyInternshipCard';
import { InternshipDetailsModal } from './InternshipDetailsModal';

export function FeaturedInternships({
  limit,
  showViewMore = false,
  isCatalogPage = false,
  className,
}) {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [activePartnerModal, setActivePartnerModal] = useState(null);
  const [activeRoleModal, setActiveRoleModal] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState('details');

  // Flatten partner companies into independent position cards (Web Development & App Development)
  // Ordered with Web Development roles across all companies, followed by App Development roles
  const allPositionCards = useMemo(() => {
    const list = [];

    // First: Web Development positions (1 per company)
    PARTNER_COMPANIES.forEach((partner) => {
      const webRole = partner.roles?.find((r) => r.track === 'web') || partner.internship;
      if (webRole) {
        list.push({
          id: `${partner.id}-web`,
          partner,
          role: webRole,
        });
      }
    });

    // Second: App Development positions (1 per company)
    PARTNER_COMPANIES.forEach((partner) => {
      const appRole = partner.roles?.find((r) => r.track === 'app');
      if (appRole) {
        list.push({
          id: `${partner.id}-app`,
          partner,
          role: appRole,
        });
      }
    });

    return list;
  }, []);

  // Filter positions by domain and track
  const filteredPositions = useMemo(() => {
    return allPositionCards.filter(({ partner, role }) => {
      // 1. Domain filter
      if (selectedDomain !== 'all') {
        const matchesCategory = partner.domainCategory === selectedDomain;
        const matchesSubDomain = partner.assignedDomainSlugs?.includes(selectedDomain);
        if (!matchesCategory && !matchesSubDomain) return false;
      }
      // 2. Track filter (all / web / app)
      if (selectedTrack !== 'all' && role.track !== selectedTrack) {
        return false;
      }
      return true;
    });
  }, [allPositionCards, selectedDomain, selectedTrack]);

  // If a limit is applied, take the first N positions
  const displayedPositions = limit ? filteredPositions.slice(0, limit) : filteredPositions;
  const hasMore = Boolean(limit && filteredPositions.length > limit);

  const handleOpenDetails = (partner, tab = 'details', role = null) => {
    setActivePartnerModal(partner);
    setActiveRoleModal(role || partner.roles?.[0] || partner.internship);
    setModalInitialTab(tab);
  };

  const handleApply = (partner, role = null) => {
    setActivePartnerModal(partner);
    setActiveRoleModal(role || partner.roles?.[0] || partner.internship);
    setModalInitialTab('apply');
  };

  const handleCloseModal = () => {
    setActivePartnerModal(null);
    setActiveRoleModal(null);
  };

  const uniqueCompanyCount = new Set(displayedPositions.map((p) => p.partner.id)).size;

  const content = (
    <div className={cn(isCatalogPage ? 'space-y-6' : 'container-page')}>
      {/* Section Header (Only shown if not inside the Catalog Page which already has its own PageHeader) */}
      {!isCatalogPage && (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/60 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>4 Companies · 8 Industry Domains · 8 Dedicated Role Cards</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h2
              id="featured-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
            >
              Real Industry Internships with Top Tech Partners
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Work remotely on live production systems across 8 core domains: <strong>Banking & Finance</strong>,{' '}
              <strong>Telecom & E-Commerce</strong>, <strong>Healthcare & Insurance</strong>, and{' '}
              <strong>ERP/CRM & Loan Management</strong>. Explore dedicated positions for both
              Trainee Software Engineer – Web Development and Trainee Software Engineer – App Development.
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
      )}

      {/* Value Highlights Pill Bar (only if not on catalog page) */}
      {!isCatalogPage && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">4 Tech Partners</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">8 Fixed Domain Tracks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Internship Completion Letter</p>
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
              <p className="text-xs font-bold text-slate-900 dark:text-white">Placement Support</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Interview opportunities</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Filter Bar: Domains & Role Tracks */}
      <div className={cn(isCatalogPage ? 'space-y-3' : 'mt-8 space-y-3 border-b border-slate-200 pb-5 dark:border-slate-800')}>
        {/* Main Domain Categories Tabs */}
        <div className="flex flex-wrap items-center gap-2">
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
                      'text-[10px] px-1.5 py-0.5 rounded-md font-normal',
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

        {/* Individual Sub-Domain Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium mr-1 text-[11px] uppercase tracking-wider">Sub-Domains:</span>
          {DOMAIN_CHIPS.filter((c) => c.id !== 'all').map((chip) => {
            const isChipActive = selectedDomain === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedDomain(isChipActive ? 'all' : chip.id)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors',
                  isChipActive
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Track Filter Toggle: All vs Web Dev vs App Dev */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Track Filter:
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {TRACK_OPTIONS.map((trackOpt) => {
                const isTrackActive = selectedTrack === trackOpt.id;
                const Icon =
                  trackOpt.id === 'web' ? Code2 : trackOpt.id === 'app' ? Smartphone : Sparkles;
                return (
                  <button
                    key={trackOpt.id}
                    type="button"
                    onClick={() => setSelectedTrack(trackOpt.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all',
                      isTrackActive
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{trackOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {displayedPositions.length} of {filteredPositions.length} positions across {uniqueCompanyCount} partner {uniqueCompanyCount === 1 ? 'company' : 'companies'}
          </p>
        </div>
      </div>

      {/* Separate Cards for Web and App Positions on Each Company */}
      <div className={cn('grid gap-6 md:grid-cols-2', isCatalogPage ? 'mt-4' : 'mt-8')}>
        {displayedPositions.map(({ id, partner, role }) => (
          <CompanyInternshipCard
            key={id}
            partner={partner}
            role={role}
            onSelect={handleOpenDetails}
            onApply={handleApply}
          />
        ))}
      </div>

      {/* "View More" CTA Banner that redirects to the explore internships page */}
      {showViewMore && hasMore && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-200/80 bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-blue-50/70 p-6 text-center dark:border-brand-900/40 dark:bg-slate-900/80">
          <div className="max-w-xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Explore All {allPositionCards.length} Industry Partner Positions
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Showing {displayedPositions.length} of {allPositionCards.length} positions. Explore all Web Development and App Development roles across our 4 enterprise partners and 8 domains.
            </p>
          </div>
          <Button
            as={Link}
            to={ROUTES.CATALOG}
            variant="primary"
            size="md"
            rightIcon={ArrowRight}
            className="shadow-sm"
          >
            View More Positions ({filteredPositions.length - displayedPositions.length} More Available)
          </Button>
        </div>
      )}

      {/* Details & Quick Apply Modal */}
      <InternshipDetailsModal
        partner={activePartnerModal}
        initialRole={activeRoleModal}
        open={Boolean(activePartnerModal)}
        onClose={handleCloseModal}
        initialTab={modalInitialTab}
      />
    </div>
  );

  if (isCatalogPage) {
    return content;
  }

  return (
    <section
      aria-labelledby="featured-heading"
      className={cn('bg-slate-50/70 py-16 sm:py-24 dark:bg-slate-950/60', className)}
    >
      {content}
    </section>
  );
}

export default FeaturedInternships;
