import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '@/shared/context/AuthContext';
import AssignmentsPage from '@/features/assignments/pages/AssignmentsPage';
import TrainersPage from '@/features/admin/pages/TrainersPage';
import TrainerReportsPage from '@/features/trainer/pages/TrainerReportsPage';
import * as adminAssignmentService from '@/services/adminAssignmentService';
import * as adminService from '@/services/adminService';

function renderAdminFlow(initialEntry = '/admin/assignments') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const adminUser = {
    _id: 'admin-1',
    name: 'Admin User',
    email: 'admin@alfre.com',
    roles: ['ADMIN'],
    status: 'ACTIVE',
  };
  const authValue = {
    user: adminUser,
    isAuthenticated: true,
    status: 'authenticated',
    hasRole: (role) => role === 'ADMIN',
    hasAnyRole: (roles) => roles.includes('ADMIN'),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/admin/assignments" element={<AssignmentsPage />} />
            <Route path="/admin/trainers" element={<TrainersPage />} />
            <Route path="/admin/trainers/:trainerId/reports" element={<TrainerReportsPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe('Admin trainer assignments -> trainer reports navigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('redirects admin to the clicked trainer reports page from Trainer assignments', async () => {
    const user = userEvent.setup();

    vi.spyOn(adminAssignmentService, 'getAdminAssignmentsSummary').mockResolvedValue({
      totalTrainers: 4,
      assignedTrainers: 3,
      activeAssignments: 5,
      totalTasks: 24,
      approvedTasks: 12,
      totalSubmissions: 19,
      reviewedTasks: 15,
      pendingTasks: 4,
    });

    vi.spyOn(adminAssignmentService, 'getAdminAssignments').mockResolvedValue({
      items: [
        {
          _id: 'assign-1',
          trainerId: 'trainer-gayatri',
          trainer: {
            _id: 'trainer-gayatri',
            name: 'Gayatri Patil',
            email: 'gayupatil2108@gmail.com',
          },
          targetType: 'INDIVIDUAL',
          enrollment: {
            _id: 'enr-1',
            student: { _id: 'stu-1', name: 'Kedar Deshmukh', email: 'kedar@example.com' },
            plan: {
              designation: { name: 'Java Developer' },
              domain: { name: 'Banking' },
              durationMonths: 3,
            },
          },
          active: true,
          assignedAt: '2026-11-26T09:00:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });

    const reportsSpy = vi.spyOn(adminService, 'getAdminTrainerReports').mockResolvedValue({
      trainer: {
        _id: 'trainer-gayatri',
        name: 'Gayatri Patil',
        email: 'gayupatil2108@gmail.com',
      },
      items: [
        {
          _id: 'assign-1',
          type: 'INDIVIDUAL',
          student: { _id: 'stu-1', name: 'Kedar Deshmukh', email: 'kedar@example.com' },
          plan: {
            designation: { name: 'Java Developer' },
            domain: { name: 'Banking' },
            durationMonths: 3,
          },
          approvedTasks: 1,
          totalTasks: 4,
          pendingSubmissions: 2,
          lastActivityAt: '2026-11-26T08:00:00.000Z',
        },
      ],
      total: 1,
    });

    renderAdminFlow('/admin/assignments');

    expect(await screen.findByText('24')).toBeInTheDocument();
    expect(screen.getByText('Total trainers')).toBeInTheDocument();
    expect(screen.getByText('Overall trainer tasks')).toBeInTheDocument();
    expect(screen.getByText('Overall reviewed tasks')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Overall pending tasks')).toBeInTheDocument();

    const trainerLink = await screen.findByRole('link', { name: /Gayatri Patil/i });
    expect(trainerLink).toHaveAttribute('href', '/admin/trainers/trainer-gayatri/reports');

    await user.click(trainerLink);

    await waitFor(() => {
      expect(reportsSpy).toHaveBeenCalledWith('trainer-gayatri');
    });

    expect(
      await screen.findByRole('heading', { name: /Gayatri Patil — Reports/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Assigned to trainer')).toBeInTheDocument();
    expect(screen.getByText('Kedar Deshmukh')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to assignments/i })).toHaveAttribute(
      'href',
      '/admin/assignments',
    );
  });

  it('shows summary KPIs, Assign trainer button beside Create Trainer, and trainer reports link on TrainersPage', async () => {
    const user = userEvent.setup();

    vi.spyOn(adminAssignmentService, 'getAdminAssignmentsSummary').mockResolvedValue({
      totalTrainers: 4,
      assignedTrainers: 3,
      activeAssignments: 5,
      totalTasks: 12,
      approvedTasks: 6,
      totalSubmissions: 9,
      reviewedTasks: 7,
      pendingTasks: 2,
    });

    const enrollmentsSpy = vi.spyOn(adminService, 'getAdminEnrollments').mockResolvedValue({
      items: [
        {
          _id: 'enr-unassigned-1',
          enrollmentType: 'INDIVIDUAL',
          status: 'ACTIVE',
          hasTrainer: false,
          student: { _id: 'stu-unassigned', name: 'Rohan Unassigned', email: 'rohan@example.com' },
          plan: { designation: { name: 'Java Developer' }, domain: { name: 'Banking' }, durationMonths: 2 },
        },
        {
          _id: 'enr-already-assigned',
          enrollmentType: 'INDIVIDUAL',
          status: 'ACTIVE',
          hasTrainer: true,
          student: { _id: 'stu-assigned', name: 'Kedar Assigned', email: 'kedar@example.com' },
          plan: { designation: { name: 'Java Developer' }, domain: { name: 'Banking' }, durationMonths: 3 },
        },
      ],
      total: 2,
      page: 1,
      limit: 50,
    });

    vi.spyOn(adminService, 'getTrainers').mockResolvedValue({
      items: [
        {
          _id: 'trainer-gayatri',
          name: 'Gayatri Patil',
          email: 'gayupatil2108@gmail.com',
          status: 'ACTIVE',
          isTrainer: true,
          assignedStudentCount: 3,
          assignedGroupCount: 0,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });

    vi.spyOn(adminService, 'getTrainerApplications').mockResolvedValue({
      items: [],
      total: 0,
      pendingCount: 0,
      page: 1,
      limit: 1,
    });

    const reportsSpy = vi.spyOn(adminService, 'getAdminTrainerReports').mockResolvedValue({
      trainer: {
        _id: 'trainer-gayatri',
        name: 'Gayatri Patil',
        email: 'gayupatil2108@gmail.com',
      },
      items: [],
      total: 0,
    });

    renderAdminFlow('/admin/trainers');

    expect(await screen.findByText('12')).toBeInTheDocument();
    expect(screen.getByText('Total trainers')).toBeInTheDocument();
    expect(screen.getByText('Overall trainer tasks')).toBeInTheDocument();
    expect(screen.getByText('Overall reviewed tasks')).toBeInTheDocument();
    expect(screen.getByText('Overall pending tasks')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Assign trainer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Trainer/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Trainer Assignments/i })).toBeInTheDocument();

    // Open Assign trainer flow from TrainersPage and confirm only unassigned enrolled students appear
    await user.click(screen.getByRole('button', { name: /Assign trainer/i }));
    expect(await screen.findByRole('heading', { name: /Assign a trainer/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(enrollmentsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ACTIVE,IN_PROGRESS',
          enrollmentType: 'INDIVIDUAL',
          unassigned: 'true',
        }),
      );
    });
    expect(await screen.findByText('Rohan Unassigned')).toBeInTheDocument();
    expect(screen.queryByText('Kedar Assigned')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Cancel/i }));

    const trainerLink = await screen.findByRole('link', { name: /Gayatri Patil/i });
    expect(trainerLink).toHaveAttribute('href', '/admin/trainers/trainer-gayatri/reports');

    await user.click(trainerLink);

    await waitFor(() => {
      expect(reportsSpy).toHaveBeenCalledWith('trainer-gayatri');
    });

    expect(
      await screen.findByRole('heading', { name: /Gayatri Patil — Reports/i }),
    ).toBeInTheDocument();
  });
});

