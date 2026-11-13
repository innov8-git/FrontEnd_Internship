import { ROLES } from '@/shared/constants';
import {
  assignProjectToEnrollment,
  createProjectRecord,
  deleteProjectRecord,
  findProject,
  listProjectAssignments,
  listProjects,
  projectDto,
  setProjectRecordStatus,
  unassignProjectFromEnrollment,
  updateProjectRecord,
} from '../services';
import {
  created,
  getQuery,
  json,
  mock,
  notFound,
  readJson,
  requireAuth,
} from '../utils';

const ADMIN = [ROLES.ADMIN];

export const projectHandlers = [
  // List project assignments for admin
  mock.get('/admin/project-assignments', ({ request }) => {
    requireAuth(request, ADMIN);
    const query = getQuery(request);
    const result = listProjectAssignments({
      domainId: query.get('domainId') || undefined,
      track: query.get('track') || undefined,
      status: query.get('status') || undefined,
      search: query.get('search') || undefined,
      page: Number(query.get('page') || 1),
      limit: Number(query.get('limit') || 20),
    });
    return json(result);
  }),

  // Assign project to student enrollment
  mock.post('/admin/project-assignments', async ({ request }) => {
    requireAuth(request, ADMIN);
    const body = await readJson(request);
    const result = assignProjectToEnrollment(body);
    return json(result);
  }),

  // Unassign project from student enrollment
  mock.delete('/admin/project-assignments/:enrollmentId', ({ request, params }) => {
    requireAuth(request, ADMIN);
    const result = unassignProjectFromEnrollment(params.enrollmentId);
    return json(result);
  }),

  // List projects for admin
  mock.get('/admin/projects', ({ request }) => {
    requireAuth(request, ADMIN);
    const query = getQuery(request);
    const result = listProjects({
      domainId: query.get('domainId') || undefined,
      designationId: query.get('designationId') || undefined,
      status: query.get('status') || undefined,
      search: query.get('search') || undefined,
      page: Number(query.get('page') || 1),
      limit: Number(query.get('limit') || 50),
    });
    return json(result);
  }),

  // Get project by ID
  mock.get('/admin/projects/:id', ({ request, params }) => {
    requireAuth(request, ADMIN);
    const project = findProject(params.id);
    if (!project) return notFound('Project not found');
    return json(projectDto(project));
  }),

  // Create project
  mock.post('/admin/projects', async ({ request }) => {
    const actor = requireAuth(request, ADMIN);
    const body = await readJson(request);
    const project = createProjectRecord(actor, body);
    return created(project);
  }),

  // Update project
  mock.put('/admin/projects/:id', async ({ request, params }) => {
    const actor = requireAuth(request, ADMIN);
    const body = await readJson(request);
    const updated = updateProjectRecord(params.id, actor, body);
    return json(updated);
  }),

  // Change project status
  mock.patch('/admin/projects/:id/status', async ({ request, params }) => {
    const actor = requireAuth(request, ADMIN);
    const body = await readJson(request);
    const updated = setProjectRecordStatus(params.id, actor, body.status);
    return json(updated);
  }),

  // Delete project
  mock.delete('/admin/projects/:id', ({ request, params }) => {
    requireAuth(request, ADMIN);
    const deleted = deleteProjectRecord(params.id);
    return json(deleted);
  }),

  // Public: Get projects for a domain (student view)
  mock.get('/domains/:domainId/projects', ({ params }) => {
    const list = listProjects({ domainId: params.domainId, status: 'PUBLISHED' });
    return json(list);
  }),
];

export default projectHandlers;

