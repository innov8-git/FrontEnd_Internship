import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  PageHeader,
  StatusBadge,
  Switch,
  toast,
} from '@/shared/components/ui';
import {
  FileText,
  GraduationCap,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
} from '@/shared/icons';
import { PAGE_SIZE_OPTIONS } from '@/shared/constants';
import { queryKeys } from '@/services/queryKeys';
import { useAuth, useDocumentTitle } from '@/shared/hooks';
import { ClearFiltersButton } from '../components/ClearFiltersButton';
import { FilterSelect } from '../components/FilterSelect';
import { PersonCell } from '../components/PersonCell';
import { TrainerResumeModal } from '../components/TrainerResumeModal';
import { TrainerAssignmentsDrawer } from '../components/TrainerAssignmentsDrawer';
import { AssignStudentGroupModal } from '../components/AssignStudentGroupModal';
import {
  fetchAdminTrainers,
  useToggleTrainerPrivilege,
} from '../hooks/useAdminTrainers';
import { useUrlFilters } from '../hooks/useUrlFilters';

const FILTER_KEYS = ['trainerStatus', 'privilege'];

const ASSIGNMENT_STATUS_OPTIONS = [
  { value: 'assigned', label: 'Assigned (with students/groups)' },
  { value: 'unassigned', label: 'Unassigned (0 students/groups)' },
];

const PRIVILEGE_OPTIONS = [
  { value: 'active', label: 'Active Trainers' },
  { value: 'revoked', label: 'Trainer Privilege Revoked' },
];

