import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  assignProject,
  createProject,
  deleteProject,
  getAdminProject,
  getAdminProjects,
  getDomainProjects,
  getProjectAssignments,
  setProjectStatus,
  unassignProject,
  updateProject,
} from '@/services/projectService';
import { queryKeys } from '@/services/queryKeys';

/**
 * Custom React Query hooks for Project management and Student Allocations.
 * Follows Single Responsibility and Separation of Concerns:
 * keeps server-state synchronization separate from UI presentation.
 */

export function useProjectAssignments(params = {}) {
  const baseKey = queryKeys.admin?.projectAssignments || ['admin', 'project-assignments'];
  return useQuery({
    queryKey: [...baseKey, params],
    queryFn: () => getProjectAssignments(params),
  });
}

export function useAssignProject() {
  const queryClient = useQueryClient();
  const assignmentsKey = queryKeys.admin?.projectAssignments || ['admin', 'project-assignments'];
  return useMutation({
    mutationFn: (data) => assignProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentsKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },
  });
}

export function useUnassignProject() {
  const queryClient = useQueryClient();
  const assignmentsKey = queryKeys.admin?.projectAssignments || ['admin', 'project-assignments'];
  return useMutation({
    mutationFn: (enrollmentId) => unassignProject(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentsKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },
  });
}

export function useAdminProjects(params = {}) {
  const baseKey = queryKeys.admin?.projects || ['admin', 'projects'];
  return useQuery({
    queryKey: [...baseKey, params],
    queryFn: () => getAdminProjects(params),
  });
}

export function useProject(id) {
  const projectKey = queryKeys.admin?.project
    ? queryKeys.admin.project(id)
    : ['admin', 'projects', id];
  return useQuery({
    queryKey: projectKey,
    queryFn: () => getAdminProject(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const baseKey = queryKeys.admin?.projects || ['admin', 'projects'];
  return useMutation({
    mutationFn: (data) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const baseKey = queryKeys.admin?.projects || ['admin', 'projects'];
  return useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: baseKey });
      if (queryKeys.admin?.project) {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.project(variables.id) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
    },
  });
}

export function useSetProjectStatus() {
  const queryClient = useQueryClient();
  const baseKey = queryKeys.admin?.projects || ['admin', 'projects'];
  return useMutation({
    mutationFn: ({ id, status }) => setProjectStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: baseKey });
      if (queryKeys.admin?.project) {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.project(variables.id) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const baseKey = queryKeys.admin?.projects || ['admin', 'projects'];
  return useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
    },
  });
}

export function useDomainProjects(domainId) {
  const domainProjectsKey = queryKeys.catalog?.domainProjects
    ? queryKeys.catalog.domainProjects(domainId)
    : ['catalog', 'domainProjects', domainId];
  return useQuery({
    queryKey: domainProjectsKey,
    queryFn: () => getDomainProjects(domainId),
    enabled: Boolean(domainId),
  });
}

