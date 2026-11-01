import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DiscountExplainer } from '@/features/internships/components/DiscountExplainer';

describe('DiscountExplainer Component', () => {
  it('renders section variant with percentage-based discount slabs', () => {
    render(<DiscountExplainer variant="section" />);

    expect(
      screen.getByRole('heading', {
        name: /score higher in assessment, earn up to 20% discount/i,
      }),
    ).toBeInTheDocument();

    // Verify all 3 discount tiers are rendered
    expect(screen.getAllByText('100%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('90% – 99%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('80% – 89%').length).toBeGreaterThan(0);

    // Verify "Below 80%" is removed
    expect(screen.queryByText('Below 80%')).not.toBeInTheDocument();

    // Verify discount percentages are rendered
    expect(screen.getAllByText(/max 20% off/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/10% off/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/5% off/i).length).toBeGreaterThan(0);
  });

  it('updates the simulated discount dynamically when adjusting score slider', () => {
    render(<DiscountExplainer variant="section" />);

    const slider = screen.getByLabelText(/simulate assessment score percentage/i);

    // Set to 100%
    fireEvent.change(slider, { target: { value: '100' } });
    expect(screen.getByText(/20% discount \(top merit\)/i)).toBeInTheDocument();

    // Set to 92%
    fireEvent.change(slider, { target: { value: '92' } });
    expect(screen.getByText(/10% discount \(high achiever\)/i)).toBeInTheDocument();

    // Set to 85%
    fireEvent.change(slider, { target: { value: '85' } });
    expect(screen.getByText(/5% discount \(merit incentive\)/i)).toBeInTheDocument();
  });

  it('renders compact variant cleanly for sidebars without Below 80%', () => {
    render(<DiscountExplainer variant="compact" />);

    expect(screen.getByText('Merit Discount Slabs')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('90% – 99%')).toBeInTheDocument();
    expect(screen.getByText('80% – 89%')).toBeInTheDocument();
    expect(screen.queryByText('Below 80%')).not.toBeInTheDocument();
  });
});
