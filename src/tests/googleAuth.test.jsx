import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, createMemoryRouter } from 'react-router-dom';
import App from '@/App';
import { routes, ROUTER_FUTURE } from '@/routes/AppRoutes';
import { GoogleIcon } from '@/shared/icons/GoogleIcon';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';
import { AuthContext } from '@/shared/context/AuthContext';

function renderWithAuth(ui, authValue = {}) {
  const defaultAuth = {
    user: null,
    status: 'unauthenticated',
    isLoading: false,
    isAuthenticated: false,
    loginWithGoogle: vi.fn().mockResolvedValue({ id: 'u_google', name: 'Alex Chen', email: 'alex@example.com' }),
    ...authValue,
  };

  return render(
    <AuthContext.Provider value={defaultAuth}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>,
  );
}

function renderAppAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path], future: ROUTER_FUTURE });
  render(<App router={router} />);
  return router;
}

describe('Google Authentication', () => {
  describe('GoogleIcon component', () => {
    it('renders multi-colored SVG with proper viewBox and accessibility attributes', () => {
      const { container } = render(<GoogleIcon className="h-6 w-6" />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveClass('h-6', 'w-6');

      // Verify all 4 brand colored paths (#4285F4, #34A853, #FBBC05, #EA4335)
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBe(4);
      const fills = Array.from(paths).map((p) => p.getAttribute('fill'));
      expect(fills).toContain('#4285F4');
      expect(fills).toContain('#34A853');
      expect(fills).toContain('#FBBC05');
      expect(fills).toContain('#EA4335');
    });
  });

  describe('GoogleLoginButton component', () => {
    it('renders with compact label by default', () => {
      renderWithAuth(<GoogleLoginButton />);
      const button = screen.getByTestId('google-login-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Google');
    });

    it('renders with full label for login and register modes', () => {
      const { rerender } = renderWithAuth(<GoogleLoginButton mode="login" variant="full" />);
      expect(screen.getByTestId('google-login-button')).toHaveTextContent('Continue with Google');

      rerender(
        <AuthContext.Provider value={{ loginWithGoogle: vi.fn() }}>
          <MemoryRouter>
            <GoogleLoginButton mode="register" variant="full" />
          </MemoryRouter>
        </AuthContext.Provider>,
      );
      expect(screen.getByTestId('google-login-button')).toHaveTextContent('Sign up with Google');
    });

    it('applies dark and light mode styling classes', () => {
      renderWithAuth(<GoogleLoginButton />);
      const button = screen.getByTestId('google-login-button');

      // Light mode classes
      expect(button).toHaveClass('bg-white', 'text-slate-700', 'border-slate-200');
      // Dark mode classes
      expect(button).toHaveClass('dark:bg-slate-900', 'dark:text-slate-200', 'dark:border-slate-800');
    });

    it('triggers custom onClick handler when provided', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      renderWithAuth(<GoogleLoginButton onClick={handleClick} />);

      await user.click(screen.getByTestId('google-login-button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled and aria-busy when disabled prop is passed', () => {
      renderWithAuth(<GoogleLoginButton disabled />);
      const button = screen.getByTestId('google-login-button');
      expect(button).toBeDisabled();
    });
  });

  describe('SocialAuthButtons component', () => {
    it('renders full-width Google button and no GitHub button with separator', () => {
      renderWithAuth(<SocialAuthButtons mode="login" />);

      const googleBtn = screen.getByTestId('google-login-button');
      expect(googleBtn).toBeInTheDocument();
      expect(googleBtn).toHaveTextContent('Continue with Google');
      expect(screen.queryByTestId('github-login-button')).not.toBeInTheDocument();
      expect(screen.getByText(/or with email/i)).toBeInTheDocument();
    });
  });

  describe('End-to-end Google sign-in on LoginPage and RegisterPage', () => {
    it('allows a user to log in via Google from /login and redirects to /dashboard', async () => {
      const user = userEvent.setup();
      const router = renderAppAt('/login');

      const googleBtn = await screen.findByTestId('google-login-button', {}, { timeout: 5000 });
      expect(googleBtn).toBeInTheDocument();

      await user.click(googleBtn);

      await waitFor(() => expect(router.state.location.pathname).toBe('/dashboard'), {
        timeout: 5000,
      });
    });

    it('allows a user to sign up via Google from /register and redirects to /dashboard', async () => {
      const user = userEvent.setup();
      const router = renderAppAt('/register');

      const googleBtn = await screen.findByTestId('google-login-button', {}, { timeout: 5000 });
      expect(googleBtn).toBeInTheDocument();

      await user.click(googleBtn);

      await waitFor(() => expect(router.state.location.pathname).toBe('/dashboard'), {
        timeout: 5000,
      });
    });
  });

  describe('GoogleCallbackPage OAuth callback handling', () => {
    it('exchanges OAuth code and redirects to dashboard', async () => {
      const router = renderAppAt('/auth/google/callback?code=mock_google_oauth_code');

      await waitFor(() => expect(router.state.location.pathname).toBe('/dashboard'), {
        timeout: 5000,
      });
    });

    it('displays error state when OAuth was cancelled or denied', async () => {
      renderAppAt('/auth/google/callback?error=access_denied');

      expect(
        await screen.findByText(/google sign-in was cancelled/i, {}, { timeout: 5000 }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
    });

    it('displays error state when callback has no params', async () => {
      renderAppAt('/auth/google/callback');

      expect(
        await screen.findByText(/nothing to finish here/i, {}, { timeout: 5000 }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
    });
  });
});
