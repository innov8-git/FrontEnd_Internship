import { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  Skeleton,
  StatCard,
} from '@/shared/components/ui';
import { FolderGit2, IndianRupee, TrendingUp, Users } from '@/shared/icons';
import { useDocumentTitle } from '@/shared/hooks';
import { formatCompactMoney, formatDateTime, formatDuration, formatMoney } from '@/shared/utils/helpers';
import { getAdminRevenue } from '@/services/adminService';
import { queryKeys } from '@/services/queryKeys';
import { ClearFiltersButton } from '../components/ClearFiltersButton';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { FilterSelect } from '../components/FilterSelect';
import { PersonCell } from '../components/PersonCell';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { formatMonthShort, formatMonthLong, monthYear } from '../utils/format';

const FILTER_KEYS = ['domainId', 'durationMonths', 'projectId', 'from', 'to'];
const URL_KEYS = [...FILTER_KEYS, 'page', 'limit', 'search'];
const DEFAULT_PAGE_SIZE = 10;

/** Convert revenueByMonth to BarChart data. */
function toMonthSeries(revenueByMonth) {
  const rows = (Array.isArray(revenueByMonth) ? revenueByMonth : [])
    .filter((row) => row && row.month)
    .sort((a, b) => String(a.month).localeCompare(String(b.month)));
  const years = new Set(rows.map((row) => monthYear(row.month)));
  const withYear = years.size > 1;
  return rows.map((row) => ({
    month: row.month,
    label: formatMonthShort(row.month, withYear),
    value: Math.max(0, Number(row.amount) || 0),
  }));
}

/** Convert revenueByDomain to BarChart data. */
function toDomainSeries(revenueByDomain) {
  return (Array.isArray(revenueByDomain) ? revenueByDomain : [])
    .filter((row) => row && row.domain)
    .map((row) => ({
      label: row.domain,
      value: Math.max(0, Number(row.amount) || 0),
    }));
}

/** Convert revenueByProject to BarChart data. */
function toProjectSeries(revenueByProject) {
  return (Array.isArray(revenueByProject) ? revenueByProject : [])
    .filter((row) => row && row.project)
    .map((row) => ({
      label: row.project,
      value: Math.max(0, Number(row.amount) || 0),
    }));
}

