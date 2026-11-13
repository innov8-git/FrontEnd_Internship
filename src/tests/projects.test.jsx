import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectsPage from '@/features/catalog/pages/ProjectsPage';
import ProjectAssignmentsPage from '@/features/catalog/pages/ProjectAssignmentsPage';
import { projectSchema } from '@/features/catalog/schemas/projectValidation';
import { ProjectsTable } from '@/features/catalog/components/ProjectsTable';
import { generateDailyTasksForProject } from '@/features/catalog/utils/projectTaskGenerator';
import * as projectService from '@/services/projectService';
import {
  assignProjectToEnrollment,
  listProjectAssignments,
  unassignProjectFromEnrollment,
} from '@/mocks/services';

describe('Project Validation Schema', () => {
  it('validates a complete valid project payload', () => {
    const validData = {
      title: 'LedgerCore — Banking & Fund Transfer Engine',
      slug: 'ledgercore-banking',
      domainId: 'domain_banking_1',
      designationId: 'desig_java_1',
      starterRepoUrl: 'https://github.com/internship-portal/java-banking-starter',
      technologies: 'Java 17, Spring Boot, PostgreSQL, Docker',
      webTechStack: 'React.js, Next.js, Tailwind CSS',
      appTechStack: 'React Native, Flutter',
      durationsSupported: [1, 2, 3, 6],
      isDefault: true,
      status: 'PUBLISHED',
      description: 'Enterprise retail banking platform handling accounts and fund transfers.',
    };

    const result = projectSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails when title is shorter than 3 characters', () => {
    const invalidData = {
      title: 'AB',
      domainId: 'domain_1',
      designationId: 'desig_1',
      durationsSupported: [1, 2],
    };

    const result = projectSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/at least 3 characters/i);
  });

  it('fails when domain or designation is missing', () => {
    const missingDomain = {
      title: 'Awesome Cloud Project',
      domainId: '',
      designationId: 'desig_1',
      durationsSupported: [1],
    };

    const result = projectSchema.safeParse(missingDomain);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/select a domain/i);
  });

  it('fails when no supported durations are provided', () => {
    const noDurations = {
      title: 'Awesome Cloud Project',
      domainId: 'domain_1',
      designationId: 'desig_1',
      durationsSupported: [],
    };

    const result = projectSchema.safeParse(noDurations);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/at least one supported internship duration/i);
  });
});

describe('Project Service Endpoints', () => {
  it('exports all production-ready API service functions', () => {
    expect(typeof projectService.getAdminProjects).toBe('function');
    expect(typeof projectService.getAdminProject).toBe('function');
    expect(typeof projectService.createProject).toBe('function');
    expect(typeof projectService.updateProject).toBe('function');
    expect(typeof projectService.deleteProject).toBe('function');
    expect(typeof projectService.setProjectStatus).toBe('function');
    expect(typeof projectService.getDomainProjects).toBe('function');
    expect(typeof projectService.getProjectAssignments).toBe('function');
    expect(typeof projectService.assignProject).toBe('function');
    expect(typeof projectService.unassignProject).toBe('function');
  });

  it('contains the seeded demo banking projects for testing admin management and assignments', async () => {
    const { SEED_PROJECTS } = await import('@/mocks/seed/content/projects');
    expect(SEED_PROJECTS.length).toBe(2);
    expect(SEED_PROJECTS[0].slug).toBe('ledgercore-banking');
    expect(SEED_PROJECTS[1].slug).toBe('apexpay-merchant-platform');
  });
});

