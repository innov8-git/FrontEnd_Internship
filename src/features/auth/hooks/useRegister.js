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
    mutationFn: (values) =>
      authService.registerStudent({
        name: String(values?.name ?? '').trim(),
        email: String(values?.email ?? '').trim(),
        password: String(values?.password ?? ''),
      }),
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
 * Trainer Registration hook.
 * Calls POST /api/v1/auth/register/trainer.
 * On success redirects to /check-email?email=...
 */
export function useTrainerRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn: (values) =>
      authService.registerTrainer({
        name: String(values?.name ?? '').trim(),
        email: String(values?.email ?? '').trim(),
        password: String(values?.password ?? ''),
        domain: String(values?.domain ?? '').trim(),
        experience: String(values?.experience ?? '').trim(),
        organization: values?.organization ? String(values.organization).trim() : undefined,
        linkedinUrl: values?.linkedinUrl ? String(values.linkedinUrl).trim() : undefined,
        resumeUrl: values?.resumeUrl ? String(values.resumeUrl).trim() : undefined,
      }),
    onSuccess: (data, variables) => {
      const email = data?.user?.email ?? String(variables?.email ?? '').trim();
      navigate(buildPath(ROUTES.CHECK_EMAIL, {}, { email, redirect: redirectTo }));
    },
  });

  return {
    registerTrainer: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    redirectTo,
  };
}

/**
 * Backward-compatible registration hook.
 * Supports legacy single-form callers by routing dynamically to student or trainer endpoints.
 */
export function useRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn: (values) => {
      if (values?.role === 'TRAINER') {
        return authService.registerTrainer({
          name: String(values?.name ?? '').trim(),
          email: String(values?.email ?? '').trim(),
          password: String(values?.password ?? ''),
          domain: String(values?.domain ?? '').trim(),
          experience: String(values?.experience ?? '').trim(),
          organization: values?.organization ? String(values.organization).trim() : undefined,
          linkedinUrl: values?.linkedinUrl ? String(values.linkedinUrl).trim() : undefined,
          resumeUrl: values?.resumeUrl ? String(values.resumeUrl).trim() : undefined,
        });
      }

      return authService.registerStudent({
        name: String(values?.name ?? '').trim(),
        email: String(values?.email ?? '').trim(),
        password: String(values?.password ?? ''),
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
