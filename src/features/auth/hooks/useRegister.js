import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as authService from '@/services/authService';
import { ROUTES, buildPath, getSafeRedirect } from '@/shared/constants';

/**
 * Registration (SN3). On success the student goes to /check-email?email=… (keeping `redirect`
 * so they come back to where they started after verifying and logging in).
 *
 *   const { registerAccount, isPending, error, redirectTo } = useRegister();
 *   await registerAccount({ name, email, password })   // rejects with ApiError on failure
 */
export function useRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn: (values) =>
      authService.register({
        name: String(values?.name ?? '').trim(),
        email: String(values?.email ?? '').trim(),
        password: String(values?.password ?? ''),
        role: values?.role === 'TRAINER' ? 'TRAINER' : 'STUDENT',
        domain: values?.domain ? String(values.domain).trim() : undefined,
        experience: values?.experience ? String(values.experience).trim() : undefined,
        linkedinUrl: values?.linkedinUrl ? String(values.linkedinUrl).trim() : undefined,
        organization: values?.organization ? String(values.organization).trim() : undefined,
        resumeName: values?.resume?.name ? String(values.resume.name).trim() : (typeof values?.resume === 'string' ? values.resume : undefined),
      }),
    onSuccess: (data, variables) => {
      const email = data?.user?.email ?? String(variables?.email ?? '').trim();
      navigate(buildPath(ROUTES.CHECK_EMAIL, {}, { email, redirect: redirectTo }));
    },
  });

  return {
    registerAccount: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    redirectTo,
  };
}

export default useRegister;
