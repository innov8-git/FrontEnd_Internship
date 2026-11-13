import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDomainQuestion,
  deleteDomainQuestion,
  getDomainQuestions,
  updateDomainQuestion,
} from '@/services/adminCatalogService';
import { queryKeys } from '@/services/queryKeys';

/**
 * Hook to fetch paginated/searchable questions for a domain.
 */
export function useDomainQuestions(domainId, params = {}) {
  return useQuery({
    queryKey: queryKeys.admin.domainQuestions(domainId, params),
    queryFn: () => getDomainQuestions(domainId, params),
    enabled: Boolean(domainId),
    placeholderData: (prev) => prev,
  });
}

/**
 * Mutation to add a manual question to a domain's question bank (up to 100 max).
 */
export function useCreateDomainQuestion(domainId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createDomainQuestion(domainId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'domains', domainId, 'questions'],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.domains,
      });
    },
  });
}

/**
 * Mutation to update an existing domain question.
 */
export function useUpdateDomainQuestion(domainId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, data }) => updateDomainQuestion(domainId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'domains', domainId, 'questions'],
      });
    },
  });
}

/**
 * Mutation to delete a question from a domain.
 */
export function useDeleteDomainQuestion(domainId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId) => deleteDomainQuestion(domainId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'domains', domainId, 'questions'],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.domains,
      });
    },
  });
}

