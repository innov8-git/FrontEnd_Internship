import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  CopyButton,
  Drawer,
  EmptyState,
  ErrorState,
  FormField,
  Input,
  Pagination,
  SearchBar,
  Skeleton,
  StatusBadge,
  toast,
} from '@/shared/components/ui';
import {
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Receipt,
  Wallet,
} from '@/shared/icons';
import { paths } from '@/shared/constants';
import { useDebounce } from '@/shared/hooks';
import { formatDate, formatDateTime, formatMoney } from '@/shared/utils/helpers';
import { cn } from '@/shared/utils/cn';
import {
  useProvisionTpoPortalAccess,
  useRecordTpoPayout,
  useTpoEarnings,
  useTpoReferrals,
} from '../hooks/useAdminTpos';
import {
  buildTpoCredentialsWhatsAppUrl,
  buildTpoLoginLink,
  buildTpoRegistrationLink,
  buildWhatsAppShareUrl,
  formatTpoCommission,
} from '../utils/tpoShare';

const SECTION_TABS = [
  { value: 'referrals', label: 'Referred Students' },
  { value: 'earnings', label: 'Earnings & Payouts' },
];

const VERIFICATION_TABS = [
  { value: 'true', label: 'Verified (Counted)' },
  { value: 'false', label: 'Pending Verification' },
  { value: 'all', label: 'All' },
];

