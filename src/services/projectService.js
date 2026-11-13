import { api, orNullOn404 } from './api';

/**
 * Production-ready API service for Project Management under Domains.
 * Adheres to Single Responsibility Principle (SRP) by handling network calls to /admin/projects
 * and /domains/:id/projects endpoints.
 */

/**
 * GET /admin/projects?domainId=&designationId=&status=&search=&page=&limit=
 */
export const getAdminProjects = (params = {}) =>
  api.get('/admin/projects', params);

/**
 * GET /admin/projects/:id
 */
export const getAdminProject = (id) =>
  orNullOn404(api.get(`/admin/projects/${encodeURIComponent(id)}`));

/**
 * POST /admin/projects
 */
export const createProject = (data) =>
  api.post('/admin/projects', data);

/**
 * PUT /admin/projects/:id
 */
export const updateProject = (id, data) =>
  api.put(`/admin/projects/${encodeURIComponent(id)}`, data);

/**
 * PATCH /admin/projects/:id/status
 */
export const setProjectStatus = (id, status) =>
  api.patch(`/admin/projects/${encodeURIComponent(id)}/status`, { status });

/**
 * DELETE /admin/projects/:id
 */
export const deleteProject = (id) =>
  api.delete(`/admin/projects/${encodeURIComponent(id)}`);

/**
 * GET /domains/:domainId/projects
 * Public / Student endpoint: fetches published projects under a domain for allocation & spotlight.
 */
export const getDomainProjects = (domainId) =>
  api.get(`/domains/${encodeURIComponent(domainId)}/projects`);

/**
 * GET /admin/project-assignments?domainId=&track=&status=&search=&page=&limit=
 * Admin endpoint: lists student enrollments with their domain, track, and assigned project.
 */
export const getProjectAssignments = (params = {}) =>
  api.get('/admin/project-assignments', params);

/**
 * POST /admin/project-assignments
 * Admin endpoint: assigns a domain capstone project to a student's enrollment.
 */
export const assignProject = (data) =>
  api.post('/admin/project-assignments', data);

/**
 * DELETE /admin/project-assignments/:enrollmentId
 * Admin endpoint: unassigns a project from a student's enrollment.
 */
export const unassignProject = (enrollmentId) =>
  api.delete(`/admin/project-assignments/${encodeURIComponent(enrollmentId)}`);


