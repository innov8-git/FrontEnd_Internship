import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateTrainerModal } from '@/features/admin/components/CreateTrainerModal';
import { TrainerProfileCompletionBanner } from '@/features/trainer/components/TrainerProfileCompletionBanner';
import { isTrainerProfileComplete } from '@/features/trainer/utils/profileCompletion';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { AuthContext } from '@/shared/context/AuthContext';
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

describe('Manual Trainer Creation & Onboarding Flow', () => {
  describe('CreateTrainerModal', () => {
    it('renders all required input fields and removes temporary password field', () => {
      renderWithProviders(<CreateTrainerModal open={true} onClose={vi.fn()} />);

      // Modal title and description
      expect(screen.getByText('Create Trainer Account')).toBeInTheDocument();
      expect(
        screen.getByText(/An automated welcome email containing a link to set their password will be dispatched immediately/i)
      ).toBeInTheDocument();

      // Fields that MUST exist
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mentorship Domain/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Experience Level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Short Bio/i)).toBeInTheDocument();

      // Fields that MUST NOT exist (Temporary Password removed per requirements)
      expect(screen.queryByLabelText(/Temporary Password/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Generate/i })).not.toBeInTheDocument();

      // Notice message verifies invitation set-password flow
      expect(
        screen.getByText(/An invitation link will be sent to the trainer's email to set their password/i)
      ).toBeInTheDocument();
    });

    it('validates mandatory fields on empty submission', async () => {
      renderWithProviders(<CreateTrainerModal open={true} onClose={vi.fn()} />);

      const submitBtn = screen.getByRole('button', { name: /Create Trainer/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Full name is required.')).toBeInTheDocument();
        expect(screen.getByText('Email address is required.')).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CreateTrainerModal open={true} onClose={vi.fn()} />);

      await user.type(screen.getByLabelText(/Full Name/i), 'Dr. John Doe');
      await user.type(screen.getByLabelText(/Email Address/i), 'invalid-email-format');

      const submitBtn = screen.getByRole('button', { name: /Create Trainer/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
      });
    });

    it('successfully calls createTrainer mutation without password and triggers close', async () => {
      const createTrainerSpy = vi.spyOn(adminService, 'createTrainer').mockResolvedValueOnce({
        data: { success: true, trainer: { _id: 'tr_123', name: 'Sara Mentor' } },
      });
      const onClose = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<CreateTrainerModal open={true} onClose={onClose} />);

      await user.type(screen.getByLabelText(/Full Name/i), 'Sara Mentor');
      await user.type(screen.getByLabelText(/Email Address/i), 'sara.mentor@example.com');
      await user.type(screen.getByLabelText(/Phone Number/i), '+1234567890');
      await user.type(screen.getByLabelText(/Short Bio/i), 'Experienced React mentor');

      const submitBtn = screen.getByRole('button', { name: /Create Trainer/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(createTrainerSpy).toHaveBeenCalledTimes(1);
        expect(createTrainerSpy).toHaveBeenCalledWith({
          name: 'Sara Mentor',
          email: 'sara.mentor@example.com',
          phone: '+1234567890',
          domain: 'Full Stack Web Development',
          experience: '3-5 years',
          bio: 'Experienced React mentor',
        });
        expect(onClose).toHaveBeenCalled();
      });

      createTrainerSpy.mockRestore();
    });
  });

  describe('isTrainerProfileComplete helper', () => {
    it('returns true when organization, linkedinUrl, and resume are present', () => {
      const completeProfile = {
        domain: 'Full Stack Web Development',
        experience: '5-8 years',
        organization: 'Acme Corp',
        linkedinUrl: 'https://linkedin.com/in/mentor',
        resumeName: 'mentor_cv.pdf',
      };
      expect(isTrainerProfileComplete(completeProfile)).toBe(true);
    });

    it('returns false when organization, linkedinUrl, or resume is missing', () => {
      expect(isTrainerProfileComplete(null)).toBe(false);
      expect(isTrainerProfileComplete({})).toBe(false);
      expect(
        isTrainerProfileComplete({
          domain: 'Full Stack Web Development',
          organization: 'Acme Corp',
          // missing linkedinUrl and resume
        }),
      ).toBe(false);
    });
  });

  describe('TrainerProfileCompletionBanner', () => {
    it('renders on trainer dashboard when profile is incomplete', () => {
      const user = {
        _id: 'trainer-1',
        name: 'Alex Mentor',
        roles: ['TRAINER'],
        trainerProfile: {
          domain: 'Full Stack Web Development',
          experience: '3-5 years',
          organization: '',
          linkedinUrl: '',
          resumeName: null,
        },
      };

      renderWithProviders(<TrainerProfileCompletionBanner user={user} />);

      expect(screen.getByText(/Complete your trainer profile/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Complete Profile/i })).toHaveAttribute('href', '/profile');
    });

    it('does not render when profile is fully completed', () => {
      const user = {
        _id: 'trainer-2',
        name: 'Alex Mentor',
        roles: ['TRAINER'],
        trainerProfile: {
          domain: 'Full Stack Web Development',
          experience: '3-5 years',
          organization: 'Google',
          linkedinUrl: 'https://linkedin.com/in/alex',
          resumeName: 'alex_resume.pdf',
        },
      };

      const { container } = renderWithProviders(<TrainerProfileCompletionBanner user={user} />);
      expect(container.firstChild).toBeNull();
    });

    it('can be dismissed by clicking the close button', async () => {
      const user = {
        _id: 'trainer-3',
        name: 'Alex Mentor',
        roles: ['TRAINER'],
        trainerProfile: {
          domain: 'Full Stack Web Development',
          experience: '3-5 years',
        },
      };

      renderWithProviders(<TrainerProfileCompletionBanner user={user} />);
      expect(screen.getByText(/Complete your trainer profile/i)).toBeInTheDocument();

      const dismissBtn = screen.getByLabelText(/Dismiss profile completion reminder/i);
      fireEvent.click(dismissBtn);

      expect(screen.queryByText(/Complete your trainer profile/i)).not.toBeInTheDocument();
    });
  });

  describe('Password Setup Flow (/set-password)', () => {
    it('renders set password screen when accessed with token on /set-password', () => {
      renderWithProviders(<ResetPasswordPage />, { route: '/set-password?token=mock-invite-token' });

      expect(screen.getByRole('heading', { name: /Set your password/i })).toBeInTheDocument();
      expect(screen.getByText(/Welcome to the team! Choose a secure password for your account to get started/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^New password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Confirm new password$/i)).toBeInTheDocument();
    });

    it('shows setup link invalid state when opened without token', () => {
      renderWithProviders(<ResetPasswordPage />, { route: '/set-password' });

      expect(screen.getByText(/This setup link is invalid or was already used/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Go to log in/i })).toBeInTheDocument();
    });
  });
});
