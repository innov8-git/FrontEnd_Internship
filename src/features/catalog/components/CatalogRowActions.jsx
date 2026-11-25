import { Button } from '@/shared/components/ui';
import { EyeOff, Globe, Pencil, Trash2 } from '@/shared/icons';
import { PUBLISH_STATUS } from '@/shared/constants';

/**
 * Row actions shared by the catalog tables: Edit, Publish / Unpublish, and optional Delete.
 * `itemLabel` names the row for screen readers ("Edit Java Developer").
 */
export function CatalogRowActions({ itemLabel, status, onEdit, onChangeStatus, onDelete, editLabel = 'Edit' }) {
  const isPublished = status === PUBLISH_STATUS.PUBLISHED;
  // 40px touch targets on phones, a calmer 32px from `sm` up.
  const sizeClasses = 'h-10 sm:h-8';

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={Pencil}
        className={sizeClasses}
        onClick={onEdit}
        aria-label={`${editLabel} ${itemLabel}`}
      >
        {editLabel}
      </Button>
      {isPublished ? (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={EyeOff}
          className={sizeClasses}
          onClick={() => onChangeStatus(PUBLISH_STATUS.DRAFT)}
          aria-label={`Unpublish ${itemLabel}`}
        >
          Unpublish
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          leftIcon={Globe}
          className={sizeClasses}
          onClick={() => onChangeStatus(PUBLISH_STATUS.PUBLISHED)}
          aria-label={`Publish ${itemLabel}`}
        >
          Publish
        </Button>
      )}
      {onDelete ? (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={Trash2}
          className={`${sizeClasses} text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40`}
          onClick={onDelete}
          aria-label={`Delete ${itemLabel}`}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default CatalogRowActions;
