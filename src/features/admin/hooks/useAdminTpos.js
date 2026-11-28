import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTpo,
  deleteTpo,
  getTpoEarnings,
  getTpoReferrals,
  getTpos,
  provisionTpoPortalAccess,
  recordTpoPayout,
  updateTpo,
} from '@/services/adminService';
import { queryKeys } from '@/services/queryKeys';

/** DataTable fetcher for /admin/tpos */
export const fetchAdminTpos = (params) => getTpos(params);

function useInvalidateTpoData() {
  const queryClient = useQueryClient();
  return (tpoId) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tpos }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.audit }),
      ...(tpoId
        ? [queryClient.invalidateQueries({ queryKey: ['admin', 'tpos', tpoId] })]
        : []),
    ]);
}

/** Summary KPI counts & earnings across all TPOs */
export function useTpoSummary() {
  return useQuery({
    queryKey: [...queryKeys.admin.tpos, 'summary'],
    queryFn: () => getTpos({ page: 1, limit: 1 }),
    select: (data) =>
      data?.summary ?? {
        totalTpos: Number(data?.total ?? 0),
        activeTpos: 0,
        inactiveTpos: 0,
        totalReferences: 0,
        totalPaidConversions: 0,
        totalEarnedPaise: 0,
        totalPendingPayoutPaise: 0,
        totalPaidOutPaise: 0,
      },
    staleTime: 15_000,
  });
}

/** Paginated list of students referred by a single TPO */
export function useTpoReferrals(tpoId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.tpoReferrals(tpoId, params),
    queryFn: () => getTpoReferrals(tpoId, params),
    enabled: Boolean(tpoId),
    staleTime: 10_000,
    ...options,
  });
}

/** Paginated earnings ledger + payout history for a single TPO (Admin only) */
export function useTpoEarnings(tpoId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.tpoEarnings(tpoId, params),
    queryFn: () => getTpoEarnings(tpoId, params),
    enabled: Boolean(tpoId),
    staleTime: 10_000,
    ...options,
  });
}

export function useCreateTpo() {
  const invalidate = useInvalidateTpoData();
  return useMutation({
    mutationFn: (payload) => createTpo(payload),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateTpo() {
  const invalidate = useInvalidateTpoData();
  return useMutation({
    mutationFn: ({ id, payload }) => updateTpo(id, payload),
    onSuccess: (_, { id }) => invalidate(id),
  });
}

export function useDeleteTpo() {
  const invalidate = useInvalidateTpoData();
  return useMutation({
    mutationFn: (id) => deleteTpo(id),
    onSuccess: (_, id) => invalidate(id),
  });
}

export function useProvisionTpoPortalAccess() {
  const invalidate = useInvalidateTpoData();
  return useMutation({
    mutationFn: ({ id, payload }) => provisionTpoPortalAccess(id, payload),
    onSuccess: (_, { id }) => invalidate(id),
  });
}

export function useRecordTpoPayout() {
  const invalidate = useInvalidateTpoData();
  return useMutation({
    mutationFn: ({ id, payload }) => recordTpoPayout(id, payload),
    onSuccess: (_, { id }) => invalidate(id),
  });
}
