import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Badge,
  Button,
  DataTable,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
  toast,
} from '@/shared/components/ui';
import {
  PAGE_SIZE_OPTIONS,
  REVIEW_DECISION,
  REVIEW_STATUS,
  ROUTES,
} from '@/shared/constants';
import { useDocumentTitle } from '@/shared/hooks';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  GithubIcon,
  UserPlus,
} from '@/shared/icons';
import { getAdminSubmissions, reviewAdminSubmission } from '@/services/adminService';
import { queryKeys } from '@/services/queryKeys';
import { getErrorMessage } from '@/shared/utils/errors';
import { formatDateTime, formatRelativeTime } from '@/shared/utils/helpers';

const STATUS_OPTIONS = [
  { value: '', label: 'All review statuses' },
  { value: REVIEW_STATUS.PENDING, label: 'Pending' },
  { value: REVIEW_STATUS.ESCALATED, label: 'Escalated' },
  { value: REVIEW_STATUS.CHANGES_REQUESTED, label: 'Changes requested' },
  { value: REVIEW_STATUS.APPROVED, label: 'Approved' },
  { value: REVIEW_STATUS.REJECTED, label: 'Rejected' },
];

const ASSIGNMENT_FILTER_OPTIONS = [
  { value: '', label: 'All trainer states' },
  { value: 'true', label: 'Unassigned only' },
];

const RESOLUTION_DECISIONS = [
  { value: REVIEW_DECISION.APPROVED, label: 'Approve' },
  { value: REVIEW_DECISION.CHANGES_REQUESTED, label: 'Request changes' },
  { value: REVIEW_DECISION.REJECTED, label: 'Reject' },
];

