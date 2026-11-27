import { useCallback, useState } from 'react';
import { Button, ConfirmDialog, PageHeader, toast } from '@/shared/components/ui';
import { Plus } from '@/shared/icons';
import { PUBLISH_STATUS } from '@/shared/constants';
import { getErrorMessage } from '@/shared/utils/errors';
import { getCatalogKind, useDeleteCatalogItem, useSetCatalogStatus } from '../hooks/useCatalogAdmin';
import { CatalogItemDialog } from './CatalogItemDialog';
import { CatalogTable } from './CatalogTable';
import { CatalogTabs } from './CatalogTabs';
import { StatusChangeDialog } from './StatusChangeDialog';

const PAGE_COPY = {
  designation: {
    description:
      'The roles students apply for, such as Java Developer. New designations start as drafts; publish one to show it in the public catalog. Nothing is ever deleted: unpublish to hide it.',
    publishMessage:
      'It will appear in the public catalog. Students can enroll once it has at least one published plan.',
  },
  domain: {
    description:
      'The industries students build their projects in, such as Banking or Healthcare. A plan pairs one designation with one domain. Unpublish a domain to hide it; nothing is ever deleted.',
    publishMessage: 'Published plans in this domain will be offered to students.',
  },
};

/**
 * Designations / Domains admin screen (KD3): page header with the catalog tabs, the list, the
 * create/edit dialog and the publish/unpublish confirmation. The two pages only differ by `kind`.
 */
export function CatalogManager({ kind }) {
  const config = getCatalogKind(kind);
  const copy = PAGE_COPY[config.kind];
  const statusMutation = useSetCatalogStatus(config.kind);
  const deleteMutation = useDeleteCatalogItem(config.kind);

  // Dialog targets are kept after closing so titles don't change while the dialog animates out.
  const [editor, setEditor] = useState({ open: false, item: null });
  const [statusChange, setStatusChange] = useState({ open: false, item: null, status: null });
  const [deleteTarget, setDeleteTarget] = useState({ open: false, item: null });

  const openCreate = useCallback(() => setEditor({ open: true, item: null }), []);
  const openEdit = useCallback((item) => setEditor({ open: true, item }), []);
  const closeEditor = useCallback(() => setEditor((current) => ({ ...current, open: false })), []);

  const requestStatusChange = useCallback(
    (item, status) => setStatusChange({ open: true, item, status }),
    [],
  );
  const closeStatusChange = () => {
    if (statusMutation.isPending) return;
    setStatusChange((current) => ({ ...current, open: false }));
  };

  const requestDelete = useCallback((item) => setDeleteTarget({ open: true, item }), []);
  const closeDelete = () => {
    if (deleteMutation.isPending) return;
    setDeleteTarget((current) => ({ ...current, open: false }));
  };

  const confirmDelete = () => {
    const { item } = deleteTarget;
    if (!item || deleteMutation.isPending) return;
    deleteMutation.mutate(item._id, {
      onSuccess: () => {
        setDeleteTarget((current) => ({ ...current, open: false }));
        toast.success(`${config.title} deleted`, {
          description: `${item.name} has been permanently removed.`,
        });
      },
      onError: (error) => {
        toast.error(`Couldn't delete ${item.name}`, {
          description: getErrorMessage(error),
        });
      },
    });
  };

  const confirmStatusChange = () => {
    const { item, status } = statusChange;
    if (!item || statusMutation.isPending) return;
    const isPublish = status === PUBLISH_STATUS.PUBLISHED;
    statusMutation.mutate(
      { id: item._id, status },
      {
        onSuccess: () => {
          setStatusChange((current) => ({ ...current, open: false }));
          toast.success(isPublish ? `${config.title} published` : `${config.title} unpublished`, {
            description: isPublish
              ? `${item.name} is now visible to students.`
              : `${item.name} is hidden from new students. Existing enrollments are not affected.`,
          });
        },
        onError: (error) => {
          toast.error(`Couldn't ${isPublish ? 'publish' : 'unpublish'} ${item.name}`, {
            description: getErrorMessage(error),
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title={config.titlePlural}
        description={copy.description}
        actions={
          <Button leftIcon={Plus} onClick={openCreate}>
            Create {config.singular}
          </Button>
        }
      >
        <CatalogTabs />
      </PageHeader>

      <CatalogTable
        kind={config.kind}
        onCreate={openCreate}
        onEdit={openEdit}
        onChangeStatus={requestStatusChange}
        onDelete={requestDelete}
      />

      <CatalogItemDialog open={editor.open} onClose={closeEditor} kind={config.kind} item={editor.item} />

      <StatusChangeDialog
        open={statusChange.open}
        onClose={closeStatusChange}
        onConfirm={confirmStatusChange}
        loading={statusMutation.isPending}
        nextStatus={statusChange.status}
        itemName={statusChange.item?.name}
        entityLabel={config.singular}
        publishMessage={copy.publishMessage}
      />

      <ConfirmDialog
        open={deleteTarget.open}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title={`Delete ${config.singular} "${deleteTarget.item?.name}"?`}
        message={`This will permanently delete this ${config.singular}. If it is currently linked to any plans, projects, assessments, or schedules, you will need to remove those first or unpublish it instead.`}
        confirmLabel={`Delete ${config.singular}`}
        variant="danger"
      />
    </div>
  );
}

export default CatalogManager;
