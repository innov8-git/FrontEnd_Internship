import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui';
import { Bell, CheckCheck } from '@/shared/icons';
import { useAuth } from '@/shared/hooks';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/notificationService';
import { queryKeys } from '@/services/queryKeys';
import { formatRelativeTime } from '@/shared/utils/helpers';
import { cn } from '@/shared/utils/cn';

const POLL_INTERVAL_MS = 30_000;

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.list({ limit: 15 }),
    queryFn: () => getNotifications({ limit: 15 }),
    enabled: Boolean(isAuthenticated),
    refetchInterval: POLL_INTERVAL_MS,
    retry: false,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  if (!isAuthenticated) return null;

  const items = Array.isArray(notificationsQuery.data?.items) ? notificationsQuery.data.items : [];
  const unreadCount = Number(notificationsQuery.data?.unreadCount) || 0;

  const handleItemClick = (item) => {
    if (!item.isRead) {
      markReadMutation.mutate(item._id);
    }
    setOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-elevated dark:border-slate-800 dark:bg-slate-900 z-50"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Notifications
              </span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                  {unreadCount} new
                </span>
              ) : null}
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60',
                    !item.isRead && 'bg-brand-50/40 dark:bg-brand-950/20',
                  )}
                >
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      item.isRead ? 'bg-transparent' : 'bg-brand-600',
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </p>
                    {item.message ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.message}
                      </p>
                    ) : null}
                    <p className="text-[11px] text-slate-400">
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationBell;
