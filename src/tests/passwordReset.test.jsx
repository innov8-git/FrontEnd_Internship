import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router-dom';
import App from '@/App';
import { routes, ROUTER_FUTURE } from '@/routes/AppRoutes';
import { db } from '@/mocks/db';

function renderAppAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path], future: ROUTER_FUTURE });
  render(<App router={router} />);
  return router;
}

describe('Forgot & Reset Password Flow', () => {
  describe('Forgot Password Screen (/forgot-password)', () => {
    it('renders the forgot password form with email input and submit button', async () => {
      renderAppAt('/forgot-password');

      expect(
        await screen.findByRole('heading', { name: /forgot your password\?/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /back to log in/i })).toBeInTheDocument();
    });

    it('submits valid email and transitions to confirmation screen', async () => {
      const user = userEvent.setup();
      renderAppAt('/forgot-password');

      const emailField = await screen.findByLabelText(/email address/i);
      await user.type(emailField, 'student@demo.dev');
      await user.click(screen.getByRole('button', { name: /send reset link/i }));

      expect(await screen.findByRole('heading', { name: /check your email/i })).toBeInTheDocument();
      expect(screen.getByText('student@demo.dev')).toBeInTheDocument();
      expect(screen.getByText(/expires in 1 hour/i)).toBeInTheDocument();
    });

    it('allows starting over with another email', async () => {
      const user = userEvent.setup();
      renderAppAt('/forgot-password');

      const emailField = await screen.findByLabelText(/email address/i);
      await user.type(emailField, 'student@demo.dev');
      await user.click(screen.getByRole('button', { name: /send reset link/i }));

      const retryBtn = await screen.findByRole('button', { name: /try another email/i });
      await user.click(retryBtn);

      expect(await screen.findByRole('heading', { name: /forgot your password\?/i })).toBeInTheDocument();
    });
  });

  describe('Reset Password Screen (/reset-password)', () => {
    it('shows invalid link screen when token parameter is missing', async () => {
      renderAppAt('/reset-password');

      expect(
        await screen.findByRole('heading', { name: /this reset link is invalid or was already used/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /request a new link/i })).toBeInTheDocument();
    });

    it('renders new password and confirm password inputs when token is provided', async () => {
      renderAppAt('/reset-password?token=valid_test_token');

      expect(
        await screen.findByRole('heading', { name: /set a new password/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
    });

    it('successfully resets password with a valid token from mock database', async () => {
      const user = userEvent.setup();

      // Trigger a password reset email to seed an active token in mock db
      renderAppAt('/forgot-password');
      const emailField = await screen.findByLabelText(/email address/i);
      await user.type(emailField, 'student@demo.dev');
      await user.click(screen.getByRole('button', { name: /send reset link/i }));
      await screen.findByRole('heading', { name: /check your email/i });

      // Find token created in db
      const resetTokenRecord = db.authTokens.find((t) => t.type === 'PASSWORD_RESET' && !t.usedAt);
      expect(resetTokenRecord).toBeDefined();

      // Navigate to reset password page with token
      renderAppAt(`/reset-password?token=${resetTokenRecord.token}`);

      const passField = await screen.findByLabelText(/^new password/i);
      const confirmField = screen.getByLabelText(/confirm new password/i);

      await user.type(passField, 'NewStrongPass1');
      await user.type(confirmField, 'NewStrongPass1');

      await user.click(screen.getByRole('button', { name: /update password/i }));

      expect(
        await screen.findByRole('heading', { name: /password updated/i }, { timeout: 5000 }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^log in$/i })).toBeInTheDocument();
    });

    it('displays expired/invalid state when token is rejected by the server', async () => {
      const user = userEvent.setup();
      renderAppAt('/reset-password?token=invalid_expired_token');

      const passField = await screen.findByLabelText(/^new password/i);
      const confirmField = screen.getByLabelText(/confirm new password/i);

      await user.type(passField, 'NewStrongPass1');
      await user.type(confirmField, 'NewStrongPass1');

      await user.click(screen.getByRole('button', { name: /update password/i }));

      expect(
        await screen.findByRole('heading', {
          name: /this reset link is invalid or was already used/i,
        }),
      ).toBeInTheDocument();
    });
  });
});
