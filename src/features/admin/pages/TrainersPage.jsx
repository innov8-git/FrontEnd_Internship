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
  Tabs,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Inbox,
  MoreHorizontal,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
} from '@/shared/icons';
import { PAGE_SIZE_OPTIONS } from '@/shared/constants';
import { queryKeys } from '@/services/queryKeys';
import { useAuth, useDocumentTitle } from '@/shared/hooks';
import { formatDateTime, formatRelativeTime } from '@/shared/utils/helpers';
import { ClearFiltersButton } from '../components/ClearFiltersButton';
import { FilterSelect } from '../components/FilterSelect';
import { PersonCell } from '../components/PersonCell';
import { TrainerResumeModal } from '../components/TrainerResumeModal';
import { TrainerAssignmentsDrawer } from '../components/TrainerAssignmentsDrawer';
import { AssignStudentGroupModal } from '../components/AssignStudentGroupModal';
import { CreateTrainerModal } from '../components/CreateTrainerModal';
import {
  TrainerApplicationDrawer,
  openApplicationResume,
} from '../components/TrainerApplicationDrawer';
import { AcceptTrainerApplicationModal } from '../components/AcceptTrainerApplicationModal';
import {
  fetchAdminTrainers,
  fetchTrainerApplications,
  useDeleteTrainer,
  useDeleteTrainerApplication,
  usePendingTrainerApplicationsCount,
  useToggleTrainerPrivilege,
} from '../hooks/useAdminTrainers';
import { useUrlFilters } from '../hooks/useUrlFilters';

