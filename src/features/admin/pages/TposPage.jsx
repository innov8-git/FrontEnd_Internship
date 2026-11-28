import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  ConfirmDialog,
  CopyButton,
  DataTable,
  DropdownMenu,
  PageHeader,
  StatCard,
  Switch,
  Tooltip,
  toast,
} from '@/shared/components/ui';
import {
  Building2,
  CheckCircle2,
  Eye,
  GraduationCap,
  IndianRupee,
  Link2Icon,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  School,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
  Wallet,
} from '@/shared/icons';
import { PAGE_SIZE_OPTIONS, paths } from '@/shared/constants';
import { queryKeys } from '@/services/queryKeys';
import { useDocumentTitle } from '@/shared/hooks';
import { copyToClipboard, formatDate, formatMoney } from '@/shared/utils/helpers';
import { ClearFiltersButton } from '../components/ClearFiltersButton';
import { CreateTpoModal } from '../components/CreateTpoModal';
import { EditTpoModal } from '../components/EditTpoModal';
import { FilterSelect } from '../components/FilterSelect';
import { TpoReferralsDrawer } from '../components/TpoReferralsDrawer';
import {
  fetchAdminTpos,
  useDeleteTpo,
  useTpoSummary,
  useUpdateTpo,
} from '../hooks/useAdminTpos';
import { useUrlFilters } from '../hooks/useUrlFilters';
import {
  buildTpoRegistrationLink,
  buildWhatsAppShareUrl,
  formatTpoCommission,
} from '../utils/tpoShare';

const FILTER_KEYS = ['status'];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active Codes' },
  { value: 'inactive', label: 'Inactive Codes' },
];

