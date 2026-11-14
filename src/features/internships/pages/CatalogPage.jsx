import { PageHeader } from '@/shared/components/ui';
import { useDocumentTitle } from '@/shared/hooks';
import { ROUTES } from '@/shared/constants';
import { FeaturedInternships } from '../components/FeaturedInternships';

/**
 * Public catalog: showcases verified industry partner internships across
 * 4 companies, 8 domains, and dedicated Web and App Development tracks.
 */
export function CatalogPage() {
  useDocumentTitle('Internships');

  return (
    <div className="bg-slate-50 min-h-screen dark:bg-slate-950">
      <div className="container-page space-y-6 py-8 sm:py-10">
        <PageHeader
          breadcrumbs={[
            { label: 'Home', to: ROUTES.HOME },
            { label: 'Internships', to: ROUTES.CATALOG },
          ]}
          title="Explore internships"
          description="Work remotely on live production systems with our 4 vetted enterprise partners across 8 core domains. Explore dedicated internship positions for both Web Development and App Development."
        />

        {/* Dedicated Industry Partner Tracks (8 Positions across 4 Companies & 8 Domains) */}
        <FeaturedInternships isCatalogPage={true} />
      </div>
    </div>
  );
}

export default CatalogPage;
