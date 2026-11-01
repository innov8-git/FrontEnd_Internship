import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FeaturedInternships } from '@/features/internships/components/FeaturedInternships';

function renderFeaturedInternships() {
  return render(
    <MemoryRouter>
      <FeaturedInternships />
    </MemoryRouter>,
  );
}

describe('FeaturedInternships Section & Partner Companies', () => {
  it('renders all four partner companies with their fixed domains and role titles', () => {
    renderFeaturedInternships();

    // Check company names
    expect(screen.getAllByText('Inlarge Software').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Couldinger').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Proton').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Ady Nexes').length).toBeGreaterThanOrEqual(1);

    // Check fixed domain labels
    expect(screen.getAllByText('Banking & FinTech').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Telecom & Networks').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Healthcare & MedTech').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Enterprise Cloud & AI').length).toBeGreaterThan(0);

    // Check position headings
    expect(
      screen.getByRole('heading', { name: /Full Stack FinTech Engineer Intern/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Cloud & DevOps Network Intern/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Healthcare Systems & Full Stack Intern/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Enterprise Systems & AI Integration Intern/i }),
    ).toBeInTheDocument();
  });

  it('displays 100% Online Remote, 1 to 6 Months duration, and 3 core outcomes on cards', () => {
    renderFeaturedInternships();

    // 100% Online Remote tags
    const remoteTags = screen.getAllByText(/100% online remote/i);
    expect(remoteTags.length).toBeGreaterThanOrEqual(4);

    // 1 to 6 Months duration
    const durationTags = screen.getAllByText('1 to 6 Months');
    expect(durationTags.length).toBe(4);

    // Three core outcomes
    expect(screen.getAllByText('Experience Letter').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('1-on-1 Mentor').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('Placement Calls').length).toBeGreaterThanOrEqual(4);

    // Should NOT have stipend amounts or urgency badges on outer cards
    expect(screen.queryByText(/starts in \d+ days/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/open positions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/monthly stipend/i)).not.toBeInTheDocument();
  });

  it('filters companies when selecting domain tabs', async () => {
    const user = userEvent.setup();
    renderFeaturedInternships();

    // Click Banking & FinTech tab
    const bankingTab = screen.getByRole('button', { name: /Banking & FinTech/i });
    await user.click(bankingTab);

    // Inlarge role heading should be visible, other roles should be filtered out
    expect(
      screen.getByRole('heading', { name: /Full Stack FinTech Engineer Intern/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Cloud & DevOps Network Intern/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Healthcare Systems & Full Stack Intern/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Enterprise Systems & AI Integration Intern/i }),
    ).not.toBeInTheDocument();

    // Click All tab
    const allTab = screen.getByRole('button', { name: /All Companies & Tracks/i });
    await user.click(allTab);

    expect(
      screen.getByRole('heading', { name: /Full Stack FinTech Engineer Intern/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Cloud & DevOps Network Intern/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Healthcare Systems & Full Stack Intern/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Enterprise Systems & AI Integration Intern/i }),
    ).toBeInTheDocument();
  });

  it('opens details modal with role responsibilities and allows applying', async () => {
    const user = userEvent.setup();
    renderFeaturedInternships();

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    await user.click(viewDetailsButtons[0]);

    // Modal should open and display Role Responsibilities
    expect(
      screen.getByText(/Role Responsibilities & What You Will Build/i),
    ).toBeInTheDocument();

    // Switch to apply tab
    const applyTab = screen.getByRole('button', { name: /Apply for this Role/i });
    await user.click(applyTab);

    // Fill application form
    const nameInput = screen.getByPlaceholderText(/rahul sharma/i);
    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const phoneInput = screen.getByPlaceholderText(/\+91 98765 43210/i);
    const collegeInput = screen.getByPlaceholderText(/IIT Bombay/i);

    await user.type(nameInput, 'Amit Patel');
    await user.type(emailInput, 'amit@example.com');
    await user.type(phoneInput, '9876543210');
    await user.type(collegeInput, 'Delhi Technological University');

    const submitBtn = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitBtn);

    // Verify submission confirmation
    expect(
      await screen.findByText(/Application Submitted to Inlarge Software!/i),
    ).toBeInTheDocument();
  });
});
