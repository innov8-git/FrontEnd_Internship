import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  DataTable,
  Input,
  PageHeader,
  Select,
} from '@/shared/components/ui';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  FolderGit2,
  Search,
  Smartphone,
  User,
  UserCheck,
} from '@/shared/icons';
import { useDocumentTitle } from '@/shared/hooks';
import { formatDate } from '@/shared/utils/helpers';
import { AssignProjectDialog } from '../components/AssignProjectDialog';
import { CatalogTabs } from '../components/CatalogTabs';
import { useCatalogOptions } from '../hooks/useCatalogAdmin';
import { useProjectAssignments } from '../hooks/useProjects';

const HOME_DOMAIN_ORDER = [
  'banking',
  'finance',
  'telecom',
  'e-commerce',
  'healthcare',
  'insurance',
  'erp-crm',
  'loan',
];

const TRACK_OPTIONS = [
  { value: '', label: 'All tracks' },
  { value: 'web', label: 'Web Development' },
  { value: 'app', label: 'Mobile App Development' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All assignments' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'UNASSIGNED', label: 'Pending Allocation' },
];

export default function ProjectAssignmentsPage() {
  useDocumentTitle('Project Assignments');

  const [search, setSearch] = useState('');
  const [domainId, setDomainId] = useState('');
  const [track, setTrack] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [assignmentModal, setAssignmentModal] = useState({ open: false, assignment: null });

  const domainsQuery = useCatalogOptions('domain');

  const sortedDomains = useMemo(() => {
    return [...(domainsQuery.data ?? [])].sort((a, b) => {
      const idxA = HOME_DOMAIN_ORDER.indexOf(a.slug);
      const idxB = HOME_DOMAIN_ORDER.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [domainsQuery.data]);

  const domainOptions = [
    { value: '', label: 'All domains' },
    ...sortedDomains.map((d) => ({ value: d._id, label: d.name })),
  ];

  const { data: assignmentsData, isLoading } = useProjectAssignments({
    search: search.trim() || undefined,
    domainId: domainId || undefined,
    track: track || undefined,
    status: status || undefined,
    page,
    limit: 15,
  });

  const assignments = assignmentsData?.items ?? [];

  const columns = useMemo(
    () => [
      {
        key: 'student',
        header: 'Student',
        className: 'min-w-[14rem]',
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-xs dark:bg-brand-950/60 dark:text-brand-300">
              {row.student?.name ? row.student.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">{row.student?.name || '—'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{row.student?.email || '—'}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'domain',
        header: 'Domain',
        className: 'min-w-[8rem]',
        cell: (row) => (
          <Badge variant="brand" icon={Building2} size="sm">
            {row.domain?.name || '—'}
          </Badge>
        ),
      },
      {
        key: 'track',
        header: 'Role & Track',
        className: 'min-w-[12rem]',
        cell: (row) => {
          const isWeb = (row.track || 'web').toLowerCase() === 'web';
          return (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Trainee Software Engineer</p>
              <Badge variant={isWeb ? 'info' : 'brand'} size="xs" icon={isWeb ? Code2 : Smartphone}>
                {isWeb ? 'Web Development' : 'Mobile App Development'}
              </Badge>
            </div>
          );
        },
      },
      {
        key: 'duration',
        header: 'Duration',
        className: 'min-w-[8rem]',
        cell: (row) => (
          <div className="space-y-0.5">
            <Badge variant="outline" size="sm" icon={CalendarDays}>
              {row.durationMonths} Months
            </Badge>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {row.workingDays} working days
            </p>
          </div>
        ),
      },
      {
        key: 'project',
        header: 'Assigned Capstone Project',
        className: 'min-w-[15rem] max-w-sm',
        cell: (row) => {
          if (!row.projectId || !row.project) {
            return (
              <Badge variant="warning" size="sm" icon={Clock}>
                Pending Allocation
              </Badge>
            );
          }
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{row.project.title}</span>
                <Badge variant="success" size="xs" icon={CheckCircle2}>
                  Assigned
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {row.project.description}
              </p>
              {row.assignedAt ? (
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Allocated on {formatDate(row.assignedAt)}
                </p>
              ) : null}
            </div>
          );
        },
      },
      {
        key: 'actions',
        header: 'Action',
        align: 'right',
        className: 'min-w-[8rem]',
        cell: (row) => {
          const isAssigned = Boolean(row.projectId);
          return (
            <Button
              variant={isAssigned ? 'outline' : 'primary'}
              size="sm"
              leftIcon={isAssigned ? FolderGit2 : UserCheck}
              onClick={() => setAssignmentModal({ open: true, assignment: row })}
            >
              {isAssigned ? 'Change' : 'Assign'}
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog & Allocations"
        title="Project Assignments"
        description="Assign domain-specific capstone projects to enrolled students. Filter by domain, track (Web / App), or duration to allocate the right project."
      />

      <CatalogTabs />

      {/* Filter and search bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Input
            placeholder="Search student by name, email, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={Search}
            size="sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            size="sm"
            value={domainId}
            onChange={(e) => {
              setDomainId(e.target.value);
              setPage(1);
            }}
            options={domainOptions}
            aria-label="Filter by domain"
          />

          <Select
            size="sm"
            value={track}
            onChange={(e) => {
              setTrack(e.target.value);
              setPage(1);
            }}
            options={TRACK_OPTIONS}
            aria-label="Filter by track"
          />

          <Select
            size="sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            aria-label="Filter by assignment status"
          />
        </div>
      </div>

      {/* Assignments Table */}
      <DataTable
        columns={columns}
        data={assignments}
        isLoading={isLoading}
        emptyState={{
          title: 'No student enrollments found',
          description: 'Try adjusting your domain, track, or assignment status filters.',
        }}
      />

      {/* Assign / Change Project Dialog */}
      <AssignProjectDialog
        open={assignmentModal.open}
        assignment={assignmentModal.assignment}
        onClose={() => setAssignmentModal({ open: false, assignment: null })}
      />
    </div>
  );
}
