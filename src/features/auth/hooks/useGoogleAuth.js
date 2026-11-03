import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { toast } from '@/shared/components/ui';
import { USE_MOCKS, getHomeRoute, getSafeRedirect } from '@/shared/constants';
import { describeAuthError } from '../utils/authErrors';

const GIS_SCRIPT_ID = 'google-identity-services-script';
const GIS_SRC = 'https://accounts.google.com/gsi/client';

/**
 * Loads the Google Identity Services script asynchronously if not already loaded.
 */
function loadGoogleScript() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.google?.accounts?.id) return Promise.resolve(window.google);

  const existingScript = document.getElementById(GIS_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', () => resolve(null));
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

/**
 * Hook for Google OAuth authentication (SOLID: Single Responsibility for Google auth flow).
 * Supports:
 *  1. Google Identity Services (GIS) One-Tap / Popup when VITE_GOOGLE_CLIENT_ID is set.
 *  2. Mock/Demo authentication when USE_MOCKS is enabled.
 *  3. Backend redirect flow fallback.
 *
 * Usage:
 *   const { signInWithGoogle, isPending, error, reset } = useGoogleAuth({ mode: 'login' });
 */
export function useGoogleAuth(options = {}) {
  const { mode = 'login', redirectTo: customRedirectTo, onSuccess, onError } = options;
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = customRedirectTo ?? getSafeRedirect(searchParams.get('redirect'));

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isMockMode = USE_MOCKS;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Exchanges a Google credential (ID token) or code with our backend.
   */
  const handleCredentialResponse = useCallback(
    async (payload) => {
      try {
        setIsPending(true);
        setError(null);
        const user = await loginWithGoogle(payload);

        toast.success(
          mode === 'register'
            ? 'Account created with Google successfully!'
            : 'Welcome back! Signed in with Google.',
        );

        if (onSuccess) {
          onSuccess(user);
        }

        if (mountedRef.current) {
          navigate(redirectTo ?? getHomeRoute(user), { replace: true });
        }
        return user;
      } catch (err) {
        const errorInfo = describeAuthError(err) || {
          title: 'Google authentication failed',
          description: 'Please try again or use another login method.',
        };

        if (mountedRef.current) {
          setError(err);
        }

        toast.error(errorInfo.title, {
          description: errorInfo.description ?? 'Please try again.',
        });

        if (onError) {
          onError(err);
        }
        return null;
      } finally {
        if (mountedRef.current) {
          setIsPending(false);
        }
        inFlightRef.current = false;
      }
    },
    [loginWithGoogle, mode, navigate, onError, onSuccess, redirectTo],
  );

  /**
   * Triggers the Google sign-in workflow.
   */
  const signInWithGoogle = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsPending(true);
    setError(null);

    // 1. Mock / Demo mode (when VITE_GOOGLE_CLIENT_ID is not provided or USE_MOCKS is active)
    if (isMockMode) {
      try {
        await handleCredentialResponse({ credential: 'mock_google_credential_student' });
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
          setIsPending(false);
        }
        inFlightRef.current = false;
      }
      return;
    }

    // 2. Real GIS flow
    try {
      const google = await loadGoogleScript();
      if (!google?.accounts?.id) {
        throw new Error('Google Identity Services failed to load.');
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            handleCredentialResponse({ credential: response.credential });
          } else {
            if (mountedRef.current) {
              setIsPending(false);
            }
            inFlightRef.current = false;
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Prompt the user with Google One-Tap / Popup
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fall back to server redirect or explicit OAuth window
          const backendAuthUrl = `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/google`;
          window.location.href = backendAuthUrl;
        }
      });
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
        setIsPending(false);
      }
      inFlightRef.current = false;
      toast.error('Google sign-in could not be opened', {
        description: 'Please check your connection and popup settings.',
      });
    }
  }, [clientId, handleCredentialResponse, isMockMode]);

  return {
    signInWithGoogle,
    handleCredentialResponse,
    isPending,
    error,
    reset,
    isConfigured: Boolean(clientId || isMockMode),
  };
}

export default useGoogleAuth;
