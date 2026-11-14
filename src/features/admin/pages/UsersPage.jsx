import { useMemo, useState } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  DataTable,
  DropdownMenu,
  PageHeader,
  StatusBadge,
  Tooltip,
} from '@/shared/components/ui';
import {
  Ban,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  RefreshCw,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
} from '@/shared/icons';
import { PAGE_SIZE_OPTIONS, ROLES, USER_STATUS } from '@/shared/constants';
import { queryKeys } from '@/services/queryKeys';
import { useAuth, useDocumentTitle } from '@/shared/hooks';
import { formatDate } from '@/shared/utils/helpers';
import { cn } from '@/shared/utils/cn';
import { FilterSelect } from '../components/FilterSelect';
import { PersonCell } from '../components/PersonCell';
import { RoleBadges } from '../components/RoleBadges';
import { RoleChangeDialog } from '../components/RoleChangeDialog';
import { UserStatusDialog } from '../components/UserStatusDialog';
import { ChangeTrainerDialog } from '../components/ChangeTrainerDialog';
import { ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../constants';
import { fetchAdminUsers } from '../hooks/useAdminUsers';
import { useUrlFilters } from '../hooks/useUrlFilters';

const FILTER_KEYS = ['role', 'status', 'trainerAssignment'];

const TRAINER_ASSIGNMENT_OPTIONS = [
  { value: 'assigned', label: 'Assigned Trainer' },
  { value: 'unassigned', label: 'Unassigned Student' },
];

const actionsButtonId = (userId) => `user-actions-${userId}`;

/**
 * The menu item that opened a dialog no longer exists when the dialog closes, so send focus back to
 * the row's actions button (after the dialog's own focus restore has run).
 */
function focusRowActions(userId) {
  if (!userId || typeof window === 'undefined') return;
  window.requestAnimationFrame(() => document.getElementById(actionsButtonId(userId))?.focus());
}

function EmailVerified({ verified }) {
  return verified ? (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      <Clock className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      Not verified
    </span>
  );
}

/** GP7 user and role management: search, filter by role/status, change roles, suspend or reactivate. */
export function UsersPage() {
  useDocumentTitle('Users');
  const { user: currentUser, updateUser } = useAuth();
  const currentUserId = currentUser?._id;
  const { values, setValue, clear, activeCount } = useUrlFilters(FILTER_KEYS);
  const [roleTarget, setRoleTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [trainerTarget, setTrainerTarget] = useState(null);

  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: queryKeys.admin.users }) > 0;

  const handleResetFilters = () => {
    clear();
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
  };

  const filters = useMemo(
    () => ({
      role: values.role,
      status: values.status,
      trainerAssignment: values.trainerAssignment,
    }),
    [values.role, values.status, values.trainerAssignment],
  );

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'User',
        sortable: true,
        headerClassName: 'min-w-[220px]',
        className: 'min-w-[220px]',
        cell: (user) => <PersonCell person={user} isYou={user._id === currentUserId} />,
      },
      {
        key: 'roles',
        header: 'Roles',
        headerClassName: 'min-w-[130px]',
        className: 'min-w-[130px]',
        cell: (user) => <RoleBadges roles={user.roles ?? []} />,
      },
      {
        key: 'assignedTrainer',
        header: 'Assigned Trainer',
        headerClassName: 'min-w-[230px]',
        className: 'min-w-[230px]',
        cell: (user) => {
          const isStudent = (user.roles ?? []).includes(ROLES.STUDENT);
          if (!isStudent) {
            return <span className="text-slate-400">—</span>;
          }

          const assignment = user.assignedTrainer;
          const trainer = assignment?.trainer;

          if (assignment?.assigned && trainer) {
            return (
              <div className="flex items-center justify-between gap-3 min-w-[210px]">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100" title={trainer.name}>
                    {trainer.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400" title={trainer.email}>
                    {trainer.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 shrink-0 px-2.5 text-xs font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-700 border-slate-200 dark:border-slate-700 dark:text-brand-400 dark:hover:bg-slate-800"
                  onClick={() => setTrainerTarget(user)}
                >
                  Change
                </Button>
              </div>
            );
          }

          return (
            <div className="flex items-center justify-between gap-3 min-w-[210px]">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 shrink-0 dark:bg-slate-800 dark:text-slate-400">
                Unassigned
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 shrink-0 px-2.5 text-xs font-medium text-sky-600 hover:bg-sky-50 hover:text-sky-700 border-slate-200 dark:border-slate-700 dark:text-sky-400 dark:hover:bg-slate-800"
                onClick={() => setTrainerTarget(user)}
              >
                Assign
              </Button>
            </div>
          );
        },
      },
      {
        key: 'status',
        header: 'Status',
        headerClassName: 'min-w-[110px]',
        className: 'min-w-[110px]',
        cell: (user) => <StatusBadge status={user.status} />,
      },
      {
        key: 'emailVerified',
        header: 'Email',
        cell: (user) => <EmailVerified verified={Boolean(user.emailVerified)} />,
      },
      {
        key: 'createdAt',
        header: 'Joined',
        sortable: true,
        cell: (user) => <span className="whitespace-nowrap text-slate-600 dark:text-slate-400">{formatDate(user.createdAt)}</span>,
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        cell: (user) => {
          const isSelf = user._id === currentUserId;
          const isSuspended = user.status === USER_STATUS.SUSPENDED;
          let statusItem;
          if (isSuspended) {
            statusItem = {
              label: 'Reactivate account',
              icon: UserCheck,
              onClick: () => setStatusTarget({ user, nextStatus: USER_STATUS.ACTIVE }),
            };
          } else if (isSelf) {
            statusItem = { label: "You can't suspend yourself", icon: Ban, disabled: true };
          } else {
            statusItem = {
              label: 'Suspend account',
              icon: Ban,
              danger: true,
              onClick: () => setStatusTarget({ user, nextStatus: USER_STATUS.SUSPENDED }),
            };
          }

          const isStudent = (user.roles ?? []).includes(ROLES.STUDENT);
          const studentTrainerItems = isStudent
            ? [
                {
                  label: user.assignedTrainer?.assigned ? 'Change trainer' : 'Assign trainer',
                  icon: user.assignedTrainer?.assigned ? UserCog : UserPlus,
                  onClick: () => setTrainerTarget(user),
                },
                { divider: true },
              ]
            : [];

          return (
            <DropdownMenu
              align="end"
              label={user.name || user.email}
              trigger={
                <Button
                  id={actionsButtonId(user._id)}
                  variant="ghost"
                  size="icon"
                  leftIcon={MoreHorizontal}
                  aria-label={`Actions for ${user.name || user.email}`}
                />
              }
              items={[
                ...studentTrainerItems,
                { label: 'Change roles', icon: UserCog, onClick: () => setRoleTarget(user) },
                { divider: true },
                statusItem,
              ]}
            />
          );
        },
      },
    ],
    [currentUserId],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage roles and account access. Every change is recorded in the audit log."
      />

      <DataTable
        fetcher={fetchAdminUsers}
        queryKey={queryKeys.admin.users}
        filters={filters}
        columns={columns}
        searchPlaceholder="Search name or email…"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        caption="Users"
        toolbar={
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:mr-2">
            <FilterSelect
              label="Filter by role"
              allLabel="All roles"
              value={values.role}
              onChange={(value) => setValue('role', value)}
              options={ROLE_OPTIONS}
              className="sm:w-32"
            />
            <FilterSelect
              label="Filter by status"
              allLabel="All statuses"
              value={values.status}
              onChange={(value) => setValue('status', value)}
              options={USER_STATUS_OPTIONS}
              className="sm:w-36"
            />
            <FilterSelect
              label="Trainer assignment"
              allLabel="All trainer assignments"
              value={values.trainerAssignment}
              onChange={(value) => setValue('trainerAssignment', value)}
              options={TRAINER_ASSIGNMENT_OPTIONS}
              className="sm:w-48"
            />
            <Tooltip content={activeCount > 0 ? 'Reset filters and reload' : 'Reload'}>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'h-10 w-10 shrink-0 text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-colors dark:text-slate-400 dark:hover:text-brand-400 dark:border-slate-700 dark:hover:border-brand-500',
                  activeCount > 0 && 'border-brand-400 bg-brand-50/60 text-brand-600 hover:bg-brand-100 dark:border-brand-600 dark:bg-brand-950/60 dark:text-brand-400 dark:hover:bg-brand-900/60',
                )}
                aria-label="Reload and reset filters"
                onClick={handleResetFilters}
                disabled={isFetching}
              >
                <RefreshCw
                  className={cn('h-4 w-4', isFetching && 'animate-spin text-brand-600')}
                  aria-hidden="true"
                />
              </Button>
            </Tooltip>
          </div>
        }
        emptyState={{
          icon: Users,
          title: 'No users yet',
          description: 'People appear here as soon as they register.',
        }}
      />

      <RoleChangeDialog
        user={roleTarget}
        currentUserId={currentUserId}
        onClose={() => {
          focusRowActions(roleTarget?._id);
          setRoleTarget(null);
        }}
        onSaved={(updated) => {
          // Keep the session in sync when admins change their own roles.
          if (updated?._id === currentUserId && Array.isArray(updated.roles)) {
            updateUser({ roles: updated.roles });
          }
        }}
      />
      <UserStatusDialog
        target={statusTarget}
        onClose={() => {
          focusRowActions(statusTarget?.user?._id);
          setStatusTarget(null);
        }}
      />
      <ChangeTrainerDialog
        student={trainerTarget}
        open={Boolean(trainerTarget)}
        onClose={() => {
          focusRowActions(trainerTarget?._id);
          setTrainerTarget(null);
        }}
      />
    </div>
  );
}

export default UsersPage;
