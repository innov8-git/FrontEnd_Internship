import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from '@/shared/components/layout/Navbar';
import { TrainerRegisterPage } from '@/features/auth/pages/TrainerRegisterPage';
import { AcceptTrainerApplicationModal } from '@/features/admin/components/AcceptTrainerApplicationModal';
import { TrainersPage } from '@/features/admin/pages/TrainersPage';
import { AuthContext } from '@/shared/context/AuthContext';
import * as trainerAppService from '@/services/trainerApplicationService';
import * as adminService from '@/services/adminService';

function renderWithProviders(ui, { user = null, route = '/' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const authValue = {
    user,
    isAuthenticated: Boolean(user),
    status: user ? 'authenticated' : 'unauthenticated',
    updateUser: vi.fn(),
    logout: vi.fn(),
    hasRole: (role) => (user?.roles ?? []).includes(role),
    hasAnyRole: (roles) => (roles ?? []).some((r) => (user?.roles ?? []).includes(r)),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe('Register as Trainer Flow', () => {
  it('renders Register as Trainer button beside Log in in Navbar', () => {
    renderWithProviders(<Navbar />);

    const loginLinks = screen.getAllByRole('link', { name: /Log in/i });
    const registerTrainerLinks = screen.getAllByRole('link', { name: /Register as Trainer/i });

    expect(loginLinks[0]).toHaveAttribute('href', '/login');
    expect(registerTrainerLinks[0]).toHaveAttribute('href', '/register/trainer');
  });

  it('validates and submits TrainerRegisterPage with resume file', async () => {
    const submitSpy = vi
      .spyOn(trainerAppService, 'submitTrainerApplication')
      .mockResolvedValueOnce({
        _id: 'app-123456',
        fullName: 'Priya Sharma',
        email: 'priya@example.com',
        domain: 'Full Stack Web Development',
        resumeName: 'priya-cv.pdf',
      });

    const user = userEvent.setup();
    renderWithProviders(<TrainerRegisterPage />);

    // Empty submit triggers validation errors
    await user.click(screen.getByRole('button', { name: /Submit Trainer Application/i }));
    await waitFor(() => {
      expect(screen.getByText(/Enter your full name/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter your email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter your mobile number/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter your LinkedIn profile URL/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter your company or college name/i)).toBeInTheDocument();
      expect(screen.getByText(/Please upload your resume/i)).toBeInTheDocument();
    });

    // Fill all required fields
    await user.type(screen.getByLabelText(/Full Name/i), 'Priya Sharma');
    await user.type(screen.getByLabelText(/Email Address/i), 'priya@example.com');
    await user.type(screen.getByLabelText(/Mobile Number/i), '+91 98765 43210');
    await user.type(
      screen.getByLabelText(/LinkedIn Profile/i),
      'https://linkedin.com/in/priya-sharma',
    );
    await user.type(screen.getByLabelText(/Company \/ College Name/i), 'Infosys');

    const resumeFile = new File(['%PDF-1.4 test'], 'priya-cv.pdf', { type: 'application/pdf' });
    const fileInput = document.getElementById('app-resume');
    fireEvent.change(fileInput, { target: { files: [resumeFile] } });

    expect(screen.getByText('priya-cv.pdf')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Submit Trainer Application/i }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Application Submitted!/i)).toBeInTheDocument();
    });

    submitSpy.mockRestore();
  });

  it('AcceptTrainerApplicationModal lets admin set password and displays credentials after approval', async () => {
    const acceptSpy = vi
      .spyOn(adminService, 'acceptTrainerApplication')
      .mockResolvedValueOnce({
        trainer: { _id: 'tr-1', name: 'Priya Sharma', email: 'priya@example.com' },
        credentials: {
          email: 'priya@example.com',
          password: 'TrainerPass@2026',
          emailSent: true,
        },
      });

    const user = userEvent.setup();
    const application = {
      _id: 'app-1',
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543210',
      organization: 'Infosys',
      domain: 'Full Stack Web Development',
      experience: '5-8 years',
      resumeName: 'priya-cv.pdf',
      bio: 'Senior engineer',
      existingUser: null,
    };

    renderWithProviders(
      <AcceptTrainerApplicationModal application={application} open={true} onClose={vi.fn()} />,
    );

    const passwordInput = screen.getByLabelText(/Trainer Login Password/i);
    await user.clear(passwordInput);
    await user.type(passwordInput, 'TrainerPass@2026');

    await user.click(screen.getByRole('button', { name: /Accept & Create Credentials/i }));

    await waitFor(() => {
      expect(acceptSpy).toHaveBeenCalledWith(
        'app-1',
        expect.objectContaining({
          password: 'TrainerPass@2026',
          sendEmail: true,
          upgradeExistingUser: false,
        }),
      );
      expect(screen.getByText(/Trainer Approved & Credentials Ready/i)).toBeInTheDocument();
      expect(screen.getByText('TrainerPass@2026')).toBeInTheDocument();
    });

    acceptSpy.mockRestore();
  });

  it('TrainersPage allows admin to remove/delete a trainer via confirmation dialog', async () => {
    const getTrainersSpy = vi.spyOn(adminService, 'getTrainers').mockResolvedValue({
      items: [
        {
          _id: 'tr-99',
          name: 'Raj Mentor',
          email: 'raj@example.com',
          status: 'ACTIVE',
          isTrainer: true,
          assignedStudentCount: 0,
          assignedGroupCount: 0,
          trainerProfile: { domain: 'Backend', experience: '3-5 years' },
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });
    const getAppsSpy = vi.spyOn(adminService, 'getTrainerApplications').mockResolvedValue({
      items: [],
      total: 0,
      pendingCount: 0,
      page: 1,
      limit: 1,
    });
    const deleteTrainerSpy = vi.spyOn(adminService, 'deleteTrainer').mockResolvedValueOnce({
      _id: 'tr-99',
      deletedAccount: true,
    });

    const user = userEvent.setup();
    renderWithProviders(<TrainersPage />, {
      user: { _id: 'admin-1', name: 'Admin', roles: ['ADMIN'] },
      route: '/admin/trainers',
    });

    await waitFor(() => {
      expect(screen.getByText('Raj Mentor')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Actions for Raj Mentor/i }));
    await user.click(await screen.findByText(/Remove \/ Delete trainer/i));

    expect(
      await screen.findByText(/Remove \/ Delete trainer Raj Mentor\?/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Remove Trainer/i }));

    await waitFor(() => {
      expect(deleteTrainerSpy).toHaveBeenCalledWith('tr-99');
    });

    getTrainersSpy.mockRestore();
    getAppsSpy.mockRestore();
    deleteTrainerSpy.mockRestore();
  });
});
