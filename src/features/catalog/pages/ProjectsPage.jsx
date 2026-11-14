import { useCallback, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  Input,
  PageHeader,
  Select,
  toast,
} from '@/shared/components/ui';
import { Plus, Search } from '@/shared/icons';
import { PUBLISH_STATUS } from '@/shared/constants';
import { useDocumentTitle } from '@/shared/hooks';
import { getErrorMessage } from '@/shared/utils/errors';
import { CatalogTabs } from '../components/CatalogTabs';
import { ProjectDialog } from '../components/ProjectDialog';
import { ProjectsTable } from '../components/ProjectsTable';
import { ProjectTasksModal } from '../components/ProjectTasksModal';
import { StatusChangeDialog } from '../components/StatusChangeDialog';
import { useCatalogOptions } from '../hooks/useCatalogAdmin';
import {
  useAdminProjects,
  useDeleteProject,
  useSetProjectStatus,
} from '../hooks/useProjects';

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

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: PUBLISH_STATUS.PUBLISHED, label: 'Published' },
  { value: PUBLISH_STATUS.DRAFT, label: 'Draft' },
];

export default function ProjectsPage() {
  useDocumentTitle('Projects');

  const [search, setSearch] = useState('');
  const [domainId, setDomainId] = useState('');
  const [status, setStatus] = useState('');

  const [editor, setEditor] = useState({ open: false, project: null });
  const [tasksViewer, setTasksViewer] = useState({ open: false, project: null });
  const [statusChange, setStatusChange] = useState({ open: false, item: null, status: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const domainsQuery = useCatalogOptions('domain');
  const statusMutation = useSetProjectStatus();
  const deleteMutation = useDeleteProject();

  const sortedDomains = [...(domainsQuery.data ?? [])].sort((a, b) => {
    const idxA = HOME_DOMAIN_ORDER.indexOf(a.slug);
    const idxB = HOME_DOMAIN_ORDER.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  const domainOptions = [
    { value: '', label: 'All domains' },
    ...sortedDomains.map((d) => ({ value: d._id, label: d.name })),
  ];

  const projectsQuery = useAdminProjects({
    search: search.trim() || undefined,
    domainId: domainId || undefined,
    status: status || undefined,
  });

  const openCreate = useCallback(() => setEditor({ open: true, project: null }), []);
  const openEdit = useCallback((project) => setEditor({ open: true, project }), []);
  const closeEditor = useCallback(() => setEditor((cur) => ({ ...cur, open: false })), []);

  const requestStatusChange = useCallback((item, newStatus) => {
    setStatusChange({ open: true, item, status: newStatus });
  }, []);

  const confirmDelete = () => {
    if (!deleteTarget || deleteMutation.isPending) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success('Project deleted', {
          description: `${deleteTarget.title} was permanently removed.`,
        });
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error('Could not delete project', {
          description: getErrorMessage(err),
        });
      },
    });
  };

  const confirmStatusChange = () => {
    const { item, status: targetStatus } = statusChange;
    if (!item || statusMutation.isPending) return;
    const isPublish = targetStatus === PUBLISH_STATUS.PUBLISHED;

    statusMutation.mutate(
      { id: item._id, status: targetStatus },
      {
        onSuccess: () => {
          setStatusChange({ open: false, item: null, status: null });
          toast.success(isPublish ? 'Project published' : 'Project unpublished', {
            description: isPublish
              ? `${item.title} will now be assigned to students enrolling in this domain.`
              : `${item.title} is hidden from new student enrollments.`,
          });
        },
        onError: (err) => {
          toast.error(`Could not ${isPublish ? 'publish' : 'unpublish'} project`, {
            description: getErrorMessage(err),
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Projects"
        description="Real-world projects under each domain. Every project supports both Web & Mobile App Development with daily tasks structured across 1, 2, 3, or 6-month internship spans."
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={openCreate}>
            Create Project
          </Button>
        }
      />

      <CatalogTabs />

      {/* Filter and search bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Input
            placeholder="Search projects by title, tech stack..."
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
            onChange={(e) => setDomainId(e.target.value)}
            options={domainOptions}
            aria-label="Filter by domain"
          />

          <Select
            size="sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
            aria-label="Filter by status"
          />

          <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreate}>
            Create Project
          </Button>
        </div>
      </div>

      <ProjectsTable
        projects={projectsQuery.data?.items ?? []}
        isLoading={projectsQuery.isLoading}
        onCreate={openCreate}
        onEdit={openEdit}
        onChangeStatus={requestStatusChange}
        onDelete={(project) => setDeleteTarget(project)}
        onViewTasks={(project) => setTasksViewer({ open: true, project })}
      />

      <ProjectDialog
        open={editor.open}
        onClose={closeEditor}
        project={editor.project}
      />

      <ProjectTasksModal
        open={tasksViewer.open}
        onClose={() => setTasksViewer({ open: false, project: null })}
        project={tasksViewer.project}
      />

      <StatusChangeDialog
        open={statusChange.open}
        itemName={statusChange.item?.title || ''}
        nextStatus={statusChange.status}
        loading={statusMutation.isPending}
        onClose={() => setStatusChange({ open: false, item: null, status: null })}
        onConfirm={confirmStatusChange}
        entityLabel="project"
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