const FILTER_KEYS = ['trainerStatus', 'privilege', 'tab'];

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
  const activeTab = values.tab === 'requests' ? 'requests' : 'trainers';

  // Active trainers modal / drawer states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resumeTarget, setResumeTarget] = useState(null);
  const [assignmentsTarget, setAssignmentsTarget] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [privilegeTarget, setPrivilegeTarget] = useState(null);
  const [deleteTrainerTarget, setDeleteTrainerTarget] = useState(null);

  // Join requests modal / drawer states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const togglePrivilegeMutation = useToggleTrainerPrivilege();
  const deleteTrainerMutation = useDeleteTrainer();
  const deleteRequestMutation = useDeleteTrainerApplication();
  const pendingCountQuery = usePendingTrainerApplicationsCount();
  const pendingCount = pendingCountQuery.data ?? 0;

  const filters = useMemo(
    () => ({
      trainerStatus: values.trainerStatus,
      privilege: values.privilege,
    }),
    [values.trainerStatus, values.privilege],
  );

  const trainerFilterCount = [values.trainerStatus, values.privilege].filter(Boolean).length;

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

  const handleDeleteTrainer = async () => {
    if (!deleteTrainerTarget) return;
    try {
      const res = await deleteTrainerMutation.mutateAsync(deleteTrainerTarget._id);
      toast.success(
        res?.deletedAccount
          ? `Trainer ${deleteTrainerTarget.name} was permanently deleted.`
          : `Trainer ${deleteTrainerTarget.name} was removed from trainers.`,
      );
      setDeleteTrainerTarget(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to delete trainer.');
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRequestMutation.mutateAsync(deleteTarget._id);
      toast.success(`Deleted join request from ${deleteTarget.fullName}.`);
      if (selectedRequest?._id === deleteTarget._id) setSelectedRequest(null);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to delete trainer join request.');
    }
  };

  const handleQuickResumeDownload = async (event, app) => {
    event.stopPropagation();
    try {
      await openApplicationResume(app, {
        download: app.resumeMimeType !== 'application/pdf',
      });
    } catch (err) {
      toast.error(err?.message || 'Unable to open resume file.');
    }
  };

  const trainerColumns = useMemo(
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
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
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
                <span className="max-w-[130px] truncate" title={resumeName}>
                  {resumeName}
                </span>
              ) : (
                'View Profile'
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
              onClick={() => setAssignmentsTarget({ trainer, initialTab: 'students' })}
              className="inline-flex items-center gap-1.5 transition-transform hover:scale-105 focus-visible:outline-none"
              title="Click to view assigned students"
            >
              <Badge variant={count > 0 ? 'info' : 'neutral'}>
                <GraduationCap className="mr-1 h-3 w-3" />
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
              onClick={() => setAssignmentsTarget({ trainer, initialTab: 'groups' })}
              className="inline-flex items-center gap-1.5 transition-transform hover:scale-105 focus-visible:outline-none"
              title="Click to view assigned student groups / teams"
            >
              <Badge variant={count > 0 ? 'purple' : 'neutral'}>
                <Users className="mr-1 h-3 w-3" />
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
                label: 'View resume & details',
                icon: FileText,
                onClick: () => setResumeTarget(trainer),
              },
              {
                label: 'View assigned students & groups',
                icon: Users,
                onClick: () => setAssignmentsTarget({ trainer, initialTab: 'all' }),
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
              {
                label: 'Remove / Delete trainer',
                icon: Trash2,
                danger: true,
                disabled: trainer._id === currentUserId,
                onClick: () => setDeleteTrainerTarget(trainer),
              },
            ]}
          />
        ),
      },
    ],
    [currentUserId],
  );

  const requestColumns = useMemo(
    () => [
      {
        key: 'fullName',
        header: 'Applicant',
        sortable: true,
        cell: (app) => (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-white">{app.fullName}</span>
              {app.existingUser ? (
                <Badge variant="warning">Existing account</Badge>
              ) : null}
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{app.email}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Phone className="h-3 w-3" />
              {app.phone}
            </p>
          </div>
        ),
      },
      {
        key: 'organization',
        header: 'Company / College',
        sortable: true,
        cell: (app) => (
          <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="max-w-[160px] truncate" title={app.organization}>
              {app.organization}
            </span>
          </div>
        ),
      },
      {
        key: 'domain',
        header: 'Domain & Experience',
        cell: (app) => (
          <div className="space-y-1">
            <Badge variant="info">{app.domain}</Badge>
            <p className="text-xs text-slate-500 dark:text-slate-400">{app.experience}</p>
          </div>
        ),
      },
      {
        key: 'linkedinUrl',
        header: 'LinkedIn',
        cell: (app) => (
          <a
            href={app.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            <span>Profile</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ),
      },
      {
        key: 'resumeName',
        header: 'Resume',
        cell: (app) => (
          <Button
            variant="outline"
            size="sm"
            leftIcon={FileText}
            className="h-8 text-xs font-normal"
            onClick={(e) => handleQuickResumeDownload(e, app)}
          >
            <span className="max-w-[120px] truncate" title={app.resumeName}>
              {app.resumeName || 'Resume'}
            </span>
          </Button>
        ),
      },
      {
        key: 'createdAt',
        header: 'Submitted',
        sortable: true,
        cell: (app) => (
          <div className="whitespace-nowrap">
            <span className="block text-sm text-slate-800 dark:text-slate-200">
              {formatDateTime(app.createdAt)}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {formatRelativeTime(app.createdAt)}
            </span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        cell: (app) => (
          <div
            className="flex items-center justify-end gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              leftIcon={CheckCircle2}
              onClick={() => setAcceptTarget(app)}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Trash2}
              className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
              aria-label={`Delete join request from ${app.fullName}`}
              onClick={() => setDeleteTarget(app)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const tabItems = [
    {
      value: 'trainers',
      label: 'Active Trainers',
      icon: UserCog,
      content: (
        <div className="pt-4">
          <DataTable
            fetcher={fetchAdminTrainers}
            queryKey={queryKeys.admin.trainers}
            filters={filters}
            columns={trainerColumns}
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
                <ClearFiltersButton
                  count={trainerFilterCount}
                  onClear={() => {
                    if (activeCount > 0) clear();
                  }}
                />
              </>
            }
            emptyState={{
              icon: UserCog,
              title: 'No trainers found',
              description: 'Try adjusting your search terms or filters.',
            }}
          />
        </div>
      ),
    },
    {
      value: 'requests',
      label: 'Join Requests',
      icon: Inbox,
      count: pendingCount > 0 ? pendingCount : undefined,
      content: (
        <div className="pt-4">
          <DataTable
            fetcher={fetchTrainerApplications}
            queryKey={queryKeys.admin.trainerApplications}
            columns={requestColumns}
            initialSort={{ key: 'createdAt', direction: 'desc' }}
            searchPlaceholder="Search applicants by name, email, mobile, company, or domain…"
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            caption="Trainer join requests"
            onRowClick={(app) => setSelectedRequest(app)}
            rowClassName={(app) =>
              selectedRequest && app._id === selectedRequest._id ? 'bg-brand-50/60 dark:bg-brand-950/30' : undefined
            }
            emptyState={{
              icon: Inbox,
              title: 'No pending trainer join requests',
              description:
                'When someone submits the "Register as Trainer" form on the landing page, their application and resume will appear here for review.',
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainers"
        description="Manage active trainers, review incoming trainer join requests, inspect resumes, and provision trainer login credentials."
        actions={
          <Button leftIcon={UserPlus} onClick={() => setIsCreateModalOpen(true)}>
            Create Trainer
          </Button>
        }
      />

      <Tabs
        aria-label="Trainer management sections"
        items={tabItems}
        value={activeTab}
        onChange={(nextTab) => setValue('tab', nextTab === 'requests' ? 'requests' : '')}
      />

      {/* Create Trainer Modal (manual) */}
      <CreateTrainerModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Active Trainer Resume & Profile Modal */}
      <TrainerResumeModal
        trainer={resumeTarget}
        open={Boolean(resumeTarget)}
        onClose={() => setResumeTarget(null)}
      />

      {/* Assignments Drawer */}
      <TrainerAssignmentsDrawer
        trainer={assignmentsTarget?.trainer || assignmentsTarget}
        initialTab={assignmentsTarget?.initialTab || 'all'}
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
            ? 'Revoking trainer privileges will unassign this trainer from all currently assigned students and student groups. The trainer will no longer have access to the trainer workspace.'
            : 'Granting trainer privileges will allow this user to access the trainer review workspace and be assigned student submissions and groups.'
        }
        confirmLabel={privilegeTarget?.isTrainer ? 'Revoke Privilege' : 'Grant Privilege'}
        variant={privilegeTarget?.isTrainer ? 'danger' : 'primary'}
      />

      {/* Remove / Delete Trainer Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTrainerTarget)}
        onClose={() => setDeleteTrainerTarget(null)}
        onConfirm={handleDeleteTrainer}
        loading={deleteTrainerMutation.isPending}
        title={`Remove / Delete trainer ${deleteTrainerTarget?.name}?`}
        message="This will unassign all active students and groups from this trainer, remove their trainer profile and resume, and revoke their trainer access. If they have no other roles or review history, their user account will be permanently deleted."
        confirmLabel="Remove Trainer"
        variant="danger"
      />

      {/* Join Request Detail Drawer */}
      <TrainerApplicationDrawer
        application={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onAccept={(app) => {
          setSelectedRequest(null);
          setAcceptTarget(app);
        }}
        onDelete={(app) => {
          setDeleteTarget(app);
        }}
      />

      {/* Accept Join Request & Set Credentials Modal */}
      <AcceptTrainerApplicationModal
        application={acceptTarget}
        open={Boolean(acceptTarget)}
        onClose={() => setAcceptTarget(null)}
      />

      {/* Delete Join Request Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteRequest}
        loading={deleteRequestMutation.isPending}
        title={`Delete join request from ${deleteTarget?.fullName}?`}
        message="This will permanently delete the trainer application and remove the uploaded resume file. This action is recorded in the audit log and cannot be undone."
        confirmLabel="Delete Request"
        variant="danger"
      />
    </div>
  );
}

export default TrainersPage;
