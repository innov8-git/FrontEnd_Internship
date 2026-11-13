import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAssessment } from '@/services/assessmentService';
import { queryKeys } from '@/services/queryKeys';

/**
 * Submits the answers once: mutate(answers) with answers = [{ questionId, selectedIndex }]
 * or mutate({ answers, domainId }).
 * The server scores the attempt; the resolved value is the Attempt.
 * On success the attempt is cached and every assessment query except the (now stale) question
 * set is invalidated, so the open question screen is not refetched into a 409.
 */
export function useSubmitAssessment(designationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => submitAssessment(designationId, payload),
    onSuccess: (attempt) => {
      queryClient.setQueryData(queryKeys.assessment.attempt(designationId), attempt);
      queryClient.invalidateQueries({
        queryKey: queryKeys.assessment.all,
        predicate: (query) => query.queryKey[1] !== 'questions',
      });
    },
  });
}

export default useSubmitAssessment;
