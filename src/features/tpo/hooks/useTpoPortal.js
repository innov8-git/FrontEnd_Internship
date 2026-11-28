import { useQuery } from '@tanstack/react-query';
import {
  getMyTpoPayouts,
  getMyTpoReferrals,
  getMyTpoSummary,
} from '@/services/tpoService';
import { queryKeys } from '@/services/queryKeys';

export function useMyTpoSummary(tpoId = null, options = {}) {
  const params = tpoId ? { tpoId } : {};
  return useQuery({
    queryKey: queryKeys.tpo.summary(tpoId || 'me'),
    queryFn: () => getMyTpoSummary(params),
    staleTime: 15_000,
    ...options,
  });
}

export function useMyTpoReferrals(params = {}, tpoId = null, options = {}) {
  const queryParams = tpoId ? { ...params, tpoId } : params;
  return useQuery({
    queryKey: queryKeys.tpo.referrals(tpoId || 'me', params),
    queryFn: () => getMyTpoReferrals(queryParams),
    staleTime: 10_000,
    ...options,
  });
}

export function useMyTpoPayouts(params = {}, tpoId = null, options = {}) {
  const queryParams = tpoId ? { ...params, tpoId } : params;
  return useQuery({
    queryKey: queryKeys.tpo.payouts(tpoId || 'me', params),
    queryFn: () => getMyTpoPayouts(queryParams),
    staleTime: 15_000,
    ...options,
  });
}