describe('Projects UI Table Component', () => {
  it('renders projects with titles, domains and duration badges', () => {
    const mockProjects = [
      {
        _id: 'proj_1',
        title: 'LedgerCore Banking',
        slug: 'ledgercore-banking',
        domain: { name: 'Banking' },
        designation: { name: 'Trainee Software Engineer' },
        durationsSupported: [1, 2, 3, 6],
        technologies: ['React.js', 'Next.js'],
        status: 'PUBLISHED',
        isDefault: true,
        updatedAt: '2026-11-13T10:00:00.000Z',
      },
    ];

    render(
      <MemoryRouter>
        <ProjectsTable projects={mockProjects} isLoading={false} />
      </MemoryRouter>,
    );

    expect(screen.getByText('LedgerCore Banking')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Banking')).toBeInTheDocument();
    expect(screen.getByText('Trainee Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('1m')).toBeInTheDocument();
    expect(screen.getByText('6m')).toBeInTheDocument();
  });
});

describe('Project Daily Task Division by Internship Duration & Track', () => {
  const dummyProject = {
    _id: 'proj_bank_1',
    title: 'LedgerCore Banking',
    domain: { name: 'Banking' },
  };

  it('divides Web project tasks into exactly 20 working days for 1 Month duration', () => {
    const tasks = generateDailyTasksForProject(dummyProject, 1, 'web');
    expect(tasks).toHaveLength(20);
    expect(tasks[0].dayNumber).toBe(1);
    expect(tasks[19].dayNumber).toBe(20);
    expect(tasks[0].track).toBe('Web Development');
  });

  it('divides Mobile App project tasks into exactly 20 working days for 1 Month duration', () => {
    const tasks = generateDailyTasksForProject(dummyProject, 1, 'app');
    expect(tasks).toHaveLength(20);
    expect(tasks[0].dayNumber).toBe(1);
    expect(tasks[19].dayNumber).toBe(20);
    expect(tasks[0].track).toBe('Mobile App Development');
  });

  it('divides Web & App tasks into exactly 40 working days for 2 Months duration', () => {
    const webTasks = generateDailyTasksForProject(dummyProject, 2, 'web');
    const appTasks = generateDailyTasksForProject(dummyProject, 2, 'app');
    expect(webTasks).toHaveLength(40);
    expect(appTasks).toHaveLength(40);
    expect(webTasks[39].dayNumber).toBe(40);
    expect(appTasks[39].dayNumber).toBe(40);
  });

  it('divides Web & App tasks into exactly 60 working days for 3 Months duration', () => {
    const webTasks = generateDailyTasksForProject(dummyProject, 3, 'web');
    const appTasks = generateDailyTasksForProject(dummyProject, 3, 'app');
    expect(webTasks).toHaveLength(60);
    expect(appTasks).toHaveLength(60);
    expect(webTasks[59].dayNumber).toBe(60);
    expect(appTasks[59].dayNumber).toBe(60);
  });

  it('divides Web & App tasks into exactly 120 working days for 6 Months duration', () => {
    const webTasks = generateDailyTasksForProject(dummyProject, 6, 'web');
    const appTasks = generateDailyTasksForProject(dummyProject, 6, 'app');
    expect(webTasks).toHaveLength(120);
    expect(appTasks).toHaveLength(120);
    expect(webTasks[119].dayNumber).toBe(120);
    expect(appTasks[119].dayNumber).toBe(120);
  });

  it('renders ProjectsPage without throwing', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument();
  });

  it('renders ProjectAssignmentsPage and shows assignment filters', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProjectAssignmentsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Project Assignments' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search student by name/i)).toBeInTheDocument();
  });

  it('allows admin to navigate to /admin/projects via App', async () => {
    const { createMemoryRouter } = await import('react-router-dom');
    const { default: App } = await import('@/App');
    const { routes, ROUTER_FUTURE } = await import('@/routes/AppRoutes');
    const { DEMO_PASSWORD } = await import('@/mocks/demoAccounts');
    const { default: userEvent } = await import('@testing-library/user-event');
    const { waitFor } = await import('@testing-library/react');

    const router = createMemoryRouter(routes, {
      initialEntries: ['/login'],
      future: ROUTER_FUTURE,
    });
    render(<App router={router} />);

    const user = userEvent.setup();
    const emailField = await screen.findByLabelText(/email/i, {}, { timeout: 5000 });
    await user.clear(emailField);
    await user.type(emailField, 'admin@demo.dev');
    await user.type(screen.getByLabelText(/^password/i), `${DEMO_PASSWORD}{enter}`);
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin'), { timeout: 5000 });

    router.navigate('/admin/projects');
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin/projects'));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 15000);
});

describe('Project Assignment Flow for Demo Students', () => {
  it('lists both 2-month and 6-month Banking web students initially pending allocation', () => {
    const res = listProjectAssignments({ track: 'web' });
    expect(res.items.length).toBeGreaterThanOrEqual(2);

    const aarav = res.items.find((i) => i.student?.email === 'student@demo.dev');
    expect(aarav).toBeDefined();
    expect(aarav.domain?.name).toBe('Banking');
    expect(aarav.durationMonths).toBe(2);
    expect(aarav.workingDays).toBe(40);
    expect(aarav.track).toBe('web');
    expect(aarav.projectId).toBeNull();

    const rohan = res.items.find((i) => i.student?.email === 'student6m@demo.dev');
    expect(rohan).toBeDefined();
    expect(rohan.domain?.name).toBe('Banking');
    expect(rohan.durationMonths).toBe(6);
    expect(rohan.workingDays).toBe(120);
    expect(rohan.track).toBe('web');
    expect(rohan.projectId).toBeNull();
  });

  it('allows admin to create a new project and assign it to students', async () => {
    const { createProjectRecord, findUser } = await import('@/mocks/services');
    const admin = findUser('admin@demo.dev');
    const assignments = listProjectAssignments({});
    const aarav = assignments.items.find((i) => i.student?.email === 'student@demo.dev');
    const rohan = assignments.items.find((i) => i.student?.email === 'student6m@demo.dev');

    // Admin creates project under Banking domain
    const newProject = createProjectRecord(admin, {
      title: 'ApexBank — Next-Gen Retail Banking Platform',
      domainId: aarav.domain._id,
      webTechStack: 'React.js, Tailwind CSS, TypeScript',
      appTechStack: 'React Native, Redux Toolkit',
      webDeliverables: 'Full online customer banking portal',
      appDeliverables: 'Mobile banking app with biometrics',
      durationsSupported: [1, 2, 3, 6],
      status: 'PUBLISHED',
      isDefault: true,
    });

    expect(newProject._id).toBeTruthy();
    expect(newProject.title).toBe('ApexBank — Next-Gen Retail Banking Platform');

    // Admin assigns to Aarav (2 months web)
    const assignedAarav = assignProjectToEnrollment({
      enrollmentId: aarav.enrollmentId,
      projectId: newProject._id,
    });
    expect(assignedAarav.projectId).toBe(newProject._id);
    expect(assignedAarav.project?.title).toBe(newProject.title);

    // Admin assigns to Rohan (6 months web)
    const assignedRohan = assignProjectToEnrollment({
      enrollmentId: rohan.enrollmentId,
      projectId: newProject._id,
    });
    expect(assignedRohan.projectId).toBe(newProject._id);
    expect(assignedRohan.project?.title).toBe(newProject.title);

    // Unassign test
    const unassigned = unassignProjectFromEnrollment(rohan.enrollmentId);
    expect(unassigned.projectId).toBeNull();
  });
});
