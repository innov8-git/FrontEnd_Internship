import { useDocumentTitle } from '@/shared/hooks';
import { CtaBanner } from '../components/CtaBanner';
import { DomainStrip } from '../components/DomainStrip';
import { Faq } from '../components/Faq';
import { FeaturedInternships } from '../components/FeaturedInternships';
import { HeroSection, TrustStrip } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';

/** Public home page: original layout with updated theme and hero background. */
export function HomePage() {
  useDocumentTitle('ALFRE | Real Software Engineering Internships & Career Guidance');

  return (
    <div className="bg-white transition-colors duration-200 dark:bg-slate-950">
      <HeroSection />
      <TrustStrip />
      <HowItWorks />
      <FeaturedInternships limit={4} showViewMore={true} />
      <DomainStrip />
      <Faq className="border-t border-slate-200 dark:border-slate-800" />
      <CtaBanner />
    </div>
  );
}

export default HomePage;
