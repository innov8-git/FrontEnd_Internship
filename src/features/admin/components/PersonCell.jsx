import { Link } from 'react-router-dom';
import { Avatar, Badge } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

/**
 * Name + email (optionally with an avatar) for table cells and detail views.
 * `person` = { _id, name, email } (any of them may be missing).
 * Pass `to` to make the person's name a navigation link.
 */
export function PersonCell({ person, isYou = false, showAvatar = true, avatarSize = 'sm', to, className }) {
  const name = person?.name || person?.email || 'Unknown user';
  const email = person?.name ? person?.email : null;

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      {showAvatar ? <Avatar name={name} size={avatarSize} aria-hidden="true" /> : null}
      <div className="min-w-0 max-w-[16rem]">
        <p className="flex min-w-0 items-center gap-2">
          {to ? (
            <Link
              to={to}
              className="truncate font-medium text-slate-900 transition-colors hover:text-brand-600 hover:underline dark:text-slate-100 dark:hover:text-brand-400"
              title={name}
            >
              {name}
            </Link>
          ) : (
            <span className="truncate font-medium text-slate-900 dark:text-slate-100" title={name}>
              {name}
            </span>
          )}
          {isYou ? (
            <Badge variant="brand" className="shrink-0">
              You
            </Badge>
          ) : null}
        </p>
        {email ? (
          <p className="truncate text-xs text-slate-500 dark:text-slate-400" title={email}>
            {email}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default PersonCell;