export function TrainersPage() {
  useDocumentTitle('Trainers');
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  const { values, setValue, clear, activeCount } = useUrlFilters(FILTER_KEYS);

  // Modal / Drawer states
  const [resumeTarget, setResumeTarget] = useState(null);
  const [assignmentsTarget, setAssignmentsTarget] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [privilegeTarget, setPrivilegeTarget] = useState(null);

  const togglePrivilegeMutation = useToggleTrainerPrivilege();

  const filters = useMemo(
    () => ({
      trainerStatus: values.trainerStatus,
      privilege: values.privilege,
    }),
    [values.trainerStatus, values.privilege],
  );

  const handleTogglePrivilege = async () => {
    if (!privilegeTarget) return;
    try {
      const nextIsTrainer = !privilegeTarget.isTrainer;
      await togglePrivilegeMutation.mutateAsync({
        id: privilegeTarget._id,
        isTrainer: nextIsTrainer,
      });
      toast.success(
        nextIsTrainer
          ? `Trainer privilege granted to ${privilegeTarget.name}`
          : `Trainer privilege revoked from ${privilegeTarget.name}. All active assignments were unassigned.`,
      );
      setPrivilegeTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update trainer privilege');
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Trainer',
        sortable: true,
        cell: (trainer) => (
          <PersonCell person={trainer} isYou={trainer._id === currentUserId} />
        ),
      },
      {
        key: 'privilege',
        header: 'Trainer Privilege',
        cell: (trainer) => (
          <div className="flex items-center gap-2">
            <Switch
              size="sm"
              checked={Boolean(trainer.isTrainer)}
              onChange={() => setPrivilegeTarget(trainer)}
              aria-label={`Toggle trainer privilege for ${trainer.name}`}
            />
            {trainer.isTrainer ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Active Trainer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                Revoked
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'resume',
        header: 'Uploaded Resume',
        cell: (trainer) => {
          const profile = trainer.trainerProfile;
          const resumeName = profile?.resumeName;
          return (
            <Button
              variant="outline"
              size="sm"
              leftIcon={FileText}
              className="h-8 text-xs font-normal"
              onClick={() => setResumeTarget(trainer)}
            >
              {resumeName ? (
                <span className="truncate max-w-[130px]" title={resumeName}>
                  {resumeName}
                </span>
              ) : (
                'View Resume'
              )}
            </Button>
          );
        },
      },
      {
        key: 'assignedStudents',
        header: 'Assigned Students',
        cell: (trainer) => {
          const count = trainer.assignedStudentCount ?? 0;
          return (
            <button
              type="button"
              onClick={() => setAssignmentsTarget(trainer)}
              className="inline-flex items-center gap-1.5 transition-transform hover:scale-105 focus-visible:outline-none"
              title="Click to view assigned students"
            >
              <Badge variant={count > 0 ? 'info' : 'neutral'}>
                <GraduationCap className="h-3 w-3 mr-1" />
                {count} {count === 1 ? 'Student' : 'Students'}
              </Badge>
            </button>
          );
        },
      },
      {
        key: 'assignedGroups',
        header: 'Assigned Groups',
        cell: (trainer) => {
          const count = trainer.assignedGroupCount ?? 0;
          return (
            <button
              type="button"
              onClick={() => setAssignmentsTarget(trainer)}
              className="inline-flex items-center gap-1.5 transition-transform hover:scale-105 focus-visible:outline-none"
              title="Click to view assigned student groups / teams"
            >
              <Badge variant={count > 0 ? 'purple' : 'neutral'}>
                <Users className="h-3 w-3 mr-1" />
                {count} {count === 1 ? 'Group' : 'Groups'}
              </Badge>
            </button>
          );
        },
      },
      {
        key: 'status',
        header: 'Account Status',
        cell: (trainer) => <StatusBadge status={trainer.status} />,
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        cell: (trainer) => (
          <DropdownMenu
            align="end"
            label={trainer.name}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                leftIcon={MoreHorizontal}
                aria-label={`Actions for ${trainer.name}`}
              />
            }
            items={[
              {
                label: 'View resume details',
                icon: FileText,
                onClick: () => setResumeTarget(trainer),
              },
              {
                label: 'View assigned students & groups',
                icon: Users,
                onClick: () => setAssignmentsTarget(trainer),
              },
              {
                label: 'Assign student or group',
                icon: UserPlus,
                disabled: !trainer.isTrainer,
                onClick: () => setAssignTarget(trainer),
              },
              { divider: true },
              {
                label: trainer.isTrainer
                  ? 'Revoke trainer privilege'
                  : 'Grant trainer privilege',
                icon: trainer.isTrainer ? UserX : UserCheck,
                danger: Boolean(trainer.isTrainer),
                onClick: () => setPrivilegeTarget(trainer),
              },
            ]}
          />
        ),
      },
    ],
    [currentUserId],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainers"
        description="View all trainers, inspect uploaded resumes, manage trainer privileges, and monitor assigned students and student groups."
      />

      <DataTable
        fetcher={fetchAdminTrainers}
        queryKey={queryKeys.admin.trainers}
        filters={filters}
        columns={columns}
        searchPlaceholder="Search trainers by name or email…"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        caption="Trainers"
        toolbar={
          <>
            <FilterSelect
              label="Assignment Status"
              allLabel="All assignment states"
              value={values.trainerStatus}
              onChange={(value) => setValue('trainerStatus', value)}
              options={ASSIGNMENT_STATUS_OPTIONS}
              className="sm:w-56"
            />
            <FilterSelect
              label="Trainer Privilege"
              allLabel="All privileges"
              value={values.privilege}
              onChange={(value) => setValue('privilege', value)}
              options={PRIVILEGE_OPTIONS}
              className="sm:w-48"
            />
            <ClearFiltersButton count={activeCount} onClear={() => clear()} />
          </>
        }
        emptyState={{
          icon: UserCog,
          title: 'No trainers found',
          description: 'Try adjusting your search terms or filters.',
        }}
      />

      {/* Resume Modal */}
      <TrainerResumeModal
        trainer={resumeTarget}
        open={Boolean(resumeTarget)}
        onClose={() => setResumeTarget(null)}
      />

      {/* Assignments Drawer */}
      <TrainerAssignmentsDrawer
        trainer={assignmentsTarget}
        open={Boolean(assignmentsTarget)}
        onClose={() => setAssignmentsTarget(null)}
        onOpenAssign={(tr) => {
          setAssignmentsTarget(null);
          setAssignTarget(tr);
        }}
      />

      {/* Assign Student or Group Dialog */}
      <AssignStudentGroupModal
        trainer={assignTarget}
        open={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
      />

      {/* Toggle Privilege Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(privilegeTarget)}
        onClose={() => setPrivilegeTarget(null)}
        onConfirm={handleTogglePrivilege}
        loading={togglePrivilegeMutation.isPending}
        title={
          privilegeTarget?.isTrainer
            ? `Revoke Trainer Privilege from ${privilegeTarget?.name}?`
            : `Grant Trainer Privilege to ${privilegeTarget?.name}?`
        }
        message={
          privilegeTarget?.isTrainer
            ? `Revoking trainer privileges will unassign this trainer from all currently assigned students and student groups. The trainer will no longer have access to the trainer workspace.`
            : `Granting trainer privileges will allow this user to access the trainer review workspace and be assigned student submissions and groups.`
        }
        confirmLabel={
          privilegeTarget?.isTrainer ? 'Revoke Privilege' : 'Grant Privilege'
        }
        variant={privilegeTarget?.isTrainer ? 'danger' : 'primary'}
      />
    </div>
  );
}

export default TrainersPage;
