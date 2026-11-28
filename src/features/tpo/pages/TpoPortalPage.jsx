import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Button,
  CopyButton,
  EmptyState,
  ErrorState,
  Pagination,
  SearchBar,
  Skeleton,
  StatCard,
  ThemeToggle,
  toast,
} from '@/shared/components/ui';
import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  IndianRupee,
  Lock,
  LogOut,
  Percent,
  Receipt,
  RefreshCw,
  School,
  ShieldCheck,
  Wallet,
} from '@/shared/icons';
import { ROLES, ROUTES } from '@/shared/constants';
import { useAuth, useDebounce, useDocumentTitle } from '@/shared/hooks';
import { formatDate, formatDateTime, formatMoney } from '@/shared/utils/helpers';
import { cn } from '@/shared/utils/cn';
import { formatTpoCommission } from '@/features/admin/utils/tpoShare';
import {
  useMyTpoPayouts,
  useMyTpoReferrals,
  useMyTpoSummary,
} from '../hooks/useTpoPortal';

const REFERRAL_FILTERS = [
  { value: 'all', label: 'All Referred' },
  { value: 'paid', label: 'Paid & Credited' },
  { value: 'unpaid', label: 'Awaiting Payment' },
];

const VIEW_TABS = [
  { value: 'referrals', label: 'Referred Students' },
  { value: 'payouts', label: 'Payout History' },
];

function EarningStatusBadge({ status }) {
  if (status === 'PAID') {
    return (
      <Badge variant="success">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Paid Out
      </Badge>
    );
  }
  if (status === 'CONFIRMED') {
    return (
      <Badge variant="info">
        <Wallet className="mr-1 h-3 w-3" />
        Earned (Pending Payout)
      </Badge>
    );
  }
  if (status === 'REVERSED') {
    return <Badge variant="danger">Reversed</Badge>;
  }
  return (
    <Badge variant="neutral">
      <Clock className="mr-1 h-3 w-3" />
      Awaiting Payment
    </Badge>
  );
}

/**
 * Private TPO Partner Portal (/tpo/portal).
 * Unlisted — never linked from any public, student, or trainer UI.
 * Accessible strictly to authenticated TPOs (own records only) and Admins (optional ?tpoId= preview).
 */
