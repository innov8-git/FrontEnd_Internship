import { useDocumentTitle } from '@/shared/hooks';
import { CtaBanner } from '../components/CtaBanner';
import { DiscountExplainer } from '../components/DiscountExplainer';
import { DomainStrip } from '../components/DomainStrip';
import { Faq } from '../components/Faq';
import { FeaturedInternships } from '../components/FeaturedInternships';
import { HeroSection, TrustStrip } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';

/** Public home page (SN5): the first impression of the portal. */
export function HomePage() {
  useDocumentTitle('Prove your skills, ship real projects');

  return (
    <div className="bg-white transition-colors duration-200 dark:bg-slate-950">
      <HeroSection />
      <TrustStrip />
      <HowItWorks />
      <FeaturedInternships />
      <DomainStrip />
      <DiscountExplainer />
      <Faq className="border-t border-slate-200 dark:border-slate-800" />
      <CtaBanner />
    </div>
  );
}

export default HomePage;
