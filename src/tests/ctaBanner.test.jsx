import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '@/shared/context/AuthContext';
import { CtaBanner } from '@/features/internships/components/CtaBanner';

function renderCtaBanner(authValue = null) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <CtaBanner />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('CtaBanner Component', () => {
  it('renders headline, value proposition and partner companies for guest users', () => {
    renderCtaBanner(null);

    expect(
      screen.getByRole('heading', {
        name: /ready to build real software & launch your career/i,
      }),
    ).toBeInTheDocument();

    // Highlights
    expect(screen.getByText('100% Online Remote')).toBeInTheDocument();
    expect(screen.getByText('1 to 6 Months Flexible')).toBeInTheDocument();
    expect(screen.getByText('Internship Completion Letter')).toBeInTheDocument();
    expect(screen.getByText('1-on-1 Mentor')).toBeInTheDocument();
    expect(screen.getByText('Placement Support')).toBeInTheDocument();

    // Partner companies
    expect(screen.getByText(/Inlarge Software \(Banking\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Couldinger \(Telecom\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Proton \(Healthcare\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Ady Nexes \(Enterprise AI\)/i)).toBeInTheDocument();

    // Action buttons for guest
    expect(
      screen.getByRole('link', { name: /explore online internships/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /create a free student account/i }),
    ).toBeInTheDocument();
  });

  it('renders dashboard link when user is authenticated', () => {
    renderCtaBanner({
      isAuthenticated: true,
      user: { id: 'u1', role: 'STUDENT', name: 'Alex' },
    });

    expect(
      screen.getByRole('link', { name: /go to your dashboard/i }),
    ).toBeInTheDocument();
  });
});