export function TpoReferralsDrawer({ tpo, open, onClose }) {
  const [section, setSection] = useState('referrals');
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('true');
  const [page, setPage] = useState(1);
  const [earningsPage, setEarningsPage] = useState(1);

  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState('UPI / Bank Transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [freshCredentials, setFreshCredentials] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const provisionAccessMutation = useProvisionTpoPortalAccess();
  const recordPayoutMutation = useRecordTpoPayout();

  useEffect(() => {
    if (open) {
      setSection('referrals');
      setSearch('');
      setVerifiedFilter('true');
      setPage(1);
      setEarningsPage(1);
      setShowPayoutForm(false);
      setTransactionRef('');
      setPayoutNotes('');
      setFreshCredentials(null);
    }
  }, [open, tpo?._id]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, verifiedFilter]);

  const referralsQuery = useTpoReferrals(
    open ? tpo?._id : null,
    {
      page,
      limit: 10,
      verified: verifiedFilter,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    },
    { enabled: Boolean(open && tpo?._id && section === 'referrals') },
  );

  const earningsQuery = useTpoEarnings(
    open ? tpo?._id : null,
    { page: earningsPage, limit: 10 },
    { enabled: Boolean(open && tpo?._id && section === 'earnings') },
  );

  const liveTpo = earningsQuery.data?.tpo ?? referralsQuery.data?.tpo ?? tpo;
  const students = referralsQuery.data?.items ?? [];
  const total = referralsQuery.data?.total ?? 0;
  const totalPages = referralsQuery.data?.totalPages ?? 1;

  const earningRows = earningsQuery.data?.items ?? [];
  const earningsTotal = earningsQuery.data?.total ?? 0;
  const earningsTotalPages = earningsQuery.data?.totalPages ?? 1;
  const payouts = earningsQuery.data?.payouts ?? [];

  const handleProvisionOrResetPortal = async () => {
    if (!liveTpo?._id) return;
    try {
      const res = await provisionAccessMutation.mutateAsync({
        id: liveTpo._id,
        payload: { sendEmail: true },
      });
      setFreshCredentials(res?.credentials || null);
      toast.success(
        liveTpo.hasPortalAccount
          ? 'TPO portal password reset. Share the new credentials privately.'
          : 'Private TPO portal account provisioned.',
      );
    } catch (err) {
      toast.error(err?.message || 'Failed to provision TPO portal access.');
    }
  };

  const handleRecordPayout = async (e) => {
    e?.preventDefault();
    if (!liveTpo?._id) return;
    try {
      const res = await recordPayoutMutation.mutateAsync({
        id: liveTpo._id,
        payload: {
          paymentMethod: payoutMethod.trim() || 'Bank Transfer / UPI',
          ...(transactionRef.trim() ? { transactionRef: transactionRef.trim() } : {}),
          ...(payoutNotes.trim() ? { notes: payoutNotes.trim() } : {}),
        },
      });
      toast.success(
        `Recorded payout of ${formatMoney(res?.amountPaise)} for ${liveTpo.name}.`,
      );
      setShowPayoutForm(false);
      setTransactionRef('');
      setPayoutNotes('');
    } catch (err) {
      toast.error(err?.message || 'Failed to record payout.');
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={liveTpo ? `${liveTpo.name} — Referrals & Earnings` : 'TPO Referrals & Earnings'}
      description={
        liveTpo
          ? `${liveTpo.college} · Commission: ${formatTpoCommission(liveTpo.commissionType, liveTpo.commissionValue)}`
          : undefined
      }
    >
      {liveTpo ? (
        <div className="space-y-5">
          {/* TPO Quick Summary Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <p className="inline-flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-100">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {liveTpo.college}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {liveTpo.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {liveTpo.phone}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={liveTpo.isActive ? 'success' : 'neutral'}>
                  {liveTpo.isActive ? 'Active Code' : 'Code Inactive'}
                </Badge>
                <Badge variant={liveTpo.hasPortalAccount && liveTpo.portalEnabled ? 'info' : 'neutral'}>
                  <Lock className="mr-1 h-3 w-3" />
                  {liveTpo.hasPortalAccount
                    ? liveTpo.portalEnabled
                      ? 'Portal Enabled'
                      : 'Portal Disabled'
                    : 'No Portal Account'}
                </Badge>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/70">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white px-2.5 py-1 font-mono text-sm font-semibold text-brand-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-brand-300 dark:ring-slate-700">
                  {liveTpo.referralCode}
                </span>
                <CopyButton
                  value={liveTpo.referralCode}
                  label="Copy"
                  size="sm"
                  onCopy={() => toast.success('Reference code copied.')}
                />
                <CopyButton
                  value={buildTpoRegistrationLink(liveTpo.referralCode)}
                  label="Copy Link"
                  size="sm"
                  onCopy={() => toast.success('Shareable registration link copied.')}
                />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={paths.tpoPortal(liveTpo._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Preview Portal</span>
                </Link>
                <a
                  href={buildWhatsAppShareUrl(liveTpo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Financial & Count KPI Strip */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/70 sm:grid-cols-4">
              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Verified Refs
                </p>
                <p className="mt-0.5 text-base font-semibold text-slate-900 dark:text-white">
                  {liveTpo.totalReferences ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Paid Students
                </p>
                <p className="mt-0.5 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                  {liveTpo.paidConversions ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Total Earned
                </p>
                <p className="mt-0.5 text-base font-semibold text-brand-700 dark:text-brand-300">
                  {formatMoney(liveTpo.totalEarnedPaise ?? 0)}
                </p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Pending Payout
                </p>
                <p className="mt-0.5 text-base font-semibold text-amber-600 dark:text-amber-400">
                  {formatMoney(liveTpo.pendingPayoutPaise ?? 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Private Portal Provision / Reset Banner */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Private TPO Portal Credentials
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {liveTpo.hasPortalAccount
                    ? 'Reset password to generate fresh login credentials and revoke old sessions.'
                    : 'Generate a private login account so this TPO can check their referrals & earnings.'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={KeyRound}
                loading={provisionAccessMutation.isPending}
                onClick={handleProvisionOrResetPortal}
              >
                {liveTpo.hasPortalAccount ? 'Reset Password' : 'Enable Portal Login'}
              </Button>
            </div>

            {freshCredentials ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs space-y-2 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-amber-900 dark:text-amber-200">
                    One-Time Credentials (TPO Confidential)
                  </span>
                  <CopyButton
                    value={`Login URL: ${buildTpoLoginLink()}\nEmail: ${freshCredentials.email}\nPassword: ${freshCredentials.password}`}
                    label="Copy"
                    size="sm"
                    onCopy={() => toast.success('Credentials copied.')}
                  />
                </div>
                <p className="font-mono text-slate-800 dark:text-slate-200">
                  Email: {freshCredentials.email} · Password: <strong>{freshCredentials.password}</strong>
                </p>
                <a
                  href={buildTpoCredentialsWhatsAppUrl(liveTpo, freshCredentials)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline dark:text-brand-300"
                >
                  <span>Send via WhatsApp (Confidential)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : null}
          </div>

          {/* Primary Section Tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSection(tab.value)}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                  section === tab.value
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {section === 'referrals' ? (
            <>
              {/* Filter Pills + Search */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {VERIFICATION_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setVerifiedFilter(tab.value)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                        verifiedFilter === tab.value
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search referred students by name or email…"
                />
              </div>

              {/* Student List */}
              {referralsQuery.isPending ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : referralsQuery.isError ? (
                <ErrorState
                  error={referralsQuery.error}
                  title="Could not load referred students"
                  onRetry={() => referralsQuery.refetch()}
                />
              ) : students.length === 0 ? (
                <EmptyState
                  icon={GraduationCap}
                  title={
                    verifiedFilter === 'true'
                      ? 'No verified referrals yet'
                      : verifiedFilter === 'false'
                        ? 'No unverified referrals'
                        : 'No referred students yet'
                  }
                  description={
                    search
                      ? 'No students matched your search query.'
                      : 'Once students use this TPO reference code, they will appear here.'
                  }
                />
              ) : (
                <div className="space-y-2.5">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {student.name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {student.email}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                          {student.earnedAmountPaise > 0 ? (
                            <Badge variant={student.earningStatus === 'PAID' ? 'success' : 'info'}>
                              <Wallet className="mr-1 h-3 w-3" />
                              Earned {formatMoney(student.earnedAmountPaise)}
                            </Badge>
                          ) : null}
                          {student.emailVerified ? (
                            <Badge variant="success">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="warning">
                              <Clock className="mr-1 h-3 w-3" />
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <span>Joined {formatDate(student.createdAt)}</span>
                        {student.latestEnrollment ? (
                          <div className="flex items-center gap-1.5">
                            <span className="max-w-[180px] truncate">
                              {student.latestEnrollment.domain ||
                                student.latestEnrollment.designation ||
                                'Enrolled'}
                            </span>
                            <StatusBadge status={student.latestEnrollment.status} />
                          </div>
                        ) : (
                          <span>Not enrolled yet</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 ? (
                    <div className="pt-2">
                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        limit={10}
                        onPageChange={setPage}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </>
          ) : (
            /* Earnings & Payouts Tab */
            <div className="space-y-5">
              {/* Record Payout Action */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Pending Settlement Balance:{' '}
                      <span className="text-amber-600 dark:text-amber-400">
                        {formatMoney(liveTpo.pendingPayoutPaise ?? 0)}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Total Paid Out: {formatMoney(liveTpo.paidOutPaise ?? 0)}
                    </p>
                  </div>
                  {(liveTpo.pendingPayoutPaise ?? 0) > 0 ? (
                    <Button
                      size="sm"
                      leftIcon={Banknote}
                      onClick={() => setShowPayoutForm((v) => !v)}
                    >
                      {showPayoutForm ? 'Cancel' : 'Record Payout'}
                    </Button>
                  ) : null}
                </div>

                {showPayoutForm ? (
                  <form
                    onSubmit={handleRecordPayout}
                    className="mt-4 space-y-3 border-t border-slate-200 pt-3 dark:border-slate-700"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormField label="Payment Method" htmlFor="payout-method">
                        <Input
                          id="payout-method"
                          value={payoutMethod}
                          onChange={(e) => setPayoutMethod(e.target.value)}
                          placeholder="e.g. UPI / NEFT / Bank Transfer"
                        />
                      </FormField>
                      <FormField label="Transaction Reference (Optional)" htmlFor="payout-ref">
                        <Input
                          id="payout-ref"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. UTR123456789"
                        />
                      </FormField>
                    </div>
                    <FormField label="Notes (Optional)" htmlFor="payout-notes">
                      <Input
                        id="payout-notes"
                        value={payoutNotes}
                        onChange={(e) => setPayoutNotes(e.target.value)}
                        placeholder="Monthly referral settlement"
                      />
                    </FormField>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="sm"
                        loading={recordPayoutMutation.isPending}
                      >
                        Settle {formatMoney(liveTpo.pendingPayoutPaise ?? 0)} as Paid
                      </Button>
                    </div>
                  </form>
                ) : null}
              </div>

              {/* Earnings Ledger */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Per-Enrollment Commission Ledger
                </p>

                {earningsQuery.isPending ? (
                  <Skeleton className="h-24 w-full rounded-xl" />
                ) : earningsQuery.isError ? (
                  <ErrorState
                    error={earningsQuery.error}
                    title="Could not load earnings ledger"
                    onRetry={() => earningsQuery.refetch()}
                  />
                ) : earningRows.length === 0 ? (
                  <EmptyState
                    icon={Wallet}
                    title="No paid referral earnings yet"
                    description="Earnings are recorded automatically whenever a referred student completes an internship payment."
                  />
                ) : (
                  <>
                    {earningRows.map((row) => (
                      <div
                        key={row._id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {row.student?.name || 'Student'}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                              {row.student?.email} · {row.domain || row.designation || 'Internship'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                              +{formatMoney(row.earnedAmountPaise, row.currency)}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Fee paid: {formatMoney(row.paymentAmountPaise, row.currency)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800">
                          <span>{formatDateTime(row.createdAt)}</span>
                          <Badge
                            variant={
                              row.status === 'PAID'
                                ? 'success'
                                : row.status === 'REVERSED'
                                  ? 'danger'
                                  : 'info'
                            }
                          >
                            {row.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {earningsTotalPages > 1 ? (
                      <Pagination
                        page={earningsPage}
                        totalPages={earningsTotalPages}
                        total={earningsTotal}
                        limit={10}
                        onPageChange={setEarningsPage}
                      />
                    ) : null}
                  </>
                )}
              </div>

              {/* Payout History */}
              {payouts.length > 0 ? (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recorded Payouts
                  </p>
                  {payouts.map((payout) => (
                    <div
                      key={payout._id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/20"
                    >
                      <div>
                        <p className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                          <Receipt className="h-3.5 w-3.5 text-emerald-600" />
                          {formatMoney(payout.amountPaise, payout.currency)}
                          <span className="font-normal text-slate-500">
                            ({payout.earningsCount} referral{payout.earningsCount === 1 ? '' : 's'})
                          </span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          {payout.paymentMethod || 'Transfer'}
                          {payout.transactionRef ? ` · Ref: ${payout.transactionRef}` : ''}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {formatDateTime(payout.paidAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </Drawer>
  );
}

export default TpoReferralsDrawer;
