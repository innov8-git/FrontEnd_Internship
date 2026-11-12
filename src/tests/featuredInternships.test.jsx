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

    // Check position headings: cards now display 'Trainee Software Engineer' only in bold
    const engineerHeadings = screen.getAllByRole('heading', { name: /^Trainee Software Engineer$/i });
    expect(engineerHeadings.length).toBeGreaterThanOrEqual(4);
  });

  it('displays 100% Online Remote, 1 to 6 Months duration, and 3 core outcomes on cards', () => {
    renderFeaturedInternships();

    // 100% Online Remote tags
    const remoteTags = screen.getAllByText(/100% online remote/i);
    expect(remoteTags.length).toBeGreaterThanOrEqual(4);

    // 1 to 6 Months duration
    const durationTags = screen.getAllByText('1 to 6 Months');
    expect(durationTags.length).toBeGreaterThanOrEqual(4);

    // Three core outcomes
    expect(screen.getAllByText('Internship Completion Letter').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('1-on-1 Mentor').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('Placement Support').length).toBeGreaterThanOrEqual(4);

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

    // Inlarge company cards should be visible, other companies should be filtered out
    expect(screen.getAllByText(/Enterprise core banking/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Next-gen telecom orchestration/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HIPAA-compliant health tech/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Multi-tenant enterprise SaaS/i)).not.toBeInTheDocument();

    // Click All tab
    const allTab = screen.getByRole('button', { name: /All Companies & Tracks/i });
    await user.click(allTab);

    expect(screen.getAllByText(/Enterprise core banking/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Next-gen telecom orchestration/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/HIPAA-compliant health tech/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Multi-tenant enterprise SaaS/i).length).toBeGreaterThan(0);
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

    // Verify company-specific domain dropdown and duration dropdown
    expect(
      screen.getByRole('combobox', { name: /Select Domain Offered by Inlarge Software/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Select Duration/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Banking' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Finance' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '1 Month' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2 Months' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '3 Months' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '6 Months' })).toBeInTheDocument();

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

    // Verify submission confirmation with domain & duration details
    expect(
      await screen.findByText(/Application Submitted to Inlarge Software!/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Banking Domain/i)).toBeInTheDocument();
  });

  it('displays all 8 assigned domains across the 4 companies (2 domains per company)', () => {
    renderFeaturedInternships();

    // 8 Domains: Banking, Finance, Telecom, Ecom, Healthcare, Insurance, ERP/CRM, Loan
    // Check assigned domains badges on cards
    expect(screen.getAllByText('Banking').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Finance').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Telecom').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ecom').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Healthcare').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Insurance').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ERP/CRM').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Loan').length).toBeGreaterThan(0);
  });

  it('renders separate cards for Web Development and App Development positions on each company', async () => {
    const user = userEvent.setup();
    renderFeaturedInternships();

    // Both Web Development and App Development cards are rendered as independent cards in the grid
    expect(screen.getAllByText('Web Development Track').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('App Development Track').length).toBeGreaterThanOrEqual(4);
    expect(
      screen.getAllByRole('heading', { name: /^Trainee Software Engineer$/i }).length,
    ).toBeGreaterThanOrEqual(8);

    // Click 'App Development' track filter toggle
    const appTrackButton = screen.getByRole('button', { name: /^App Development$/i });
    await user.click(appTrackButton);

    // Only App Development cards should now be rendered (4 cards)
    expect(screen.getAllByText('App Development Track').length).toBeGreaterThanOrEqual(4);
    expect(screen.queryByText('Web Development Track')).not.toBeInTheDocument();
  });

  it('filters companies using sub-domain quick filter pills', async () => {
    const user = userEvent.setup();
    renderFeaturedInternships();

    // Click 'Insurance' sub-domain pill
    const insurancePill = screen.getByRole('button', { name: /^Insurance$/i });
    await user.click(insurancePill);

    // Proton (Healthcare & Insurance) card should be visible
    expect(screen.getAllByText(/HIPAA-compliant health tech/i).length).toBeGreaterThan(0);

    // Other company cards should be filtered out
    expect(screen.queryByText(/Enterprise core banking/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Next-gen telecom orchestration/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Multi-tenant enterprise SaaS/i)).not.toBeInTheDocument();
  });

  it(
    'opens modal strictly for the specific clicked position (Web or App) without track switcher',
    async () => {
    const user = userEvent.setup();
    renderFeaturedInternships();

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    // First card is Inlarge Web Development
    await user.click(viewDetailsButtons[0]);

    // Modal view has Web Development role with responsibilities
    expect(screen.getByText(/Full Stack Web Engineering Track/i)).toBeInTheDocument();
    expect(screen.getByText(/Role Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Role Responsibilities & What You Will Build/i)).toBeInTheDocument();

    // Verifies no position switcher button exists in the modal
    expect(screen.queryByText(/Select Position:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Confirm Selected Position/i)).not.toBeInTheDocument();

    // Outcome tags inside modal are Internship Completion Letter & Placement Support
    const completionLetters = screen.getAllByText('Internship Completion Letter');
    expect(completionLetters.length).toBeGreaterThanOrEqual(1);
    const placementSupports = screen.getAllByText('Placement Support');
    expect(placementSupports.length).toBeGreaterThanOrEqual(1);
  }, 15000);

  it('renders 4 cards initially when limit={4} and displays a View More redirect CTA linking to /internships', () => {
    render(
      <MemoryRouter>
        <FeaturedInternships limit={4} showViewMore={true} />
      </MemoryRouter>,
    );

    // Displays exactly 4 cards
    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    expect(viewDetailsButtons.length).toBe(4);

    // Displays the View More CTA linking to /internships
    const viewMoreLink = screen.getByRole('link', { name: /View More Positions/i });
    expect(viewMoreLink).toBeInTheDocument();
    expect(viewMoreLink.getAttribute('href')).toBe('/internships');
  });
});
