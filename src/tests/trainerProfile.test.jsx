import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '@/shared/context/AuthContext';
import { TrainerProfileForm } from '@/features/profile/components/TrainerProfileForm';
import { trainerProfileSchema } from '@/features/profile/schemas/trainerProfileValidation';
import * as authService from '@/services/authService';

function renderWithClient(ui, user = null) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const authValue = {
    user,
    status: user ? 'authenticated' : 'unauthenticated',
    updateUser: vi.fn(),
    hasRole: (role) => (user?.roles ?? []).includes(role),
    hasAnyRole: (roles) => (roles ?? []).some((r) => (user?.roles ?? []).includes(r)),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>{ui}</MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe('Trainer Profile & Resume Updation', () => {
  const mockTrainer = {
    _id: 'trainer-123',
    name: 'Priya Nair',
    email: 'trainer@demo.dev',
    roles: ['TRAINER'],
    status: 'ACTIVE',
    emailVerified: true,
    trainerProfile: {
      domain: 'Full Stack Web Development',
      experience: '5-8 years',
      organization: 'Tech Corp',
      linkedinUrl: 'https://linkedin.com/in/priyanair',
      resumeName: 'Priya_Nair_Resume.pdf',
      resumeSize: 1024 * 1024,
    },
  };

  describe('trainerProfileSchema', () => {
    it('validates a complete trainer profile payload', () => {
      const result = trainerProfileSchema.safeParse({
        name: 'Priya Nair',
        domain: 'AI & Machine Learning',
        experience: '3-5 years',
        organization: 'AI Labs',
        linkedinUrl: 'https://linkedin.com/in/priya',
      });
      expect(result.success).toBe(true);
    });

    it('fails when domain or experience is missing', () => {
      const result = trainerProfileSchema.safeParse({
        name: 'Priya Nair',
        domain: '',
        experience: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('domain'))).toBe(true);
        expect(result.error.issues.some((i) => i.path.includes('experience'))).toBe(true);
      }
    });

    it('fails when name is too short', () => {
      const result = trainerProfileSchema.safeParse({
        name: 'A',
        domain: 'Full Stack Web Development',
        experience: '1-2 years',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('name'))).toBe(true);
      }
    });
  });

  describe('TrainerProfileForm Component', () => {
    it('renders pre-populated values from trainer profile and existing resume', () => {
      renderWithClient(<TrainerProfileForm user={mockTrainer} />, mockTrainer);

      expect(screen.getByDisplayValue('Priya Nair')).toBeInTheDocument();
      expect(screen.getByDisplayValue('trainer@demo.dev')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Full Stack Web Development')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5-8 years')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Tech Corp')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://linkedin.com/in/priyanair')).toBeInTheDocument();

      // Resume file card should be displayed
      expect(screen.getByTestId('resume-file-card')).toBeInTheDocument();
      expect(screen.getByText('Priya_Nair_Resume.pdf')).toBeInTheDocument();
      expect(screen.getByText(/1 MB/i)).toBeInTheDocument();
    });

    it('allows editing fields and updating resume document', async () => {
      const user = userEvent.setup();
      const patchSpy = vi.spyOn(authService, 'updateMe').mockResolvedValue({
        ...mockTrainer,
        name: 'Priya Nair Updated',
        trainerProfile: {
          ...mockTrainer.trainerProfile,
          organization: 'Google',
          resumeName: 'New_Resume_2026.pdf',
        },
      });

      renderWithClient(<TrainerProfileForm user={mockTrainer} />, mockTrainer);

      const saveBtn = screen.getByRole('button', { name: /save changes/i });
      expect(saveBtn).toBeDisabled();

      // Change Organization
      const orgInput = screen.getByLabelText(/current organization/i);
      await user.clear(orgInput);
      await user.type(orgInput, 'Google');
      expect(saveBtn).toBeEnabled();

      // Remove existing resume and upload new one
      const removeResumeBtn = screen.getByRole('button', { name: /remove resume/i });
      await user.click(removeResumeBtn);
      expect(screen.queryByTestId('resume-file-card')).not.toBeInTheDocument();
      expect(screen.getByTestId('resume-dropzone')).toBeInTheDocument();

      const newResume = new File(['updated content'], 'New_Resume_2026.pdf', {
        type: 'application/pdf',
      });
      const fileInput = screen.getByTestId('resume-file-input');
      fireEvent.change(fileInput, { target: { files: [newResume] } });

      expect(await screen.findByText('New_Resume_2026.pdf')).toBeInTheDocument();

      // Submit changes
      await user.click(saveBtn);

      await waitFor(() => {
        expect(patchSpy).toHaveBeenCalledTimes(1);
      });

      const callArgs = patchSpy.mock.calls[0][0];
      expect(callArgs.trainerProfile.organization).toBe('Google');
      expect(callArgs.trainerProfile.resumeName).toBe('New_Resume_2026.pdf');

      patchSpy.mockRestore();
    });

    it('cancels changes and reverts form back to initial state', async () => {
      const user = userEvent.setup();
      renderWithClient(<TrainerProfileForm user={mockTrainer} />, mockTrainer);

      const orgInput = screen.getByLabelText(/current organization/i);
      await user.clear(orgInput);
      await user.type(orgInput, 'Temporary Edits');

      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      expect(cancelBtn).toBeInTheDocument();

      await user.click(cancelBtn);

      expect(screen.getByDisplayValue('Tech Corp')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    });
  });
});