export function RevenuePage() {
  useDocumentTitle('Revenue');
  const { values, setValue, setValues, clear } = useUrlFilters(URL_KEYS);
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      domainId: values.domainId,
      durationMonths: values.durationMonths,
      projectId: values.projectId,
      from: values.from,
      to: values.to,
      search: values.search,
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [values.domainId, values.durationMonths, values.projectId, values.from, values.to, values.search, page],
  );

  const { data, isPending } = useQuery({
    queryKey: [...queryKeys.admin.revenue, filters],
    queryFn: () => getAdminRevenue(filters),
    keepPreviousData: true,
  });

  const activeFilterCount = FILTER_KEYS.filter((key) => values[key]).length;

  const rows = data?.items || [];
  const summary = data?.summary || {};
  const filterOptions = data?.filterOptions || {};

  const revenueByMonthData = useMemo(() => data?.revenueByMonth || [], [data?.revenueByMonth]);
  const revenueByDomainData = useMemo(() => data?.revenueByDomain || [], [data?.revenueByDomain]);
  const revenueByProjectData = useMemo(() => data?.revenueByProject || [], [data?.revenueByProject]);

  const monthSeries = useMemo(() => toMonthSeries(revenueByMonthData), [revenueByMonthData]);
  const domainSeries = useMemo(() => toDomainSeries(revenueByDomainData), [revenueByDomainData]);
  const projectSeries = useMemo(() => toProjectSeries(revenueByProjectData), [revenueByProjectData]);
  const hasMonthRevenue = monthSeries.some((row) => row.value > 0);
  const hasDomainRevenue = domainSeries.some((row) => row.value > 0);
  const hasProjectRevenue = projectSeries.some((row) => row.value > 0);
  const currency = summary.currency || 'INR';
  const formatValue = useCallback((value) => formatCompactMoney(value, currency), [currency]);

  const projectOptions = useMemo(() => {
    const list = filterOptions.projects || [];
    if (!values.domainId) return list;
    return list.filter((p) => !p.domainId || p.domainId === values.domainId);
  }, [filterOptions.projects, values.domainId]);

  const isFiltered = Boolean(values.domainId || values.durationMonths || values.projectId || values.from || values.to || values.search);

  const monthSummary = useMemo(() => {
    if (!hasMonthRevenue) return 'No revenue recorded yet.';
    const best = monthSeries.reduce((top, row) => (row.value > top.value ? row : top), monthSeries[0]);
    const first = monthSeries[0];
    const last = monthSeries[monthSeries.length - 1];
    return `Revenue per month from ${formatMonthLong(first.month)} to ${formatMonthLong(last.month)}. Highest: ${formatMonthLong(best.month)} with ${formatMoney(best.value, currency)}.`;
  }, [monthSeries, hasMonthRevenue, currency]);

  const totalPages = data ? Math.ceil((data.total || 0) / DEFAULT_PAGE_SIZE) : 1;

  const handleSearch = useCallback(
    (e) => {
      setValue('search', e.target.value);
      setPage(1);
    },
    [setValue],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Revenue"
        description="Track student payments, filter by domain, duration and project to calculate revenue. All amounts shown in INR (paise converted to rupees)."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isPending ? (
          <>
            <Skeleton className="h-28" rounded="xl" />
            <Skeleton className="h-28" rounded="xl" />
            <Skeleton className="h-28" rounded="xl" />
            <Skeleton className="h-28" rounded="xl" />
          </>
        ) : (
          <>
            <StatCard
              icon={IndianRupee}
              label={isFiltered ? 'Calculated Revenue' : 'Total Revenue'}
              value={formatMoney(summary.totalRevenue || 0, currency)}
              tone="success"
            />
            <StatCard
              icon={Users}
              label="Paid Enrollments"
              value={summary.enrollmentCount || 0}
              tone="brand"
            />
            <StatCard
              icon={TrendingUp}
              label="Domains with Revenue"
              value={revenueByDomainData.length}
              tone="default"
            />
            <StatCard
              icon={FolderGit2}
              label="Projects with Revenue"
              value={revenueByProjectData.length}
              tone="warning"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card padding="none">
          <CardHeader
            title="Revenue by Month"
            description="Captured payments grouped by confirmation month."
          />
          <CardBody>
            {isPending ? (
              <Skeleton className="h-60 w-full" rounded="lg" />
            ) : (
              <BarChart
                data={hasMonthRevenue ? monthSeries : []}
                orientation="vertical"
                valueFormatter={formatValue}
                height={240}
                title="Revenue by month"
                description={monthSummary}
                labelHeader="Month"
                valueHeader="Revenue"
                emptyMessage="No revenue data yet."
              />
            )}
          </CardBody>
        </Card>

        <Card padding="none">
          <CardHeader
            title="Revenue by Domain"
            description="Total captured payments broken down by domain."
          />
          <CardBody>
            {isPending ? (
              <Skeleton className="h-60 w-full" rounded="lg" />
            ) : (
              <BarChart
                data={hasDomainRevenue ? domainSeries : []}
                orientation="vertical"
                valueFormatter={formatValue}
                height={240}
                title="Revenue by domain"
                description={hasDomainRevenue ? `Revenue across ${domainSeries.length} domain(s).` : ''}
                labelHeader="Domain"
                valueHeader="Revenue"
                emptyMessage="No domain revenue data yet."
              />
            )}
          </CardBody>
        </Card>

        <Card padding="none">
          <CardHeader
            title="Revenue by Project"
            description="Total captured payments broken down by project."
          />
          <CardBody>
            {isPending ? (
              <Skeleton className="h-60 w-full" rounded="lg" />
            ) : (
              <BarChart
                data={hasProjectRevenue ? projectSeries : []}
                orientation="vertical"
                valueFormatter={formatValue}
                height={240}
                title="Revenue by project"
                description={hasProjectRevenue ? `Revenue across ${projectSeries.length} project(s).` : ''}
                labelHeader="Project"
                valueHeader="Revenue"
                emptyMessage="No project revenue data yet."
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search student name…"
              value={values.search || ''}
              onChange={handleSearch}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-brand-600 dark:focus:ring-brand-900 w-full sm:w-56"
            />
            <FilterSelect
              label="Filter by domain"
              allLabel="All domains"
              value={values.domainId}
              onChange={(value) => {
                setValue('domainId', value);
                // If the selected project does not belong to the newly chosen domain, reset it
                if (value && values.projectId) {
                  const currProj = (filterOptions.projects || []).find((p) => p.value === values.projectId);
                  if (currProj && currProj.domainId && currProj.domainId !== value) {
                    setValue('projectId', '');
                  }
                }
                setPage(1);
              }}
              options={filterOptions.domains || []}
            />
            <FilterSelect
              label="Filter by duration"
              allLabel="All durations"
              value={values.durationMonths}
              onChange={(value) => { setValue('durationMonths', value); setPage(1); }}
              options={filterOptions.durations || []}
            />
            <FilterSelect
              label="Filter by project"
              allLabel="All projects"
              value={values.projectId}
              onChange={(value) => { setValue('projectId', value); setPage(1); }}
              options={projectOptions}
            />
            <DateRangeFilter
              label="Enroll date"
              from={values.from}
              to={values.to}
              onChange={({ from, to }) => { setValues({ from, to }); setPage(1); }}
            />
            <ClearFiltersButton count={activeFilterCount} onClear={() => { clear(FILTER_KEYS); setPage(1); }} />
          </div>

          {/* Revenue Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Student Name</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Domain</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Duration</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Project</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Student Pays</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Enroll Date</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-5 w-24" rounded="md" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <IndianRupee className="h-10 w-10 text-slate-300" />
                        <p className="font-medium">No revenue records found</p>
                        <p className="text-sm">Try adjusting your filters or check back later.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row._id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3">
                        <PersonCell person={{ name: row.studentName, email: row.studentEmail }} avatarSize="xs" />
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium dark:border-slate-700 dark:bg-slate-800">
                          {row.domain}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {formatDuration(row.durationMonths)}
                      </td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-slate-700 dark:text-slate-300" title={row.project}>
                        {row.project && row.project !== '—' ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                            <FolderGit2 className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                            <span className="truncate">{row.project}</span>
                          </span>
                        ) : (
                          <span className="italic text-slate-400">Not assigned yet</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {formatMoney(row.studentPays, row.currency)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                        {formatDateTime(row.enrollDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {!isPending && rows.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold dark:border-slate-600 dark:bg-slate-800/60">
                    <td colSpan={4} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      Total Revenue ({summary.enrollmentCount || 0} enrollment{(summary.enrollmentCount || 0) !== 1 ? 's' : ''})
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                      {formatMoney(summary.totalRevenue || 0, currency)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages} ({data?.total || 0} records)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default RevenuePage;

