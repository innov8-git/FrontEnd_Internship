import { useQuery } from '@tanstack/react-query';
import { getAdminTrainerReports } from '@/services/adminService';
import { getTrainerAssignments } from '@/services/trainerService';
import { queryKeys } from '@/services/queryKeys';
import { toItems } from '../utils/reviewHelpers';

/**
 * The students and teams assigned to the signed-in trainer (KD9, KD13). `data` is an array of
 * { _id, type, enrollmentId, teamId, student, team, plan, approvedTasks, totalTasks,
 *   pendingSubmissions, lastActivityAt }.
 */
export function useTrainerAssignments(options = {}) {
  return useQuery({
    queryKey: queryKeys.trainer.assignments,
    queryFn: () => getTrainerAssignments(),
    select: toItems,
    ...options,
  });
}

/** Admin view of one trainer's assignments and progress report (`GET /admin/trainers/:id/reports`). */
export function useAdminTrainerReports(trainerId) {
  const query = useQuery({
    queryKey: queryKeys.admin.trainerReports(trainerId),
    queryFn: () => getAdminTrainerReports(trainerId),
    select: (res) => ({ items: toItems(res), trainer: res?.trainer || null }),
    enabled: Boolean(trainerId),
  });

  return {
    ...query,
    data: query.data?.items,
    trainer: query.data?.trainer ?? null,
  };
}

export default useTrainerAssignments;
