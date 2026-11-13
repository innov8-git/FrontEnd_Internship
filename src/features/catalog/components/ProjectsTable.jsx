import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  DataTable,
  DropdownMenu,
  StatusBadge,
} from '@/shared/components/ui';
import {
  Building2,
  CalendarDays,
  Eye,
  EyeOff,
  FolderGit2,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Star,
  Trash2,
} from '@/shared/icons';
import { PUBLISH_STATUS, ROUTES } from '@/shared/constants';
import { formatDate } from '@/shared/utils/helpers';

export function ProjectsTable({
  projects = [],
  isLoading,
  onCreate,
  onEdit,
  onChangeStatus,
  onDelete,
  onViewTasks,
}) {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Project',
        className: 'min-w-[16rem] max-w-sm',
        cell: (row) => {
          const techList = Array.isArray(row.technologies)
            ? row.technologies
            : typeof row.technologies === 'string'
              ? row.technologies.split(',').map((t) => t.trim()).filter(Boolean)
              : [];
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-900">{row.title}</span>
                {row.isDefault ? (
                  <Badge variant="warning" size="sm" icon={Star}>
                    Default
                  </Badge>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-600">
                  {row.slug}
                </code>
              </div>
              {techList.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {techList.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="inline-block rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {techList.length > 4 ? (
                    <span className="text-[10px] text-slate-400">
                      +{techList.length - 4} more
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        },
      },
      {
        key: 'domain',
        header: 'Domain',
        cell: (row) => (
          <Badge variant="neutral" icon={Building2}>
            {row.domain?.name || 'Unassigned'}
          </Badge>
        ),
      },
      {
        key: 'track',
        header: 'Tracks & Role',
        cell: () => (
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-800 block">
              Trainee Software Engineer
            </span>
            <Badge variant="brand" size="sm" icon={Sparkles}>
              Web & App Dev
            </Badge>
          </div>
        ),
      },
      {
        key: 'durations',
        header: 'Durations',
        cell: (row) => {
          const durations = Array.isArray(row.durationsSupported)
            ? row.durationsSupported
            : [1, 2, 3, 6];
          return (
            <div className="flex flex-wrap gap-1">
              {durations.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  {m}m
                </span>
              ))}
            </div>
          );
        },
      },
      {
        key: 'status',
        header: 'Status',
        cell: (row) => <StatusBadge status={row.status || 'PUBLISHED'} />,
      },
      {
        key: 'updatedAt',
        header: 'Updated',
        cell: (row) => (
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {row.updatedAt ? formatDate(row.updatedAt) : '—'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        cell: (row) => {
          const isPublished = row.status === PUBLISH_STATUS.PUBLISHED;
          const items = [
            {
              label: 'View daily tasks roadmap',
              icon: CalendarDays,
              onSelect: () => onViewTasks?.(row),
            },
            {
              label: 'Edit project details',
              icon: Pencil,
              onSelect: () => onEdit(row),
            },
            {
              label: 'Manage schedule builder',
              icon: CalendarDays,
              onSelect: () => navigate(ROUTES.ADMIN_SCHEDULES),
            },
            {
              label: isPublished ? 'Unpublish (hide from students)' : 'Publish to students',
              icon: isPublished ? EyeOff : Eye,
              onSelect: () =>
                onChangeStatus(
                  row,
                  isPublished ? PUBLISH_STATUS.DRAFT : PUBLISH_STATUS.PUBLISHED,
                ),
            },
            {
              label: 'Delete project',
              icon: Trash2,
              className: 'text-rose-600 hover:text-rose-700 hover:bg-rose-50',
              onSelect: () => onDelete?.(row),
            },
          ];

          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="outline"
                size="xs"
                leftIcon={CalendarDays}
                onClick={() => onViewTasks?.(row)}
                title="View daily tasks breakdown"
              >
                Daily Tasks
              </Button>
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="sm" aria-label={`Actions for ${row.title}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
                items={items}
              />
            </div>
          );
        },
      },
    ],
    [navigate, onEdit, onChangeStatus, onDelete, onViewTasks],
  );

  return (
    <DataTable
      columns={columns}
      data={projects}
      isLoading={isLoading}
      rowKey="_id"
      emptyState={{
        title: 'No projects found',
        description:
          'Projects are the real-world capstone assignments students build under each domain.',
        icon: FolderGit2,
        action: onCreate ? (
          <Button variant="primary" leftIcon={Plus} onClick={onCreate}>
            Create Project
          </Button>
        ) : null,
      }}
    />
  );
}

export default ProjectsTable;
