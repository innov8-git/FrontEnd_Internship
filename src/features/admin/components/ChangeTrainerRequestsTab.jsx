import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  Modal,
  Select,
  StatusBadge,
  toast,
} from '@/shared/components/ui';
import {
  CheckCircle2,
  RefreshCw,
  Trash2,
  UserCheck,
} from '@/shared/icons';
import { PAGE_SIZE_OPTIONS } from '@/shared/constants';
import { queryKeys } from '@/services/queryKeys';
import {
  getChangeTrainerRequests,
  resolveChangeTrainerRequest,
} from '@/services/trainerService';
import { getTrainers } from '@/services/adminService';
import { formatDateTime, formatRelativeTime } from '@/shared/utils/helpers';
import { PersonCell } from './PersonCell';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** Fetcher for the DataTable. */
const fetchChangeTrainerRequests = (params) => getChangeTrainerRequests(params);

/**
 * Admin panel to view and resolve student "Change Trainer" requests.
 * Rendered as a tab content inside TrainersPage.
 */
export function ChangeTrainerRequestsTab() {
  const queryClient = useQueryClient();
  const [resolveTarget, setResolveTarget] = useState(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch active trainers for the reassign dropdown
  const trainersQuery = useQuery({
    queryKey: [...queryKeys.admin.trainers, 'active-list'],
    queryFn: () => getTrainers({ limit: 200, privilege: 'active' }),
    select: (data) => data?.items || data?.data || data?.results || [],
    staleTime: 30_000,
  });
  const trainerOptions = useMemo(
    () =>
      (trainersQuery.data ?? []).map((t) => ({
        value: t._id,
        label: `${t.name} (${t.email})`,
      })),
    [trainersQuery.data],
  );

  const resolveMutation = useMutation({
    mutationFn: ({ id, ...payload }) => resolveChangeTrainerRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.trainerChangeRequests });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.trainers });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });

  const handleResolve = async () => {
    if (!resolveTarget || !selectedTrainerId) {
      toast.error('Please select a trainer to assign.');
      return;
    }
    try {
      await resolveMutation.mutateAsync({
        id: resolveTarget._id,
        newTrainerId: selectedTrainerId,
        status: 'APPROVED',
      });
      toast.success(
        `Trainer changed successfully for ${resolveTarget.studentName || 'the student'}.`,
      );
      setResolveTarget(null);
      setSelectedTrainerId('');
    } catch (err) {
      toast.error(err?.message || 'Failed to resolve change request.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await resolveMutation.mutateAsync({
        id: deleteTarget._id,
        status: 'REJECTED',
      });
      toast.success(`Change request from ${deleteTarget.studentName || 'student'} was rejected.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to reject change request.');
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'student',
        header: 'Student',
        sortable: true,
        cell: (req) => (
          <PersonCell
            person={{
              name: req.studentName,
              email: req.studentEmail,
              avatarUrl: req.studentAvatar,
            }}
          />
        ),
      },
      {
        key: 'phone',
        header: 'Mobile No.',
        cell: (req) => (
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {req.studentPhone || 'N/A'}
          </span>
        ),
      },
      {
        key: 'currentTrainer',
        header: 'Current Trainer',
        cell: (req) => (
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {req.currentTrainerName || 'Unknown'}
          </span>
        ),
      },
      {
        key: 'reason',
        header: 'Reason',
        cell: (req) => (
          <p
            className="max-w-[280px] truncate text-sm text-slate-600 dark:text-slate-400"
            title={req.reason}
          >
            {req.reason}
          </p>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        cell: (req) => <StatusBadge status={req.status || 'PENDING'} />,
      },
      {
        key: 'createdAt',
        header: 'Submitted',
        sortable: true,
        cell: (req) => (
          <div className="whitespace-nowrap">
            <span className="block text-sm text-slate-800 dark:text-slate-200">
              {formatDateTime(req.createdAt)}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {formatRelativeTime(req.createdAt)}
            </span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        cell: (req) => {
          if (req.status && req.status !== 'PENDING') {
            return (
              <Badge variant={req.status === 'APPROVED' ? 'success' : 'danger'}>
                {req.status === 'APPROVED' ? 'Resolved' : 'Rejected'}
              </Badge>
            );
          }
          return (
            <div
              className="flex items-center justify-end gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                leftIcon={UserCheck}
                onClick={() => {
                  setResolveTarget(req);
                  setSelectedTrainerId('');
                }}
              >
                Assign Trainer
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={Trash2}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                aria-label={`Reject request from ${req.studentName}`}
                onClick={() => setDeleteTarget(req)}
              >
                Reject
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <div className="pt-4">
        <DataTable
          fetcher={fetchChangeTrainerRequests}
          queryKey={queryKeys.admin.trainerChangeRequests}
          columns={columns}
          initialSort={{ key: 'createdAt', direction: 'desc' }}
          searchPlaceholder="Search by student name, email, or reason…"
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          caption="Trainer change requests"
          emptyState={{
            icon: RefreshCw,
            title: 'No trainer change requests',
            description:
              'When a student requests a trainer change from their dashboard, it will appear here for review.',
          }}
        />
      </div>

      {/* Resolve Request: Assign New Trainer Modal */}
      <Modal
        open={Boolean(resolveTarget)}
        onClose={() => {
          setResolveTarget(null);
          setSelectedTrainerId('');
        }}
        title={`Assign New Trainer to ${resolveTarget?.studentName || 'Student'}`}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Reason for change:</strong>
            </p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
              {resolveTarget?.reason}
            </p>
          </div>

          {resolveTarget?.currentTrainerName ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Current trainer:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {resolveTarget.currentTrainerName}
              </strong>
            </p>
          ) : null}

          <Select
            label="Select New Trainer"
            placeholder="Choose a trainer…"
            value={selectedTrainerId}
            onChange={(e) => setSelectedTrainerId(e.target.value)}
            options={trainerOptions}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setResolveTarget(null);
                setSelectedTrainerId('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={CheckCircle2}
              onClick={handleResolve}
              loading={resolveMutation.isPending}
              disabled={!selectedTrainerId}
            >
              Assign & Resolve
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Request Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={resolveMutation.isPending}
        title={`Reject change request from ${deleteTarget?.studentName}?`}
        message="This will reject the student's trainer change request. The student will remain with their current trainer."
        confirmLabel="Reject Request"
        variant="danger"
      />
    </>
  );
}

export default ChangeTrainerRequestsTab;

