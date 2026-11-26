import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as authService from '@/services/authService';
import { ROUTES, buildPath, getSafeRedirect } from '@/shared/constants';

/**
 * Student Registration hook.
 * Calls POST /api/v1/auth/register/student.
 * On success redirects to /check-email?email=...
 */
export function useStudentRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn: (values) => {
      const referralCode = String(values?.referralCode ?? '').trim().toUpperCase();
      return authService.registerStudent({
        name: String(values?.name ?? '').trim(),
        email: String(values?.email ?? '').trim(),
        password: String(values?.password ?? ''),
        ...(referralCode ? { referralCode } : {}),
      });
    },
    onSuccess: (data, variables) => {
      const email = data?.user?.email ?? String(variables?.email ?? '').trim();
      navigate(buildPath(ROUTES.CHECK_EMAIL, {}, { email, redirect: redirectTo }));
    },
  });

  return {
    registerStudent: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    redirectTo,
  };
}

/**
 * Unified registration hook (Student registration).
 */
export function useRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn: (values) => {
      const referralCode = String(values?.referralCode ?? '').trim().toUpperCase();
      return authService.registerStudent({
        name: String(values?.name ?? '').trim(),
        email: String(values?.email ?? '').trim(),
        password: String(values?.password ?? ''),
        ...(referralCode ? { referralCode } : {}),
      });
    },
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
