import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTrainers,
  createTrainer,
  updateTrainerStatus,
  deleteTrainer,
  assignToTrainer,
  removeTrainerAssignment,
  getTrainerApplications,
  acceptTrainerApplication,
  deleteTrainerApplication,
} from '@/services/adminService';
import { queryKeys } from '@/services/queryKeys';

/** DataTable fetcher for /admin/trainers */
export const fetchAdminTrainers = (params) => getTrainers(params);

/** DataTable fetcher for /admin/trainer-applications (pending join requests) */
export const fetchTrainerApplications = (params) =>
  getTrainerApplications({ status: 'PENDING', ...params });

function useInvalidateTrainerData() {
  const queryClient = useQueryClient();
  return (trainerId) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.trainers }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.trainerApplications }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.assignments }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.audit }),
      ...(trainerId
        ? [queryClient.invalidateQueries({ queryKey: queryKeys.admin.trainerAssignments(trainerId) })]
        : []),
    ]);
}

/** Live count of pending trainer join requests for tab badge. */
export function usePendingTrainerApplicationsCount() {
  return useQuery({
    queryKey: [...queryKeys.admin.trainerApplications, 'pending-count'],
    queryFn: () => getTrainerApplications({ page: 1, limit: 1, status: 'PENDING' }),
    select: (data) => Number(data?.pendingCount ?? data?.total ?? 0),
    staleTime: 15_000,
  });
}

/** Toggle trainer privilege (assign or unassign user as trainer) */
export function useToggleTrainerPrivilege() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: ({ id, isTrainer }) => updateTrainerStatus(id, { isTrainer }),
    onSuccess: (_, { id }) => invalidate(id),
  });
}

/** Delete or remove a trainer from the platform */
export function useDeleteTrainer() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: (id) => deleteTrainer(id),
    onSuccess: (_, id) => invalidate(id),
  });
}

/** Create a new trainer account with admin-provided or auto-generated credentials */
export function useCreateTrainer() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: (payload) => createTrainer(payload),
    onSuccess: () => invalidate(),
  });
}

/** Accept a pending trainer join request and create/upgrade trainer credentials */
export function useAcceptTrainerApplication() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: ({ id, payload }) => acceptTrainerApplication(id, payload),
    onSuccess: () => invalidate(),
  });
}

/** Permanently delete a trainer join request and its uploaded resume */
export function useDeleteTrainerApplication() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: (id) => deleteTrainerApplication(id),
    onSuccess: () => invalidate(),
  });
}

/** Assign a student enrollment or team group to a trainer */
export function useAssignToTrainer() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: ({ trainerId, enrollmentId, teamId }) =>
      assignToTrainer(trainerId, { enrollmentId, teamId }),
    onSuccess: (_, { trainerId }) => invalidate(trainerId),
  });
}

/** Unassign a student or team assignment from a trainer */
export function useUnassignFromTrainer() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: ({ trainerId, assignmentId }) =>
      removeTrainerAssignment(trainerId, assignmentId),
    onSuccess: (_, { trainerId }) => invalidate(trainerId),
  });
}
