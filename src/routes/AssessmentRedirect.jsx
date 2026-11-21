import { Navigate, useParams } from 'react-router-dom';

export default function AssessmentRedirect() {
  const { designationId } = useParams();
  return <Navigate to={designationId ? `/enroll?designationId=${designationId}` : '/internships'} replace />;
}