export default function AdminSubmissionsPage() {
  useDocumentTitle('Submissions & escalations');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const statusFilter = searchParams.get('status') ?? '';
  const unassignedFilter = searchParams.get('unassigned') ?? '';

  const [reviewTarget, setReviewTarget] = useState(null);
  const [decision, setDecision] = useState(REVIEW_DECISION.APPROVED);
  const [feedback, setFeedback] = useState('');

  const reviewMutation = useMutation({
    mutationFn: ({ id, decision: nextDecision, feedback: nextFeedback }) =>
      reviewAdminSubmission(id, { decision: nextDecision, feedback: nextFeedback }),
    onSuccess: () => {
      toast.success('Submission reviewed', {
        description: 'The student has been notified and their task status has been updated.',
      });
      setReviewTarget(null);
      setFeedback('');
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.submissions });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
    },
    onError: (err) => {
      toast.error("Couldn't save review", { description: getErrorMessage(err) });
    },
  });

  const setFilter = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const filters = useMemo(
    () => ({
      status: statusFilter || undefined,
      unassigned: unassignedFilter || undefined,
    }),
    [statusFilter, unassignedFilter],
  );

  const openResolve = (row) => {
    setReviewTarget(row);
    setDecision(REVIEW_DECISION.APPROVED);
    setFeedback('');
  };

  const handleSubmitResolve = (e) => {
    e.preventDefault();
    if (!reviewTarget || reviewMutation.isPending) return;
    if (decision !== REVIEW_DECISION.APPROVED && feedback.trim().length < 10) {
      toast.error('Please write at least 10 characters of feedback for the student.');
      return;
    }
    reviewMutation.mutate({
      id: reviewTarget._id,
      decision,
      feedback: feedback.trim(),
    });
  };

  const columns = useMemo(
    () => [
      {
        key: 'student',
        header: 'Student / Team',
        className: 'min-w-[13rem]',
        cell: (row) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-slate-100">
              {row.team?.name || row.student?.name || row.submittedBy?.name || '—'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {row.team
                ? `Submitted by ${row.submittedBy?.name || 'member'}`
                : row.student?.email || '—'}
            </p>
          </div>
        ),
      },
      {
        key: 'task',
        header: 'Task & Project',
        className: 'min-w-[14rem]',
        cell: (row) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-slate-100">
              {row.task ? `Task ${row.task.sequence} · ${row.task.title}` : 'Task'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {row.project?.title ||
                [row.plan?.designation?.name, row.plan?.domain?.name].filter(Boolean).join(' · ') ||
                '—'}
            </p>
          </div>
        ),
      },
      {
        key: 'assignedTrainer',
        header: 'Assigned Trainer',
        className: 'min-w-[11rem]',
        cell: (row) =>
          row.assignedTrainer ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {row.assignedTrainer.name}
              </p>
              <p className="truncate text-xs text-slate-500">{row.assignedTrainer.email}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="warning" icon={AlertTriangle}>
                Unassigned
              </Badge>
              <Button
                as={Link}
                to={ROUTES.ADMIN_ASSIGNMENTS}
                variant="ghost"
                size="xs"
                leftIcon={UserPlus}
              >
                Assign
              </Button>
            </div>
          ),
      },
      {
        key: 'reviewStatus',
        header: 'Status',
        cell: (row) => <StatusBadge status={row.reviewStatus} />,
      },
      {
        key: 'submittedAt',
        header: 'Submitted',
        className: 'whitespace-nowrap',
        cell: (row) => (
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <time dateTime={row.submittedAt} title={formatDateTime(row.submittedAt)}>
              {formatRelativeTime(row.submittedAt)}
            </time>
            <span className="block text-slate-400">Attempt #{row.attemptNumber ?? 1}</span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        cell: (row) => {
          const canReview =
            row.reviewStatus === REVIEW_STATUS.PENDING ||
            row.reviewStatus === REVIEW_STATUS.ESCALATED;
          return (
            <div className="flex items-center justify-end gap-2">
              {row.githubUrl ? (
                <Button
                  as="a"
                  href={row.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  size="sm"
                  leftIcon={GithubIcon}
                >
                  Repo
                </Button>
              ) : null}
              {canReview ? (
                <Button size="sm" variant="outline" onClick={() => openResolve(row)}>
                  {row.reviewStatus === REVIEW_STATUS.ESCALATED ? 'Resolve' : 'Review'}
                </Button>
              ) : null}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submissions & escalations"
        description="Monitor student submissions across trainers, catch unassigned work, and resolve escalated reviews."
        actions={
          <Button as={Link} to={ROUTES.ADMIN_ASSIGNMENTS} variant="outline" leftIcon={UserPlus}>
            Manage trainer assignments
          </Button>
        }
      />

      <DataTable
        caption="Student task submissions"
        columns={columns}
        fetcher={getAdminSubmissions}
        queryKey={queryKeys.admin.submissions}
        filters={filters}
        searchPlaceholder="Search student, team or task…"
        pageSize={15}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              size="sm"
              aria-label="Filter by review status"
              value={statusFilter}
              onChange={(e) => setFilter('status', e.target.value)}
              options={STATUS_OPTIONS}
              className="w-44"
            />
            <Select
              size="sm"
              aria-label="Filter by trainer assignment"
              value={unassignedFilter}
              onChange={(e) => setFilter('unassigned', e.target.value)}
              options={ASSIGNMENT_FILTER_OPTIONS}
              className="w-44"
            />
          </div>
        }
        emptyState={{
          icon: ClipboardCheck,
          title: 'No matching submissions',
          description: 'Student task submissions and trainer escalations will appear here.',
        }}
      />

      <Modal
        open={Boolean(reviewTarget)}
        onClose={() => {
          if (!reviewMutation.isPending) setReviewTarget(null);
        }}
        title={
          reviewTarget?.reviewStatus === REVIEW_STATUS.ESCALATED
            ? 'Resolve escalated submission'
            : 'Review submission'
        }
        description={
          reviewTarget
            ? `${reviewTarget.task?.title || 'Task'} · Attempt #${reviewTarget.attemptNumber ?? 1} by ${reviewTarget.student?.name || reviewTarget.submittedBy?.name || 'Student'}`
            : ''
        }
        size="lg"
      >
        {reviewTarget ? (
          <form onSubmit={handleSubmitResolve} className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm space-y-2 dark:border-slate-800 dark:bg-slate-900">
              <p className="font-medium text-slate-900 dark:text-slate-100">Student notes</p>
              <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                {reviewTarget.description}
              </p>
              {reviewTarget.githubUrl ? (
                <a
                  href={reviewTarget.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link inline-flex items-center gap-1.5 text-xs"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  {reviewTarget.githubUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
              {reviewTarget.review?.feedback ? (
                <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                  <strong>Escalation note ({reviewTarget.review.trainer?.name || 'Trainer'}):</strong>{' '}
                  {reviewTarget.review.feedback}
                </div>
              ) : null}
              {Array.isArray(reviewTarget.screenshots) && reviewTarget.screenshots.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {reviewTarget.screenshots.map((shot, idx) => (
                    <a
                      key={shot.storageKey || idx}
                      href={shot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-16 w-24 overflow-hidden rounded border border-slate-200 bg-white"
                    >
                      <img src={shot.url} alt={shot.name || `Screenshot ${idx + 1}`} className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <Select
              label="Decision"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              options={RESOLUTION_DECISIONS}
            />

            <Textarea
              label="Feedback for the student"
              required={decision !== REVIEW_DECISION.APPROVED}
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                decision === REVIEW_DECISION.APPROVED
                  ? 'Optional approval note for the student.'
                  : 'Explain clearly what needs to be fixed (at least 10 characters).'
              }
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setReviewTarget(null)}
                disabled={reviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftIcon={CheckCircle2}
                loading={reviewMutation.isPending}
              >
                Submit decision
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
