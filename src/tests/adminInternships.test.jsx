import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminInternshipsPage from '@/features/catalog/pages/AdminInternshipsPage';
import { InternshipEditorModal } from '@/features/catalog/components/InternshipEditorModal';
import * as catalogHooks from '@/features/catalog/hooks/useCatalogAdmin';
import { FeaturedInternships } from '@/features/internships/components/FeaturedInternships';
import { resetStoredPartnerCompanies } from '@/features/internships/data/companyInternshipsStore';

describe('Admin Partner Internships Management & Cross-Portal Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    resetStoredPartnerCompanies();
  });

  it('renders all default partner companies and positions with statistics', () => {
    render(
      <MemoryRouter>
        <AdminInternshipsPage />
      </MemoryRouter>,
    );

    // Title and stats
    expect(screen.getByRole('heading', { name: /Partner Internships/i })).toBeInTheDocument();
    expect(screen.getByText('Total Positions')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument(); // 8 default positions
    expect(screen.getByText('Partner Companies')).toBeInTheDocument();
    expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1); // 4 companies / 4 tracks

    // Company names in table
    expect(screen.getAllByText('Inlarge Software').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Couldinger').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Proton').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Ady Nexes').length).toBeGreaterThanOrEqual(1);

    // Track Badges
    const webBadges = screen.getAllByText('Web Development');
    const appBadges = screen.getAllByText('App Development');
    expect(webBadges.length).toBeGreaterThanOrEqual(4);
    expect(appBadges.length).toBeGreaterThanOrEqual(4);
  });

  it('filters table by track (Web vs App) and search query', () => {
    render(
      <MemoryRouter>
        <AdminInternshipsPage />
      </MemoryRouter>,
    );

    // Search query
    const searchInput = screen.getByPlaceholderText(/Search by company, role title, or domain.../i);
    fireEvent.change(searchInput, { target: { value: 'Inlarge' } });

    // Should only show Inlarge Software
    expect(screen.getAllByText('Inlarge Software').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Couldinger')).not.toBeInTheDocument();
    expect(screen.queryByText('Proton')).not.toBeInTheDocument();

    // Reset search
    fireEvent.change(searchInput, { target: { value: '' } });

    // Filter by Track dropdown
    const trackSelect = screen.getByRole('combobox', { name: /filter by track/i });
    fireEvent.change(trackSelect, { target: { value: 'web' } });

    // Should only show Web Development track positions
    expect(screen.getAllByText('Web Development').length).toBeGreaterThanOrEqual(4);
  });

  it('allows admin to edit an existing internship and reflects live across the student portal', async () => {
    // 1. Render Admin Page
    const { unmount } = render(
      <MemoryRouter>
        <AdminInternshipsPage />
      </MemoryRouter>,
    );

    // Find the first edit button (for Inlarge Software Web)
    const editButtons = screen.getAllByTitle('Edit Internship Position');
    fireEvent.click(editButtons[0]);

    // Verify Edit Modal is opened
    expect(screen.getByText(/Edit Internship: Inlarge Software/i)).toBeInTheDocument();

    // Switch to Role tab
    const roleTab = screen.getByRole('button', { name: /Role & Track/i });
    fireEvent.click(roleTab);

    // Change Role Title to "Lead Trainee Software Engineer"
    const titleInput = screen.getByLabelText(/Role Title \*/i);
    fireEvent.change(titleInput, { target: { value: 'Lead Trainee Software Engineer' } });

    // Submit form
    const saveButton = screen.getByRole('button', { name: /Update Internship/i });
    fireEvent.click(saveButton);

    // Verify table in admin updated
    await waitFor(() => {
      expect(screen.getByText('Lead Trainee Software Engineer')).toBeInTheDocument();
    });

    unmount();

    // 2. Render Student Portal / Home FeaturedInternships to verify cross-page synchronization
    render(
      <MemoryRouter>
        <FeaturedInternships />
      </MemoryRouter>,
    );

    // The edited title should now appear directly on the student portal card!
    expect(screen.getByText('Lead Trainee Software Engineer')).toBeInTheDocument();
  });

  it('allows admin to insert a brand new partner internship and renders on student portal', async () => {
    // 1. Render Admin Page
    const { unmount } = render(
      <MemoryRouter>
        <AdminInternshipsPage />
      </MemoryRouter>,
    );

    // Click "Post New Internship"
    const postBtn = screen.getByRole('button', { name: /Post New Internship/i });
    fireEvent.click(postBtn);

    expect(screen.getByText(/Post New Partner Internship/i)).toBeInTheDocument();

    // Fill Company tab
    const companyInput = screen.getByLabelText(/Partner Company Name \*/i);
    fireEvent.change(companyInput, { target: { value: 'Apex Robotics' } });

    const domainInput = screen.getByLabelText(/^Domain \*/i);
    fireEvent.change(domainInput, { target: { value: 'Robotics, Automation' } });

    // Fill Role tab
    const roleTab = screen.getByRole('button', { name: /Role & Track/i });
    fireEvent.click(roleTab);

    const titleInput = screen.getByLabelText(/Role Title \*/i);
    fireEvent.change(titleInput, { target: { value: 'Robotics Software Trainee' } });

    const descTextarea = screen.getByPlaceholderText(/Provide a comprehensive role overview/i);
    fireEvent.change(descTextarea, {
      target: { value: 'Build next-generation industrial robotics software using modern web portals.' },
    });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Create Internship/i });
    fireEvent.click(submitBtn);

    // Verify it appears in Admin table and stats increment
    await waitFor(() => {
      expect(screen.getByText('Apex Robotics')).toBeInTheDocument();
      expect(screen.getByText('Robotics Software Trainee')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument(); // Total positions incremented from 8 to 9
    });

    unmount();

    // 2. Render Student Portal / FeaturedInternships
    render(
      <MemoryRouter>
        <FeaturedInternships />
      </MemoryRouter>,
    );

    // New company & role now display on student portal!
    expect(screen.getAllByText('Apex Robotics').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Robotics Software Trainee')).toBeInTheDocument();
  });

  it('allows admin to delete an internship position with confirmation', async () => {
    render(
      <MemoryRouter>
        <AdminInternshipsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('8')).toBeInTheDocument();

    // Click delete on first position
    const deleteButtons = screen.getAllByTitle('Delete Internship Position');
    fireEvent.click(deleteButtons[0]);

    // Confirmation dialog
    expect(screen.getByText(/Delete Internship Position\?/i)).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: /^Delete Position$/i });
    fireEvent.click(confirmBtn);

    // Count decrements to 7
    await waitFor(() => {
      expect(screen.getByText('7')).toBeInTheDocument();
    });
  });

  it('allows admin to reset all internships back to default 4 companies', async () => {
    render(
      <MemoryRouter>
        <AdminInternshipsPage />
      </MemoryRouter>,
    );

    // Delete one item
    const deleteButtons = screen.getAllByTitle('Delete Internship Position');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: /^Delete Position$/i }));

    await waitFor(() => {
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    // Click Reset to Defaults
    const resetBtn = screen.getByRole('button', { name: /Reset to Defaults/i });
    fireEvent.click(resetBtn);

    // Confirm reset
    expect(screen.getByText(/Reset All Internships to Defaults\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm Reset/i }));

    // Restores back to 8
    await waitFor(() => {
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });

  it('hides unpublished (DRAFT) domains and designations in InternshipEditorModal', () => {
    const spy = vi.spyOn(catalogHooks, 'useCatalogOptions').mockImplementation((kind) => {
      if (kind === 'domain') {
        return {
          data: [
            { _id: 'd1', name: 'Banking', status: 'PUBLISHED' },
            { _id: 'd2', name: 'investment', status: 'DRAFT' },
          ],
        };
      }
      return {
        data: [
          { _id: 'g1', name: 'Java Developer', status: 'PUBLISHED' },
          { _id: 'g2', name: 'demo', status: 'DRAFT' },
        ],
      };
    });

    render(<InternshipEditorModal open={true} onClose={vi.fn()} onSave={vi.fn()} />);

    // Company & Domain tab: Banking should be visible, investment (DRAFT) should NOT be visible
    expect(screen.getByRole('button', { name: 'Banking' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'investment' })).not.toBeInTheDocument();

    // Switch to Role & Track tab
    fireEvent.click(screen.getByRole('button', { name: /Role & Track/i }));

    // Java Developer should be visible, demo (DRAFT) should NOT be visible
    expect(screen.getByRole('button', { name: 'Java Developer' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'demo' })).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
