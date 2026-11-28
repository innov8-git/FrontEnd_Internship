import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeleteUserDialog } from '@/features/admin/components/DeleteUserDialog';
import { UsersPage } from '@/features/admin/pages/UsersPage';
import { AuthContext } from '@/shared/context/AuthContext';
import * as adminService from '@/services/adminService';

function renderWithProviders(ui, { user = null, route = '/admin/users' } = {}) {
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

describe('Admin permanent user deletion', () => {
  describe('DeleteUserDialog', () => {
    it('requires typing both name and email to enable deletion', async () => {
      const deleteSpy = vi.spyOn(adminService, 'deleteUser').mockResolvedValueOnce({
        _id: 'u-1',
        deleted: true,
        wasTeamMember: false,
      });
      const onClose = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <DeleteUserDialog
          user={{
            _id: 'u-1',
            name: 'Aarav Sharma',
            email: 'student@demo.dev',
            isTeamMember: false,
            teams: [],
          }}
          onClose={onClose}
        />,
      );

      const confirmBtn = screen.getByRole('button', { name: /Delete permanently/i });
      expect(confirmBtn).toBeDisabled();
      expect(screen.queryByText(/You are deleting a team/i)).not.toBeInTheDocument();

      // Typing only name is not enough
      await user.type(screen.getByLabelText(/User's full name/i), 'Aarav Sharma');
      expect(confirmBtn).toBeDisabled();

      // Typing wrong email keeps it disabled
      await user.type(screen.getByLabelText(/User's email address/i), 'wrong@demo.dev');
      expect(confirmBtn).toBeDisabled();

      // Typing matching email unlocks the button
      const emailInput = screen.getByLabelText(/User's email address/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'student@demo.dev');
      expect(confirmBtn).toBeEnabled();

      await user.click(confirmBtn);

      await waitFor(() => {
        expect(deleteSpy).toHaveBeenCalledWith('u-1');
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('shows a team-member warning popup message when deleting a team member', () => {
      renderWithProviders(
        <DeleteUserDialog
          user={{
            _id: 'u-2',
            name: 'Rohan Gupta',
            email: 'leader@demo.dev',
            isTeamMember: true,
            isTeamLeader: true,
            teams: [{ _id: 'team-1', name: 'Alpha Coders', isLeader: true }],
          }}
          onClose={vi.fn()}
        />,
      );

      expect(screen.getByRole('alert')).toHaveTextContent(/You are deleting a team leader \/ team member/i);
      expect(screen.getByRole('alert')).toHaveTextContent(/Alpha Coders/i);
    });
  });

  describe('UsersPage delete action', () => {
    it('disables self-delete and opens DeleteUserDialog for another user', async () => {
      const adminUser = {
        _id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@alfre.com',
        roles: ['ADMIN'],
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
      };
      const teamMemberUser = {
        _id: 'student-2',
        name: 'Rohan Gupta',
        email: 'leader@demo.dev',
        roles: ['STUDENT'],
        status: 'ACTIVE',
        emailVerified: true,
        isTeamMember: true,
        isTeamLeader: false,
        teams: [{ _id: 't-1', name: 'Alpha Coders', isLeader: false }],
        createdAt: '2026-01-02T00:00:00Z',
      };

      vi.spyOn(adminService, 'getUsers').mockResolvedValue({
        items: [adminUser, teamMemberUser],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const user = userEvent.setup();
      renderWithProviders(<UsersPage />, { user: adminUser });

      await waitFor(() => {
        expect(screen.getByText('Rohan Gupta')).toBeInTheDocument();
      });

      // Open self actions menu -> cannot delete self
      await user.click(screen.getByRole('button', { name: /Actions for Super Admin/i }));
      const selfDeleteItem = screen.getByRole('menuitem', { name: /You can't delete yourself/i });
      expect(selfDeleteItem).toHaveAttribute('aria-disabled', 'true');
      await user.click(selfDeleteItem);
      expect(screen.queryByText(/Delete Super Admin\?/i)).not.toBeInTheDocument();

      // Open another user's actions menu -> click Delete user
      await user.click(screen.getByRole('button', { name: /Actions for Rohan Gupta/i }));
      await user.click(screen.getByRole('menuitem', { name: /Delete user/i }));

      expect(screen.getByText(/Delete Rohan Gupta\?/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/You are deleting a team member/i);
    });
  });
});
