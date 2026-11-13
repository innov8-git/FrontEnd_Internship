import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTrainers,
  updateTrainerStatus,
  assignToTrainer,
  removeTrainerAssignment,
} from '@/services/adminService';
import { queryKeys } from '@/services/queryKeys';

/** DataTable fetcher for /admin/trainers */
export const fetchAdminTrainers = (params) => getTrainers(params);

function useInvalidateTrainerData() {
  const queryClient = useQueryClient();
  return (trainerId) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.trainers }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.assignments }),
      ...(trainerId ? [queryClient.invalidateQueries({ queryKey: queryKeys.admin.trainerAssignments(trainerId) })] : []),
    ]);
}

/** Toggle trainer privilege (assign or unassign user as trainer) */
export function useToggleTrainerPrivilege() {
  const invalidate = useInvalidateTrainerData();
  return useMutation({
    mutationFn: ({ id, isTrainer }) => updateTrainerStatus(id, { isTrainer }),
    onSuccess: (_, { id }) => invalidate(id),
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

