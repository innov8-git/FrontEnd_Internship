import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';
import { AdminProfileForm } from '@/features/profile/components/AdminProfileForm';
import { AccountDetails } from '@/features/profile/components/AccountDetails';
import { adminProfileSchema } from '@/features/profile/schemas/adminProfileValidation';
import { getAdminNavigation } from '@/shared/components/layout/navigation';
import { ROUTES } from '@/shared/constants';

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe('Admin Profile Validation Schema', () => {
  it('validates a complete valid admin profile payload', () => {
    const validData = {
      name: 'Vikram Singh',
      headline: 'Senior Platform Administrator',
      phone: '+91 98765 43210',
      department: 'Platform Engineering',
      organization: 'ALFRE Technologies',
      location: 'Bengaluru, India',
      linkedinUrl: 'https://linkedin.com/in/vikramsingh',
      bio: 'Managing platform systems, infrastructure, and user access controls.',
    };

    const result = adminProfileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('allows empty optional fields for admin profile', () => {
    const minimalData = {
      name: 'Vikram Singh',
      headline: '',
      phone: '',
      department: '',
      organization: '',
      location: '',
      linkedinUrl: '',
      bio: '',
    };

    const result = adminProfileSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('fails when name is shorter than 2 characters', () => {
    const result = adminProfileSchema.safeParse({ name: 'V' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 2 characters/i);
    }
  });

  it('fails when phone number format is invalid', () => {
    const result = adminProfileSchema.safeParse({ name: 'Vikram Singh', phone: 'not-a-valid-phone' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/valid phone number/i);
    }
  });

  it('fails when linkedin URL is invalid', () => {
    const result = adminProfileSchema.safeParse({
      name: 'Vikram Singh',
      linkedinUrl: 'invalid url with spaces',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/valid web link/i);
    }
  });
});

describe('Admin Navigation & Profile Components', () => {
  const mockAdmin = {
    _id: 'admin-001',
    name: 'Vikram Singh',
    email: 'admin@demo.dev',
    avatarUrl: 'https://example.com/admin-avatar.jpg',
    headline: 'Chief Technology Administrator',
    phone: '+91 98765 11223',
    department: 'Platform Systems',
    organization: 'ALFRE Education',
    location: 'Bengaluru',
    linkedinUrl: 'https://linkedin.com/in/vikram',
    bio: 'Oversees platform infrastructure and enterprise partnerships.',
    roles: ['ADMIN'],
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  it('includes Profile under Account section in Admin navigation', () => {
    const nav = getAdminNavigation();
    const accountSection = nav.find((s) => s.title === 'Account');
    expect(accountSection).toBeDefined();
    const profileItem = accountSection.items.find((item) => item.label === 'Profile');
    expect(profileItem).toBeDefined();
    expect(profileItem.to).toBe(ROUTES.ADMIN_PROFILE);
  });

  it('renders all editable inputs and profile photo actions in AdminProfileForm', () => {
    renderWithProviders(<AdminProfileForm user={mockAdmin} />);

    // Header & photo banner
    expect(screen.getByRole('heading', { name: /administrator profile/i })).toBeInTheDocument();
    expect(screen.getByText(/profile photo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();

    // Inputs with pre-populated values
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Vikram Singh');
    expect(screen.getByLabelText(/professional title \/ headline/i)).toHaveValue('Chief Technology Administrator');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('admin@demo.dev');
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/contact phone number/i)).toHaveValue('+91 98765 11223');
    expect(screen.getByLabelText(/department/i)).toHaveValue('Platform Systems');
    expect(screen.getByLabelText(/organization/i)).toHaveValue('ALFRE Education');
    expect(screen.getByLabelText(/office \/ location/i)).toHaveValue('Bengaluru');
    expect(screen.getByLabelText(/linkedin profile/i)).toHaveValue('https://linkedin.com/in/vikram');
    expect(screen.getByLabelText(/about \/ bio/i)).toHaveValue('Oversees platform infrastructure and enterprise partnerships.');

    // Buttons
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('renders Upload photo button when no avatar is set', () => {
    const noAvatarAdmin = { ...mockAdmin, avatarUrl: null };
    renderWithProviders(<AdminProfileForm user={noAvatarAdmin} />);

    expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull();
  });

  it('renders AccountDetails with Admin role and department details', () => {
    renderWithProviders(<AccountDetails user={mockAdmin} />);

    expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
    expect(screen.getByText('Chief Technology Administrator')).toBeInTheDocument();
    expect(screen.getByText('admin@demo.dev')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText(/platform systems · alfre education/i)).toBeInTheDocument();
    expect(screen.getByText('Bengaluru')).toBeInTheDocument();
  });

  it('allows modifying admin details and resets on reset button click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminProfileForm user={mockAdmin} />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Vikram Sharma');

    expect(nameInput).toHaveValue('Vikram Sharma');
    expect(screen.getByText(/you have unsaved changes/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /reset/i });
    expect(resetBtn).not.toBeDisabled();
    await user.click(resetBtn);

    expect(nameInput).toHaveValue('Vikram Singh');
  });
});

