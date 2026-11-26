import { useEffect, useState } from 'react';
import {
  Badge,
  CopyButton,
  Drawer,
  EmptyState,
  ErrorState,
  Pagination,
  SearchBar,
  Skeleton,
  StatusBadge,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
} from '@/shared/icons';
import { useDebounce } from '@/shared/hooks';
import { formatDate } from '@/shared/utils/helpers';
import { cn } from '@/shared/utils/cn';
import { useTpoReferrals } from '../hooks/useAdminTpos';
import { buildTpoRegistrationLink, buildWhatsAppShareUrl } from '../utils/tpoShare';

const VERIFICATION_TABS = [
  { value: 'true', label: 'Verified (Counted)' },
  { value: 'false', label: 'Pending Verification' },
  { value: 'all', label: 'All' },
];

export function TpoReferralsDrawer({ tpo, open, onClose }) {
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('true');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (open) {
      setSearch('');
      setVerifiedFilter('true');
      setPage(1);
    }
  }, [open, tpo?._id]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, verifiedFilter]);

  const query = useTpoReferrals(
    open ? tpo?._id : null,
    {
      page,
      limit: 10,
      verified: verifiedFilter,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    },
    { enabled: Boolean(open && tpo?._id) },
  );

  const liveTpo = query.data?.tpo ?? tpo;
  const students = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = query.data?.totalPages ?? 1;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={liveTpo ? `${liveTpo.name} — Referred Students` : 'Referred Students'}
      description={
        liveTpo
          ? `${liveTpo.college} · Only email-verified students count toward Total References.`
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
              <Badge variant={liveTpo.isActive ? 'success' : 'neutral'}>
                {liveTpo.isActive ? 'Active Code' : 'Inactive'}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/70">
              <div className="flex items-center gap-2">
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

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/70">
              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Verified References
                </p>
                <p className="mt-0.5 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                  {liveTpo.totalReferences ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Pending Verification
                </p>
                <p className="mt-0.5 text-lg font-semibold text-amber-600 dark:text-amber-400">
                  {liveTpo.pendingReferences ?? 0}
                </p>
              </div>
            </div>
          </div>

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
                      ? 'bg-brand-600 text-white shadow-xs'
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
          {query.isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : query.isError ? (
            <ErrorState
              error={query.error}
              title="Could not load referred students"
              onRetry={() => query.refetch()}
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
                  : 'Once students register using this TPO reference code and verify their email, they will appear here.'
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
                      {student.authProvider === 'GOOGLE' ? (
                        <Badge variant="info">Google</Badge>
                      ) : (
                        <Badge variant="neutral">Email</Badge>
                      )}
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
                        <span className="truncate max-w-[180px]">
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
        </div>
      ) : null}
    </Drawer>
  );
}

export default TpoReferralsDrawer;