export function TpoPortalPage() {
  useDocumentTitle('Partner Referral Overview');

  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAdmin = hasRole(ROLES.ADMIN);
  const previewTpoId = isAdmin ? searchParams.get('tpoId') : null;

  const [activeTab, setActiveTab] = useState('referrals');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [refPage, setRefPage] = useState(1);
  const [payoutPage, setPayoutPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setRefPage(1);
  }, [debouncedSearch, filter, previewTpoId]);

  const summaryQuery = useMyTpoSummary(previewTpoId);
  const referralsQuery = useMyTpoReferrals(
    {
      page: refPage,
      limit: 10,
      filter,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    },
    previewTpoId,
    { enabled: activeTab === 'referrals' },
  );
  const payoutsQuery = useMyTpoPayouts(
    { page: payoutPage, limit: 10 },
    previewTpoId,
    { enabled: activeTab === 'payouts' },
  );

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
    toast.info('You have been signed out.');
  };

  const tpo = summaryQuery.data?.tpo ?? null;
  const stats = summaryQuery.data?.stats ?? null;

  const referrals = referralsQuery.data?.items ?? [];
  const referralsTotal = referralsQuery.data?.total ?? 0;
  const referralsTotalPages = referralsQuery.data?.totalPages ?? 1;

  const payouts = payoutsQuery.data?.items ?? [];
  const payoutsTotal = payoutsQuery.data?.total ?? 0;
  const payoutsTotalPages = payoutsQuery.data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      {/* Private minimal header — zero links to student/catalog/public pages */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
              <School className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  TPO Referral &amp; Earnings Portal
                </h1>
                <span className="hidden items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:inline-flex">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Private
                </span>
              </div>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {tpo ? `${tpo.name} · ${tpo.college}` : user?.email || 'Confidential Partner View'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isAdmin ? (
              <Link
                to={ROUTES.ADMIN_TPOS}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Admin TPOs</span>
              </Link>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              leftIcon={RefreshCw}
              onClick={() => {
                summaryQuery.refetch();
                if (activeTab === 'referrals') referralsQuery.refetch();
                else payoutsQuery.refetch();
              }}
              aria-label="Refresh referral statistics"
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              leftIcon={LogOut}
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        {isAdmin && previewTpoId ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            <span className="font-medium">
              Admin Preview Mode — Viewing the private portal exactly as{' '}
              <strong>{tpo?.name || 'this TPO'}</strong> sees it.
            </span>
            <Link
              to={ROUTES.ADMIN_TPOS}
              className="font-semibold underline underline-offset-2 hover:text-amber-700"
            >
              Return to Admin Console
            </Link>
          </div>
        ) : null}

        {summaryQuery.isError ? (
          <ErrorState
            error={summaryQuery.error}
            title="Unable to load your TPO referral portal"
            onRetry={() => summaryQuery.refetch()}
          />
        ) : (
          <>
            {/* TPO Identity & Reference Code Strip */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              {summaryQuery.isPending ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-56" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : tpo ? (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {tpo.name}
                      </h2>
                      <Badge variant={tpo.isActive ? 'success' : 'neutral'}>
                        {tpo.isActive ? 'Active Reference Code' : 'Code Inactive'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {tpo.college}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-brand-700 dark:text-brand-300">
                        {tpo.commissionType === 'PERCENTAGE' ? (
                          <Percent className="h-3.5 w-3.5" />
                        ) : (
                          <IndianRupee className="h-3.5 w-3.5" />
                        )}
                        Commission: {formatTpoCommission(tpo.commissionType, tpo.commissionValue)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl border border-brand-200/80 bg-brand-50/70 px-3.5 py-2 dark:border-brand-800/60 dark:bg-brand-950/40">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        Code
                      </span>
                      <span
                        data-testid="tpo-portal-code"
                        className="font-mono text-sm font-bold tracking-wider text-brand-800 dark:text-brand-200"
                      >
                        {tpo.referralCode}
                      </span>
                    </div>
                    <CopyButton
                      value={tpo.referralCode}
                      label="Copy Code"
                      copiedLabel="Copied"
                      size="sm"
                      onCopy={() => toast.success('Reference code copied.')}
                    />
                  </div>
                </div>
              ) : null}
            </section>

            {/* KPI Row */}
            <section
              aria-label="Referral and earnings summary"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <StatCard
                label="Referred Students"
                value={stats ? String(stats.totalReferredStudents) : '—'}
                hint={
                  stats?.pendingVerificationStudents > 0
                    ? `+${stats.pendingVerificationStudents} awaiting email verify`
                    : 'Verified student signups'
                }
                icon={GraduationCap}
                tone="brand"
                loading={summaryQuery.isPending}
              />
              <StatCard
                label="Paid Conversions"
                value={stats ? String(stats.paidConversions) : '—'}
                hint="Completed internship payments"
                icon={ShieldCheck}
                tone="success"
                loading={summaryQuery.isPending}
              />
              <StatCard
                label="Total Earned"
                value={stats ? formatMoney(stats.totalEarnedPaise, stats.currency) : '—'}
                hint="Cumulative reference earnings"
                icon={IndianRupee}
                tone="brand"
                loading={summaryQuery.isPending}
              />
              <StatCard
                label="Pending Payout"
                value={stats ? formatMoney(stats.pendingPayoutPaise, stats.currency) : '—'}
                hint={
                  stats
                    ? `Paid out: ${formatMoney(stats.paidOutPaise, stats.currency)}`
                    : undefined
                }
                icon={Wallet}
                tone="warning"
                loading={summaryQuery.isPending}
              />
            </section>

            {/* Tabs: Referred Students vs Payout History */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
                <div className="flex gap-1.5" role="tablist">
                  {VIEW_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={cn(
                        'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                        activeTab === tab.value
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'referrals' ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {REFERRAL_FILTERS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFilter(opt.value)}
                        className={cn(
                          'rounded-md px-2.5 py-1 text-xs font-medium transition',
                          filter === opt.value
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="p-5">
                {activeTab === 'referrals' ? (
                  <div className="space-y-4">
                    <SearchBar
                      value={search}
                      onChange={setSearch}
                      placeholder="Search referred students by name or college…"
                    />

                    {referralsQuery.isPending ? (
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-16 w-full rounded-xl" />
                        ))}
                      </div>
                    ) : referralsQuery.isError ? (
                      <ErrorState
                        error={referralsQuery.error}
                        title="Could not load referred students"
                        onRetry={() => referralsQuery.refetch()}
                      />
                    ) : referrals.length === 0 ? (
                      <EmptyState
                        icon={GraduationCap}
                        title="No referred students found"
                        description={
                          search || filter !== 'all'
                            ? 'Try adjusting your search or payment filter.'
                            : 'When students apply your reference code and complete payment, they and your earned commission will appear here.'
                        }
                      />
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[680px] text-left text-sm">
                            <thead>
                              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                <th className="pb-3 pr-4">Student</th>
                                <th className="pb-3 pr-4">College</th>
                                <th className="pb-3 pr-4">Internship</th>
                                <th className="pb-3 pr-4">Joined</th>
                                <th className="pb-3 pr-4 text-right">Your Earning</th>
                                <th className="pb-3 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                              {referrals.map((student) => (
                                <tr
                                  key={student._id}
                                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                >
                                  <td className="py-3.5 pr-4">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                      {student.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {student.maskedEmail}
                                    </p>
                                  </td>
                                  <td className="py-3.5 pr-4 text-xs text-slate-600 dark:text-slate-300">
                                    {student.college || '—'}
                                  </td>
                                  <td className="py-3.5 pr-4 text-xs text-slate-600 dark:text-slate-300">
                                    {student.enrollment ? (
                                      <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">
                                          {student.enrollment.domain ||
                                            student.enrollment.designation ||
                                            'Enrolled'}
                                        </p>
                                        {student.enrollment.durationMonths ? (
                                          <p className="text-[11px] text-slate-500">
                                            {student.enrollment.durationMonths} Month
                                            {student.enrollment.durationMonths === 1 ? '' : 's'}
                                          </p>
                                        ) : null}
                                      </div>
                                    ) : (
                                      <span className="text-slate-400">Not enrolled yet</span>
                                    )}
                                  </td>
                                  <td className="whitespace-nowrap py-3.5 pr-4 text-xs text-slate-500 dark:text-slate-400">
                                    {formatDate(student.joinedAt)}
                                  </td>
                                  <td className="whitespace-nowrap py-3.5 pr-4 text-right font-semibold text-slate-900 dark:text-white">
                                    {student.earnedAmountPaise > 0
                                      ? formatMoney(student.earnedAmountPaise, student.currency)
                                      : '₹0'}
                                  </td>
                                  <td className="whitespace-nowrap py-3.5 text-right">
                                    <EarningStatusBadge status={student.earningStatus} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {referralsTotalPages > 1 ? (
                          <div className="pt-2">
                            <Pagination
                              page={refPage}
                              totalPages={referralsTotalPages}
                              total={referralsTotal}
                              limit={10}
                              onPageChange={setRefPage}
                            />
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payoutsQuery.isPending ? (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-16 w-full rounded-xl" />
                        ))}
                      </div>
                    ) : payoutsQuery.isError ? (
                      <ErrorState
                        error={payoutsQuery.error}
                        title="Could not load payout history"
                        onRetry={() => payoutsQuery.refetch()}
                      />
                    ) : payouts.length === 0 ? (
                      <EmptyState
                        icon={Banknote}
                        title="No payouts settled yet"
                        description="Once an administrator settles your confirmed reference earnings, payout receipts and transaction references will appear here."
                      />
                    ) : (
                      <>
                        <div className="space-y-3">
                          {payouts.map((payout) => (
                            <div
                              key={payout._id}
                              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-base font-bold text-slate-900 dark:text-white">
                                    {formatMoney(payout.amountPaise, payout.currency)}
                                  </span>
                                  <Badge variant="success">Settled</Badge>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {payout.paymentMethod || 'Transfer'}
                                  {payout.transactionRef ? ` · Ref: ${payout.transactionRef}` : ''}
                                  {payout.earningsCount
                                    ? ` · ${payout.earningsCount} paid referral${payout.earningsCount === 1 ? '' : 's'}`
                                    : ''}
                                </p>
                                {payout.notes ? (
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {payout.notes}
                                  </p>
                                ) : null}
                              </div>
                              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                                {formatDateTime(payout.paidAt)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {payoutsTotalPages > 1 ? (
                          <div className="pt-2">
                            <Pagination
                              page={payoutPage}
                              totalPages={payoutsTotalPages}
                              total={payoutsTotal}
                              limit={10}
                              onPageChange={setPayoutPage}
                            />
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default TpoPortalPage;
