import { useNavigate, useSearchParams } from 'react-router-dom';
import { DomainAssessmentFlow } from '../components/DomainAssessmentFlow';
import { ROUTES } from '@/shared/constants';

export function DomainAssessmentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const domain = searchParams.get('domain') || 'Banking';
  const partnerName = searchParams.get('partner') || 'Inlarge Software';
  const candidateName = searchParams.get('candidate') || 'Candidate';
  const email = searchParams.get('email') || '';
  const roleTitle = searchParams.get('role') || 'Trainee Software Engineer';

  const partner = {
    name: partnerName,
    domain,
    id: domain.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  };

  const role = {
    id: `${partner.id}-eng`,
    designation: roleTitle,
  };

  const candidate = {
    fullName: candidateName,
    email,
  };

  const handleClose = () => {
    navigate(ROUTES.CATALOG);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <DomainAssessmentFlow
          candidate={candidate}
          domain={domain}
          partner={partner}
          role={role}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}

export default DomainAssessmentPage;

