import { useState } from 'react';
import { ConfirmDialog, Input, toast } from '@/shared/components/ui';
import { Users } from '@/shared/icons';
import { getErrorMessage } from '@/shared/utils/errors';
import { useDeleteUser } from '../hooks/useAdminUsers';

/**
 * Permanent user deletion dialog.
 * - Shows a clear warning banner when the target user belongs to a team.
 * - Requires typing both the user's name and email to unlock permanent deletion.
 */
export function DeleteUserDialog({ user, onClose }) {
  const mutation = useDeleteUser();

  // Keep showing the last user while the modal animates closed, and reset inputs when switching user.
  const [shown, setShown] = useState(user);
  const [typedName, setTypedName] = useState('');
  const [typedEmail, setTypedEmail] = useState('');

  if (user && user !== shown) {
    setShown(user);
    setTypedName('');
    setTypedEmail('');
  }

  const expectedName = String(shown?.name ?? '').trim();
  const expectedEmail = String(shown?.email ?? '').trim();
  const displayName = expectedName || expectedEmail || 'this user';

  const teams = Array.isArray(shown?.teams) ? shown.teams : [];
  const isTeamMember = Boolean(shown?.isTeamMember || teams.length > 0);
  const isTeamLeader = Boolean(shown?.isTeamLeader || teams.some((t) => t.isLeader));
  const teamNames = teams.map((t) => t.name).filter(Boolean);

  const nameMatches =
    !expectedName || typedName.trim().toLowerCase() === expectedName.toLowerCase();
  const emailMatches =
    Boolean(expectedEmail) && typedEmail.trim().toLowerCase() === expectedEmail.toLowerCase();
  const canConfirm = nameMatches && emailMatches && !mutation.isPending;

  const handleClose = () => {
    if (mutation.isPending) return;
    setTypedName('');
    setTypedEmail('');
    onClose?.();
  };

  const handleConfirm = async () => {
    if (!user?._id || !canConfirm) return;
    try {
      await mutation.mutateAsync(user._id);
      toast.success(`${displayName} was permanently deleted`, {
        description: isTeamMember
          ? 'This team member and all their associated database records have been removed.'
          : 'Their account and all associated database records have been removed.',
      });
      setTypedName('');
      setTypedEmail('');
      onClose?.();
    } catch (error) {
      toast.error("The user wasn't deleted", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <ConfirmDialog
      open={Boolean(user)}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={`Delete ${displayName}?`}
      message="This will permanently delete the user account and all associated records (enrollments, payments, submissions, certificates, and tokens) from the database. This action cannot be undone."
      confirmLabel="Delete permanently"
      variant="danger"
      loading={mutation.isPending}
      confirmDisabled={!canConfirm}
    >
      <div className="space-y-3.5">
        {isTeamMember ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <div>
              <p className="font-semibold">
                You are deleting a {isTeamLeader ? 'team leader / team member' : 'team member'}.
              </p>
              <p className="mt-0.5 leading-relaxed">
                {teamNames.length > 0
                  ? `${displayName} belongs to ${teamNames.join(', ')}. Removing them will also remove them from their team.`
                  : `${displayName} is currently part of a team. Removing them will also remove them from their team.`}
              </p>
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          <p>
            To confirm permanent deletion, type the user&apos;s{' '}
            {expectedName ? (
              <>
                name <strong className="font-semibold text-slate-900 dark:text-white">{expectedName}</strong> and{' '}
              </>
            ) : null}
            email <strong className="font-mono font-semibold text-slate-900 dark:text-white">{expectedEmail}</strong>{' '}
            below.
          </p>
        </div>

        {expectedName ? (
          <Input
            label="User's full name"
            placeholder={expectedName}
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            autoComplete="off"
            size="sm"
            required
          />
        ) : null}

        <Input
          label="User's email address"
          type="email"
          placeholder={expectedEmail}
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
          autoComplete="off"
          size="sm"
          required
        />
      </div>
    </ConfirmDialog>
  );
}

export default DeleteUserDialog;
