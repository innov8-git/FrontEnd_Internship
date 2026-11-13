/**
 * Auth feature public API (SN3, SN4). Route pages are lazy-loaded from their own files
 * (src/routes/lazyPages.js) and are deliberately not re-exported here.
 */
export { AuthCard } from './components/AuthCard';
export { AuthErrorBanner } from './components/AuthErrorBanner';
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { StudentRegisterForm } from './components/StudentRegisterForm';
export { TrainerRegisterForm } from './components/TrainerRegisterForm';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';
export { ResendVerificationForm } from './components/ResendVerificationForm';
export { PasswordRules } from './components/PasswordRules';
export { SocialAuthButtons } from './components/SocialAuthButtons';
export { GoogleLoginButton } from './components/GoogleLoginButton';
export { ResumeUpload } from './components/ResumeUpload';

export { useLogin } from './hooks/useLogin';
export { useGoogleAuth } from './hooks/useGoogleAuth';
export { useRegister, useStudentRegister, useTrainerRegister } from './hooks/useRegister';
export { useVerifyEmail } from './hooks/useVerifyEmail';
export { useForgotPassword, useResetPassword } from './hooks/usePasswordReset';
export { useResendVerification, RESEND_COOLDOWN_SECONDS } from './hooks/useResendVerification';
export { useCooldown } from './hooks/useCooldown';

export {
  PASSWORD_RULES,
  getPasswordRuleResults,
  isPasswordStrongEnough,
  loginSchema,
  registerSchema,
  studentRegisterSchema,
  trainerRegisterSchema,
  STUDENT_REGISTER_DEFAULTS,
  TRAINER_REGISTER_DEFAULTS,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendSchema,
  TRAINER_DOMAINS,
  EXPERIENCE_LEVELS,
} from './schemas/authValidation';

export {
  AUTH_ERROR_CODES,
  describeAuthError,
  describeLoginError,
  getTokenErrorKind,
} from './utils/authErrors';
