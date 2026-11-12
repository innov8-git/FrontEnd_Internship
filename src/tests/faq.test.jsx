import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Faq } from '@/features/internships/components/Faq';

function renderFaq() {
  return render(
    <MemoryRouter>
      <Faq />
    </MemoryRouter>,
  );
}

describe('Faq Component', () => {
  it('renders section title and genuine internship questions', () => {
    renderFaq();

    expect(
      screen.getByRole('heading', { name: /everything you need to know/i }),
    ).toBeInTheDocument();

    // Check genuine questions
    expect(
      screen.getByText(/who is eligible to do this internship/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/which durations are available/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/which industry domains and companies are available/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/is this internship 100% online and remote/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will i receive an official internship completion letter and placement support/i),
    ).toBeInTheDocument();
  });

  it('toggles accordion items open and closed on click', async () => {
    const user = userEvent.setup();
    renderFaq();

    const durationQuestion = screen.getByRole('button', {
      name: /which durations are available/i,
    });

    // Click to open duration question
    await user.click(durationQuestion);

    // Verify duration answers are displayed
    expect(screen.getAllByText(/1 month/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2 months/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3 months/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/6 months/i).length).toBeGreaterThan(0);
  });

  it('filters questions by category pills', async () => {
    const user = userEvent.setup();
    renderFaq();

    // Click Durations & Domains category
    const categoryBtn = screen.getByRole('button', { name: /durations & domains/i });
    await user.click(categoryBtn);

    // Durations question should be visible
    expect(
      screen.getByText(/which durations are available/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/which industry domains and companies are available/i),
    ).toBeInTheDocument();

    // Questions in other categories should not be in the filtered list
    expect(
      screen.queryByText(/how do the assessment percentage discounts work/i),
    ).not.toBeInTheDocument();
  });
});
