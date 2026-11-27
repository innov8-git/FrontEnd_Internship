import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, PageHeader, StatCard } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useDocumentTitle } from '@/shared/hooks';
import { AlertTriangle, ArrowLeft, Gauge, Inbox, Users } from '@/shared/icons';
import { formatNumber, formatPercent, pluralize } from '@/shared/utils/helpers';
import { ProgressReportTable } from '../components/ProgressReportTable';
import { useAdminTrainerReports, useTrainerAssignments } from '../hooks/useTrainerAssignments';
import { INACTIVE_AFTER_DAYS, isTeamItem, toReportRow } from '../utils/reviewHelpers';

function summarise(rows) {
  const withTasks = rows.filter((row) => row.total > 0);
  const averageCompletion = withTasks.length
    ? withTasks.reduce((sum, row) => sum + row.completion, 0) / withTasks.length
    : null;
  const teams = rows.filter(isTeamItem).length;
  return {
    assigned: rows.length,
    students: rows.length - teams,
    teams,
    averageCompletion,
    inactive: rows.filter((row) => row.inactive === 'yes').length,
    pending: rows.reduce((sum, row) => sum + row.pending, 0),
  };
}

/**
 * /trainer/reports (KD13) and /admin/trainers/:trainerId/reports:
 * how every assigned student and team is progressing for the active trainer (or selected trainer in admin view).
 */
export function TrainerReportsPage() {
  const { trainerId } = useParams();
  const isAdminView = Boolean(trainerId);

  const trainerQuery = useTrainerAssignments({ enabled: !isAdminView });
  const adminQuery = useAdminTrainerReports(trainerId);
  const activeQuery = isAdminView ? adminQuery : trainerQuery;

  const trainerName = adminQuery.trainer?.name || 'Trainer';
  useDocumentTitle(isAdminView ? `${trainerName} — Reports` : 'Reports');

  const { data, isLoading, isError, error, refetch, isFetching } = activeQuery;
  const rows = useMemo(() => (data ? data.map(toReportRow) : undefined), [data]);
  const summary = useMemo(() => summarise(rows ?? []), [rows]);
  const tilesLoading = isLoading || (!rows && isFetching);
  const showTiles = !isError || Boolean(rows);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={isAdminView ? 'Trainer reports' : undefined}
        title={isAdminView ? `${trainerName} — Reports` : 'Reports'}
        description={
          isAdminView
            ? `Progress of the students and teams assigned to ${trainerName}. Inactive ones are listed first.`
            : 'Progress of the students and teams assigned to you. Inactive ones are listed first.'
        }
        actions={
          isAdminView ? (
            <Button as={Link} to={ROUTES.ADMIN_ASSIGNMENTS} variant="outline" leftIcon={ArrowLeft}>
              Back to assignments
            </Button>
          ) : (
            <Button as={Link} to={ROUTES.TRAINER} variant="outline" leftIcon={Inbox}>
              Review queue
            </Button>
          )
        }
      />

      {showTiles ? (
        <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={isAdminView ? 'Assigned to trainer' : 'Assigned to you'}
            value={formatNumber(summary.assigned)}
            hint={`${pluralize(summary.students, 'student')} · ${pluralize(summary.teams, 'team')}`}
            icon={Users}
            loading={tilesLoading}
          />
          <StatCard
            label="Average completion"
            value={summary.averageCompletion === null ? '—' : formatPercent(summary.averageCompletion)}
            hint="Approved tasks out of all tasks"
            icon={Gauge}
            tone="brand"
            loading={tilesLoading}
          />
          <StatCard
            label="Inactive"
            value={formatNumber(summary.inactive)}
            hint={`No activity for ${INACTIVE_AFTER_DAYS}+ days`}
            icon={AlertTriangle}
            tone={summary.inactive > 0 ? 'warning' : 'default'}
            loading={tilesLoading}
          />
          <StatCard
            label="Waiting for review"
            value={formatNumber(summary.pending)}
            hint={isAdminView ? 'Submissions in trainer queue' : 'Submissions in your queue'}
            icon={Inbox}
            to={isAdminView ? undefined : ROUTES.TRAINER}
            loading={tilesLoading}
          />
        </section>
      ) : null}

      <ProgressReportTable
        rows={rows}
        loading={isLoading || isFetching}
        error={isError ? error : null}
        onRetry={refetch}
      />
    </div>
  );
}

export default TrainerReportsPage;
