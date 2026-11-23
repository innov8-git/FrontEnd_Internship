import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEnrollment } from '@/services/applicationService';
import { queryKeys } from '@/services/queryKeys';
import {
  ACTIVE_ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS,
  PAYMENT_POLL_INTERVAL_MS,
  PAYMENT_POLL_TIMEOUT_MS,
  PAYMENT_STATUS,
} from '@/shared/constants';
import { isNetworkError } from '@/shared/utils/errors';

/** After this long without an answer the waiting screen says it is taking longer than usual. */
export const PAYMENT_SLOW_AFTER_MS = 15000;

export const PAYMENT_PHASE = Object.freeze({
  MISSING: 'missing', // no enrollment id in the URL
  WAITING: 'waiting', // polling
  SUCCESS: 'success', // enrollment is ACTIVE / IN_PROGRESS / COMPLETED
  FAILED: 'failed', // paymentStatus FAILED or failed URL parameter from gateway return
  UNAVAILABLE: 'unavailable', // enrollment cancelled or suspended
  TIMEOUT: 'timeout', // stopped polling after PAYMENT_POLL_TIMEOUT_MS
  ERROR: 'error', // 4xx while loading the enrollment (not found, no access)
});

/** The final phase an enrollment is in, or null while the payment is still unconfirmed. */
export function settledPhaseOf(enrollment) {
  if (!enrollment) return null;
  if (ACTIVE_ENROLLMENT_STATUSES.includes(enrollment.status)) return PAYMENT_PHASE.SUCCESS;
  if (enrollment.paymentStatus === PAYMENT_STATUS.FAILED) return PAYMENT_PHASE.FAILED;
  if (
    enrollment.status === ENROLLMENT_STATUS.CANCELLED ||
    enrollment.status === ENROLLMENT_STATUS.SUSPENDED
  ) {
    return PAYMENT_PHASE.UNAVAILABLE;
  }
  return null;
}

function isClientError(error) {
  const status = error?.status;
  return Boolean(status) && status >= 400 && status < 500;
}

/**
 * Payment confirmation (SN9, SD8, PAY-18).
 * Polls GET /enrollments/:id every PAYMENT_POLL_INTERVAL_MS until the enrollment is active (success)
 * or its payment FAILED, and stops after PAYMENT_POLL_TIMEOUT_MS.
 *
 * @param {string} enrollmentId
 * @param {{ failed?: boolean, pollTimeoutMs?: number, slowAfterMs?: number }} [options]
 * @returns {{ phase: string, enrollment: object|null, error: Error|null, isSlow: boolean, connectionIssue: boolean, isNetworkError: boolean, isFetching: boolean, restart: Function }}
 */
export function usePaymentStatus(enrollmentId, options = {}) {
  const {
    failed = false,
    pollTimeoutMs = PAYMENT_POLL_TIMEOUT_MS,
    slowAfterMs = PAYMENT_SLOW_AFTER_MS,
  } = options;

  const queryClient = useQueryClient();
  const [isSlow, setIsSlow] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [run, setRun] = useState(0);

  const query = useQuery({
    queryKey: queryKeys.enrollments.detail(enrollmentId),
    queryFn: () => getEnrollment(enrollmentId),
    enabled: Boolean(enrollmentId) && !failed,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    refetchInterval: (current) => {
      if (timedOut) return false;
      if (settledPhaseOf(current.state.data)) return false;
      if (isClientError(current.state.error)) return false;
      return PAYMENT_POLL_INTERVAL_MS;
    },
  });

  // Only trust data fetched after this page mounted (or existing cached data when pre-seeded)
  const enrollment = query.isFetchedAfterMount || query.data ? query.data : undefined;
  const settled = settledPhaseOf(enrollment);

  useEffect(() => {
    if (!enrollmentId || settled || failed) return undefined;
    const slowTimer = setTimeout(() => setIsSlow(true), slowAfterMs);
    const timeoutTimer = setTimeout(() => setTimedOut(true), pollTimeoutMs);
    return () => {
      clearTimeout(slowTimer);
      clearTimeout(timeoutTimer);
    };
  }, [enrollmentId, settled, failed, run, slowAfterMs, pollTimeoutMs]);

  // Once confirmed, refresh everything that depends on enrollments (dashboard, schedule, team).
  const announcedSuccess = useRef(false);
  useEffect(() => {
    if (settled !== PAYMENT_PHASE.SUCCESS || announcedSuccess.current) return;
    announcedSuccess.current = true;
    queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
  }, [settled, queryClient]);

  const { refetch } = query;
  const restart = useCallback(() => {
    setIsSlow(false);
    setTimedOut(false);
    setRun((count) => count + 1);
    refetch();
  }, [refetch]);

  let phase;
  if (failed) phase = PAYMENT_PHASE.FAILED;
  else if (!enrollmentId) phase = PAYMENT_PHASE.MISSING;
  else if (settled) phase = settled;
  else if (query.isError && isClientError(query.error)) phase = PAYMENT_PHASE.ERROR;
  else if (timedOut) phase = PAYMENT_PHASE.TIMEOUT;
  else phase = PAYMENT_PHASE.WAITING;

  return {
    phase,
    enrollment: enrollment ?? null,
    error: query.error,
    isSlow,
    // Network or server trouble while polling: keep trying, but inform the student.
    connectionIssue: query.isError && !isClientError(query.error),
    isNetworkError: isNetworkError(query.error),
    isFetching: query.isFetching,
    restart,
  };
}

export default usePaymentStatus;
