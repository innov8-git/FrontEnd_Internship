import { useId } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { Badge, Logo } from '@/shared/components/ui';
import { SUPPORT_EMAIL } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';

function hasBadge(value) {
  return value !== undefined && value !== null && value !== false && value !== '' && value !== 0;
}

function SidebarLink({ item, onNavigate }) {
  const { pathname } = useLocation();
  const Icon = item.icon;
  const alsoActive =
    Array.isArray(item.activePaths) &&
    item.activePaths.some((pattern) => matchPath({ path: pattern, end: true }, pathname) !== null);
  const showBadge = hasBadge(item.badge);

  return (
    <NavLink
      to={item.to}
      end={Boolean(item.end)}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:py-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
          isActive || alsoActive
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
        )
      }
    >
      {({ isActive }) => {
        const active = isActive || alsoActive;
        return (
          <>
            {Icon ? (
              <Icon
                aria-hidden="true"
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  active
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300',
                )}
              />
            ) : null}
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {showBadge ? (
              <span
                aria-hidden={item.badgeLabel ? 'true' : undefined}
                className="tabular inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold leading-4 text-white"
              >
                {item.badge}
              </span>
            ) : null}
            {showBadge && item.badgeLabel ? (
              <span className="sr-only">({item.badgeLabel})</span>
            ) : null}
          </>
        );
      }}
    </NavLink>
  );
}

/**
 * Workspace navigation (SN1, GP2, KD1).
 * - variant "fixed": the desktop sidebar (logo header, right border).
 * - variant "drawer": rendered inside the mobile Drawer, which already has its own header.
 */
export function Sidebar({
  navigation = [],
  roleLabel,
  homeTo = '/',
  onNavigate,
  variant = 'fixed',
  className,
}) {
  const baseId = useId();
  const isDrawer = variant === 'drawer';

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-white transition-colors duration-200 dark:bg-slate-900',
        !isDrawer && 'border-r border-slate-200 dark:border-slate-800',
        className,
      )}
    >
      {!isDrawer ? (
        <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5 dark:border-slate-800">
          <Logo to={homeTo} />
        </div>
      ) : null}

      <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto">
        <nav aria-label="Main" className={cn('flex-1 space-y-6', isDrawer ? 'pb-6' : 'px-3 py-5')}>
          {navigation.map((section, sectionIndex) => {
            const items = (section.items ?? []).filter((item) => item && !item.hidden);
            if (items.length === 0) return null;
            const headingId = `${baseId}-section-${sectionIndex}`;
            return (
              <div key={section.title ?? `section-${sectionIndex}`}>
                {section.title ? (
                  <p
                    id={headingId}
                    className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {section.title}
                  </p>
                ) : null}
                <ul
                  role="list"
                  className="space-y-1"
                  aria-labelledby={section.title ? headingId : undefined}
                >
                  {items.map((item) => (
                    <li key={item.to}>
                      <SidebarLink item={item} onNavigate={onNavigate} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div
          className={cn(
            'shrink-0 space-y-3',
            isDrawer ? 'border-t border-slate-200 pt-5 dark:border-slate-800' : 'px-4 pb-4',
          )}
        >
          <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/60">
            <p className="font-medium text-slate-900 dark:text-slate-100">Need help?</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="link break-words">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
          {roleLabel ? (
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Workspace</span>
              <Badge variant="brand">{roleLabel}</Badge>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
