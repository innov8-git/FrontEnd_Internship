import AuthLayout from '@/shared/components/layout/AuthLayout';
import GuestRoute from './GuestRoute';
import {
  CheckEmailPage,
  ForgotPasswordPage,
  GoogleCallbackPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  TrainerRegisterPage,
  VerifyEmailPage,
} from './lazyPages';

/**
 * Login and register are guest-only. Email verification, password reset links, and OAuth callbacks
 * must work whether or not the person is signed in, so they are not wrapped in GuestRoute.
 */
export const authRoutes = [
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'register/student', element: <RegisterPage /> },
          { path: 'register/trainer', element: <TrainerRegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'check-email', element: <CheckEmailPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'auth/google/callback', element: <GoogleCallbackPage /> },
      { path: 'google/callback', element: <GoogleCallbackPage /> },
    ],
  },
];

export default authRoutes;