export function TposPage() {
  useDocumentTitle('TPOs');

  const navigate = useNavigate();
  const { values, setValue, clear, activeCount } = useUrlFilters(FILTER_KEYS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [drawerTarget, setDrawerTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const summaryQuery = useTpoSummary();
  const updateTpoMutation = useUpdateTpo();
  const deleteTpoMutation = useDeleteTpo();

  const filters = useMemo(
    () => ({
      status: values.status,
    }),
    [values.status],
  );

  const handleToggleStatus = async () => {
    if (!statusTarget) return;
    const nextActive = !statusTarget.isActive;
    try {
      await updateTpoMutation.mutateAsync({
        id: statusTarget._id,
        payload: { isActive: nextActive },
      });
      toast.success(
        nextActive
          ? `Reference code ${statusTarget.referralCode} is now active.`
          : `Reference code ${statusTarget.referralCode} has been deactivated. Historical referrals remain intact.`,
      );
      setStatusTarget(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to update TPO status.');
    }
  };

  const handleDeleteTpo = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTpoMutation.mutateAsync(deleteTarget._id);
      toast.success(`Removed TPO ${deleteTarget.name}.`);
      if (drawerTarget?._id === deleteTarget._id) setDrawerTarget(null);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to delete TPO.');
    }
  };

  const handleCopyRegistrationLink = async (tpo) => {
    const link = buildTpoRegistrationLink(tpo.referralCode);
    const ok = await copyToClipboard(link);
    if (ok) toast.success(`Registration link copied for ${tpo.name}.`);
    else toast.error('Could not copy link. Please copy it manually.');
  };

  const handleCopyCode = async (tpo) => {
    const ok = await copyToClipboard(tpo.referralCode);
    if (ok) toast.success(`Copied ${tpo.referralCode} to clipboard.`);
    else toast.error('Could not copy code. Please copy it manually.');
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'TPO',
        sortable: true,
        headerClassName: 'min-w-[200px]',
        className: 'min-w-[200px]',
        cell: (tpo) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {tpo.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
              <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{tpo.email}</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
              <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{tpo.phone}</span>
            </p>
          </div>
        ),
      },
      {
        key: 'college',
        header: 'College / Rate',
        sortable: true,
        headerClassName: 'min-w-[180px]',
        className: 'min-w-[180px]',
        cell: (tpo) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="max-w-[200px] truncate" title={tpo.college}>
                {tpo.college}
              </span>
            </div>
            <p className="text-xs font-medium text-brand-700 dark:text-brand-300">
              {formatTpoCommission(tpo.commissionType, tpo.commissionValue)}
            </p>
          </div>
        ),
      },
      {
        key: 'referralCode',
        header: 'Reference Code',
        headerClassName: 'min-w-[215px]',
        className: 'min-w-[215px]',
        cell: (tpo) => (
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="inline-flex items-center rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-brand-700 ring-1 ring-brand-200/70 dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-800/60">
              {tpo.referralCode}
            </span>
            <CopyButton
              value={tpo.referralCode}
              label={`Copy code ${tpo.referralCode}`}
              iconOnly
              variant="ghost"
              size="sm"
              onCopy={() => toast.success(`Copied ${tpo.referralCode}.`)}
            />
            <Tooltip content="Share to TPO via WhatsApp">
              <a
                href={buildWhatsAppShareUrl(tpo)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share ${tpo.referralCode} to ${tpo.name} on WhatsApp`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
            </Tooltip>
          </div>
        ),
      },
      {
        key: 'totalReferences',
        header: 'Referrals',
        sortable: true,
        headerClassName: 'min-w-[145px]',
        className: 'min-w-[145px]',
        cell: (tpo) => {
          const verified = tpo.totalReferences ?? 0;
          const paid = tpo.paidConversions ?? 0;
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setDrawerTarget(tpo)}
                className="inline-flex items-center transition-transform hover:scale-105 focus-visible:outline-none"
                title="View referred students & earnings"
              >
                <Badge variant={verified > 0 ? 'info' : 'neutral'}>
                  <GraduationCap className="mr-1 h-3 w-3" />
                  {verified} {verified === 1 ? 'Student' : 'Students'}
                </Badge>
              </button>
              <p className="mt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                {paid} paid conversion{paid === 1 ? '' : 's'}
              </p>
            </div>
          );
        },
      },
      {
        key: 'totalEarnedPaise',
        header: 'Earnings',
        sortable: true,
        headerClassName: 'min-w-[140px]',
        className: 'min-w-[140px]',
        cell: (tpo) => {
          const earned = tpo.totalEarnedPaise ?? 0;
          const pending = tpo.pendingPayoutPaise ?? 0;
          return (
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatMoney(earned)}
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                {pending > 0 ? `${formatMoney(pending)} pending` : 'Settled'}
              </p>
            </div>
          );
        },
      },
      {
        key: 'isActive',
        header: 'Status',
        cell: (tpo) => (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              size="sm"
              checked={Boolean(tpo.isActive)}
              onChange={() => setStatusTarget(tpo)}
              aria-label={`Toggle reference code status for ${tpo.name}`}
            />
            {tpo.isActive ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                Inactive
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'createdAt',
        header: 'Created',
        sortable: true,
        cell: (tpo) => (
          <span className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
            {formatDate(tpo.createdAt)}
          </span>
        ),
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        cell: (tpo) => (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu
              align="end"
              label={tpo.name}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  leftIcon={MoreHorizontal}
                  aria-label={`Actions for ${tpo.name}`}
                />
              }
              items={[
                {
                  label: 'View referrals & payouts',
                  icon: Users,
                  onClick: () => setDrawerTarget(tpo),
                },
                {
                  label: 'Preview private TPO view',
                  icon: Eye,
                  onClick: () => navigate(paths.tpoPortal(tpo._id)),
                },
                {
                  label: 'Share code via WhatsApp',
                  icon: MessageCircle,
                  onClick: () => {
                    window.open(buildWhatsAppShareUrl(tpo), '_blank', 'noopener,noreferrer');
                  },
                },
                {
                  label: 'Copy reference code',
                  icon: CheckCircle2,
                  onClick: () => handleCopyCode(tpo),
                },
                {
                  label: 'Copy registration link',
                  icon: Link2Icon,
                  onClick: () => handleCopyRegistrationLink(tpo),
                },
                { divider: true },
                {
                  label: 'Edit TPO & commission',
                  icon: Pencil,
                  onClick: () => setEditTarget(tpo),
                },
                {
                  label: tpo.isActive ? 'Deactivate code' : 'Activate code',
                  icon: tpo.isActive ? ShieldAlert : ShieldCheck,
                  danger: Boolean(tpo.isActive),
                  onClick: () => setStatusTarget(tpo),
                },
                {
                  label: 'Delete TPO',
                  icon: Trash2,
                  danger: true,
                  onClick: () => setDeleteTarget(tpo),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [navigate],
  );

  const summary = summaryQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="TPOs"
        description="Manage Training & Placement Officer reference codes, private portal credentials, referral counts, earnings, and payouts."
        actions={
          <Button leftIcon={Plus} onClick={() => setIsCreateOpen(true)}>
            Add TPO &amp; Generate Code
          </Button>
        }
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total TPOs"
          value={summary ? String(summary.totalTpos) : '—'}
          hint={summary ? `${summary.activeTpos} active · ${summary.inactiveTpos} inactive` : undefined}
          icon={School}
          tone="brand"
          loading={summaryQuery.isPending}
        />
        <StatCard
          label="Referred / Paid"
          value={
            summary
              ? `${summary.totalReferences} / ${summary.totalPaidConversions ?? 0}`
              : '—'
          }
          hint="Verified signups / Paid conversions"
          icon={GraduationCap}
          tone="success"
          loading={summaryQuery.isPending}
        />
        <StatCard
          label="Total TPO Earnings"
          value={summary ? formatMoney(summary.totalEarnedPaise ?? 0) : '—'}
          hint="Cumulative earned across all TPOs"
          icon={IndianRupee}
          tone="brand"
          loading={summaryQuery.isPending}
        />
        <StatCard
          label="Pending Payouts"
          value={summary ? formatMoney(summary.totalPendingPayoutPaise ?? 0) : '—'}
          hint={
            summary
              ? `Paid out: ${formatMoney(summary.totalPaidOutPaise ?? 0)}`
              : undefined
          }
          icon={Wallet}
          tone="warning"
          loading={summaryQuery.isPending}
        />
      </div>

      <DataTable
        fetcher={fetchAdminTpos}
        queryKey={queryKeys.admin.tpos}
        filters={filters}
        columns={columns}
        initialSort={{ key: 'createdAt', direction: 'desc' }}
        searchPlaceholder="Search by TPO name, college, email, phone, or code…"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        caption="TPO referral codes and earnings"
        onRowClick={(tpo) => setDrawerTarget(tpo)}
        rowClassName={(tpo) =>
          drawerTarget && tpo._id === drawerTarget._id
            ? 'bg-brand-50/60 dark:bg-brand-950/30'
            : undefined
        }
        toolbar={
          <>
            <FilterSelect
              label="Code Status"
              allLabel="All statuses"
              value={values.status}
              onChange={(value) => setValue('status', value)}
              options={STATUS_OPTIONS}
              className="sm:w-44"
            />
            <ClearFiltersButton
              count={activeCount}
              onClear={() => {
                if (activeCount > 0) clear();
              }}
            />
          </>
        }
        emptyState={{
          icon: School,
          title: 'No TPOs added yet',
          description:
            'Click "Add TPO & Generate Code" to create a unique reference code, configure commission, and start tracking referrals.',
        }}
      />

      <CreateTpoModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <EditTpoModal
        tpo={editTarget}
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
      />

      <TpoReferralsDrawer
        tpo={drawerTarget}
        open={Boolean(drawerTarget)}
        onClose={() => setDrawerTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleToggleStatus}
        loading={updateTpoMutation.isPending}
        title={
          statusTarget?.isActive
            ? `Deactivate code ${statusTarget?.referralCode}?`
            : `Reactivate code ${statusTarget?.referralCode}?`
        }
        message={
          statusTarget?.isActive
            ? `New students will no longer be able to apply ${statusTarget?.referralCode}. All ${statusTarget?.totalReferences ?? 0} existing referrals and earnings remain intact.`
            : `Students will be able to use ${statusTarget?.referralCode} during checkout again.`
        }
        confirmLabel={statusTarget?.isActive ? 'Deactivate Code' : 'Activate Code'}
        variant={statusTarget?.isActive ? 'danger' : 'primary'}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTpo}
        loading={deleteTpoMutation.isPending}
        title={`Delete TPO ${deleteTarget?.name}?`}
        message={
          (deleteTarget?.totalEarnedPaise ?? 0) > 0
            ? `This TPO has recorded referral earnings (${formatMoney(deleteTarget.totalEarnedPaise)}) and cannot be hard-deleted. Deactivate their code and disable portal access instead.`
            : deleteTarget?.totalReferences > 0
              ? `This TPO has ${deleteTarget.totalReferences} verified referred student(s). Consider deactivating the code instead to preserve reporting.`
              : 'This will permanently remove the TPO record and suspend their private portal login. This action is recorded in the audit log.'
        }
        confirmLabel="Delete TPO"
        variant="danger"
      />
    </div>
  );
}

export default TposPage;
