import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { AccountDetails } from '@/features/profile/components/AccountDetails';
import { profileSchema } from '@/features/profile/schemas/profileValidation';

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

describe('Profile Validation Schema', () => {
  it('validates a complete valid student profile', () => {
    const validData = {
      name: 'Aarav Sharma',
      headline: 'Full Stack Intern | Final Year CS Student',
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science',
      graduationYear: '2026',
      location: 'Bengaluru, India',
      linkedinUrl: 'https://linkedin.com/in/aaravsharma',
      portfolioUrl: 'https://aarav.dev',
      bio: 'Enthusiastic developer with a passion for React, Node.js, and cloud systems.',
    };

    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('allows empty optional fields', () => {
    const minimalData = {
      name: 'Diya Patel',
      headline: '',
      phone: '',
      college: '',
      degree: '',
      graduationYear: '',
      location: '',
      linkedinUrl: '',
      portfolioUrl: '',
      bio: '',
    };

    const result = profileSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('fails when name is shorter than 2 characters', () => {
    const result = profileSchema.safeParse({ name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 2 characters/i);
    }
  });

  it('fails when graduation year is invalid', () => {
    const result = profileSchema.safeParse({ name: 'Valid Name', graduationYear: '26' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/4-digit graduation year/i);
    }
  });

  it('fails when phone number format is invalid', () => {
    const result = profileSchema.safeParse({ name: 'Valid Name', phone: 'abc-not-a-number' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/valid phone number/i);
    }
  });
});

describe('Profile Components', () => {
  const mockUser = {
    _id: 'user-123',
    name: 'Aarav Sharma',
    email: 'aarav@demo.dev',
    avatarUrl: 'https://example.com/avatar.jpg',
    headline: 'Frontend Engineer',
    phone: '+91 98765 43210',
    college: 'NIT Trichy',
    degree: 'B.Tech CS',
    graduationYear: '2026',
    location: 'Bengaluru',
    linkedinUrl: 'https://linkedin.com/in/aarav',
    portfolioUrl: 'https://aarav.me',
    bio: 'Passionate about web apps and performance.',
    roles: ['STUDENT'],
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-01-15T00:00:00.000Z',
  };

  it('renders all editable inputs and profile photo row in ProfileForm', () => {
    renderWithProviders(<ProfileForm user={mockUser} />);

    // Header & photo banner
    expect(screen.getByRole('heading', { name: /student profile/i })).toBeInTheDocument();
    expect(screen.getByText(/profile photo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change photo/i })).toBeInTheDocument();

    // Inputs
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Aarav Sharma');
    expect(screen.getByLabelText(/professional headline/i)).toHaveValue('Frontend Engineer');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('+91 98765 43210');
    expect(screen.getByLabelText(/college \/ university/i)).toHaveValue('NIT Trichy');
    expect(screen.getByLabelText(/degree & branch/i)).toHaveValue('B.Tech CS');
    expect(screen.getByLabelText(/graduation year/i)).toHaveValue('2026');
    expect(screen.getByLabelText(/current location/i)).toHaveValue('Bengaluru');
    expect(screen.getByLabelText(/linkedin profile/i)).toHaveValue('https://linkedin.com/in/aarav');
    expect(screen.getByLabelText(/portfolio \/ website/i)).toHaveValue('https://aarav.me');
    expect(screen.getByLabelText(/bio \/ summary/i)).toHaveValue(
      'Passionate about web apps and performance.',
    );
  });

  it('renders AccountDetails with avatar, photo actions and student information', () => {
    renderWithProviders(<AccountDetails user={mockUser} />);

    expect(screen.getByRole('heading', { name: 'Aarav Sharma' })).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('aarav@demo.dev')).toBeInTheDocument();
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();
    expect(screen.getByText('NIT Trichy')).toBeInTheDocument();
    expect(screen.getByText(/B.Tech CS \(2026\)/i)).toBeInTheDocument();
    expect(screen.getByText('Bengaluru')).toBeInTheDocument();

    // Photo action buttons
    expect(screen.getByRole('button', { name: /upload profile photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^remove$/i })).toBeInTheDocument();
  });
});
