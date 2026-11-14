import { Link } from 'react-router-dom';
import { Button, Card, CardFooter, ProgressBar, StatusBadge } from '@/shared/components/ui';
import { ArrowRight, CalendarDays, ClipboardList, FolderGit2, Users } from '@/shared/icons';
import { ENROLLMENT_STATUS, ROUTES, paths } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';
import { formatDate, pluralize } from '@/shared/utils/helpers';
import {
  describeEnrollment,
  getEnrollmentTeamId,
  isTeamEnrollment,
} from '../utils/dashboardHelpers';

/**
 * The active internship at a glance: designation, domain, duration, enrollment type and status,
 * plus approved/total task progress. `children` render in a divided row below (GitHub status).
 */
export function ProgressCard({ enrollment, approved = 0, total = 0, team, className, children }) {
  if (!enrollment) return null;
  const { designation, subtitle } = describeEnrollment(enrollment);
  const isTeam = isTeamEnrollment(enrollment);
  const teamId = getEnrollmentTeamId(enrollment);
  const teamName = team?.name ?? enrollment.team?.name ?? null;
  const remaining = Math.max(total - approved, 0);
  const isDone = total > 0 && remaining === 0;
  const isCompleted = enrollment.status === ENROLLMENT_STATUS.COMPLETED;

  return (
    <Card padding="none" className={cn('flex flex-col', className)}>
      <div className="flex-1 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">Your internship</p>
            <h2 className="mt-1 break-words text-xl font-semibold tracking-tight text-slate-900">
              {designation}
            </h2>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusBadge status={enrollment.enrollmentType} dot={false} />
            <StatusBadge status={enrollment.status} />
          </div>
        </div>

        {isTeam && teamName ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Users className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <span>
              Team{' '}
              {teamId ? (
                <Link to={paths.team(teamId)} className="link">
                  {teamName}
                </Link>
              ) : (
                <span className="font-medium text-slate-900 dark:text-slate-100">{teamName}</span>
              )}
            </span>
          </p>
        ) : null}

        {/* Assigned Capstone Project Card for Web & App Development */}
        {enrollment.project ? (
          <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/60 p-3.5 space-y-2 dark:border-brand-900/60 dark:bg-brand-950/40">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5 dark:text-brand-300">
                <FolderGit2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                Assigned Capstone Project
              </span>
              <span className="rounded-md bg-white border border-brand-200 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-slate-800 dark:border-brand-800 dark:text-brand-300">
                {enrollment.track === 'app' ? '📱 Mobile App Track' : '🌐 Web Development Track'}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{enrollment.project.title}</p>
            {enrollment.project.description ? (
              <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
                {enrollment.project.description}
              </p>
            ) : null}
            {enrollment.track === 'app' && enrollment.project.appDeliverables ? (
              <p className="text-[11px] text-brand-800 bg-white/80 rounded-md p-2 border border-brand-200/80 dark:bg-slate-800/80 dark:border-brand-800 dark:text-brand-200">
                <strong>Track Scope:</strong> {enrollment.project.appDeliverables}
              </p>
            ) : enrollment.project.webDeliverables ? (
              <p className="text-[11px] text-brand-800 bg-white/80 rounded-md p-2 border border-brand-200/80 dark:bg-slate-800/80 dark:border-brand-800 dark:text-brand-200">
                <strong>Track Scope:</strong> {enrollment.project.webDeliverables}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs flex items-center justify-between gap-3 dark:border-amber-900/50 dark:bg-amber-950/40">
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">Capstone Project Allocation Pending</p>
              <p className="text-amber-700 mt-0.5 text-[11px] dark:text-amber-400">
                Your mentor or administrator will assign your domain capstone project shortly.
              </p>
            </div>
            <span className="rounded-md bg-white border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 shrink-0 dark:bg-slate-800 dark:border-amber-800 dark:text-amber-300">
              Pending Admin Assignment
            </span>
          </div>
        )}

        <div className="mt-6">
          {total > 0 ? (
            <>
              <ProgressBar
                value={approved}
                max={total}
                label="Tasks approved"
                showValue
                size="lg"
                variant={isDone ? 'success' : 'brand'}
                aria-valuetext={`${approved} of ${total} tasks approved`}
              />
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {approved} of {pluralize(total, 'task')}
                </span>{' '}
                approved
                {remaining > 0 ? ` · ${remaining} to go` : ''}
              </p>
            </>
          ) : (
            <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
              {isTeam
                ? "Your team's tasks appear here once the team starts."
                : 'Your tasks appear here once your schedule starts.'}
            </p>
          )}
        </div>

        {enrollment.activatedAt || enrollment.completedAt ? (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            {isCompleted && enrollment.completedAt
              ? `Completed ${formatDate(enrollment.completedAt)}`
              : `Started ${formatDate(enrollment.activatedAt)}`}
          </p>
        ) : null}
      </div>

      {children ? (
        <div className="border-t border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800">{children}</div>
      ) : null}

      <CardFooter className="justify-start gap-1 sm:justify-end">
        <Button
          as={Link}
          to={ROUTES.SCHEDULE}
          variant="ghost"
          size="sm"
          leftIcon={CalendarDays}
          className="h-10 sm:h-8"
        >
          Schedule
        </Button>
        <Button
          as={Link}
          to={ROUTES.TASKS}
          variant="ghost"
          size="sm"
          leftIcon={ClipboardList}
          rightIcon={ArrowRight}
          className="h-10 sm:h-8"
        >
          All tasks
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProgressCard;
