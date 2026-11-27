import { StatCard } from '@/shared/components/ui';
import { CheckCircle2, ClipboardList, Clock, UserCog } from '@/shared/icons';
import { formatNumber } from '@/shared/utils/helpers';
import { useAssignmentsSummary } from '../hooks/useAssignments';

/**
 * Shared 4-card overview metrics for admin trainer & assignment pages:
 * Total trainers, Overall trainer tasks, Overall reviewed tasks, and Overall pending tasks.
 */
export function TrainerSummaryCards() {
  const { data: summary = {}, isPending } = useAssignmentsSummary();

  return (
    <section aria-label="Trainer summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total trainers"
        value={formatNumber(summary.totalTrainers ?? 0)}
        hint={`${formatNumber(summary.assignedTrainers ?? 0)} assigned · ${formatNumber(summary.activeAssignments ?? 0)} active assignments`}
        icon={UserCog}
        loading={isPending}
      />
      <StatCard
        label="Overall trainer tasks"
        value={formatNumber(summary.totalTasks ?? 0)}
        hint={`${formatNumber(summary.totalSubmissions ?? 0)} submitted by students`}
        icon={ClipboardList}
        tone="brand"
        loading={isPending}
      />
      <StatCard
        label="Overall reviewed tasks"
        value={formatNumber(summary.reviewedTasks ?? 0)}
        hint={`${formatNumber(summary.approvedTasks ?? 0)} approved`}
        icon={CheckCircle2}
        tone="success"
        loading={isPending}
      />
      <StatCard
        label="Overall pending tasks"
        value={formatNumber(summary.pendingTasks ?? 0)}
        hint="Waiting for trainer review"
        icon={Clock}
        tone={(summary.pendingTasks ?? 0) > 0 ? 'warning' : 'default'}
        loading={isPending}
      />
    </section>
  );
}

export default TrainerSummaryCards;

