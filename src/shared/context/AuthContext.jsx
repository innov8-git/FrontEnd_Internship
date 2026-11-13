import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/authService';
import {
  clearAccessToken,
  refreshAccessToken,
  setAccessToken,
  setAuthFailureHandler,
} from '@/services/api';
import { hasAnyRole, hasRole } from '@/shared/constants';

/**
 * Session state for the whole app.
 *  status: 'loading' (restoring the session on boot) | 'authenticated' | 'unauthenticated'
 * On boot we call /auth/refresh: the refresh token lives in an httpOnly cookie, so a page
 * reload restores the session without ever storing the access token in localStorage.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'alfre_user';

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  if (typeof window === 'undefined') return;
  try {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  } catch {}
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const initialUser = getStoredUser();
  const [state, setState] = useState(() => ({
    status: initialUser ? 'authenticated' : 'loading',
    user: initialUser,
  }));
  const mounted = useRef(true);

  const setSignedOut = useCallback(() => {
    setStoredUser(null);
    clearAccessToken();
    setState({ status: 'unauthenticated', user: null });
  }, []);

  useEffect(() => {
    mounted.current = true;
    setAuthFailureHandler(() => {
      if (!mounted.current) return;
      setSignedOut();
      queryClient.clear();
    });

    refreshAccessToken()
      .then((data) => {
        if (!mounted.current) return;
        if (data?.user) {
          setStoredUser(data.user);
          setState({ status: 'authenticated', user: data.user });
        } else {
          setSignedOut();
        }
      })
      .catch(() => {
        if (mounted.current) {
          // If we had no stored user, mark as unauthenticated.
          // If a stored user exists, only log out if session was rejected by server.
          setSignedOut();
        }
      });

    return () => {
      mounted.current = false;
      setAuthFailureHandler(null);
    };
  }, [queryClient, setSignedOut]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await authService.login({ email, password });
      setStoredUser(data.user);
      setAccessToken(data.accessToken);
      queryClient.clear();
      setState({ status: 'authenticated', user: data.user });
      return data.user;
    },
    [queryClient],
  );

  const loginWithGoogle = useCallback(
    async (payload) => {
      const data = await authService.loginWithGoogle(payload);
      setStoredUser(data.user);
      setAccessToken(data.accessToken);
      queryClient.clear();
      setState({ status: 'authenticated', user: data.user });
      return data.user;
    },
    [queryClient],
  );

  const loginWithOtp = useCallback(
    async ({ email, otp }) => {
      const data = await authService.verifyRegistrationOtp({ email, otp });
      setStoredUser(data.user);
      setAccessToken(data.accessToken);
      queryClient.clear();
      setState({ status: 'authenticated', user: data.user });
      return data.user;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the server call fails we still clear the local session.
    }
    setSignedOut();
    queryClient.clear();
  }, [queryClient, setSignedOut]);

  /** Merge fields into the cached user (e.g. after PATCH /auth/me). */
  const updateUser = useCallback((patch) => {
    setState((current) => {
      const updatedUser = typeof patch === 'function' ? patch(current.user) : { ...current.user, ...patch };
      setStoredUser(updatedUser);
      return {
        ...current,
        user: updatedUser,
      };
    });
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await authService.getMe();
    setState((current) => ({ ...current, user }));
    return user;
  }, []);

  const value = useMemo(() => {
    const user = state.user;
    return {
      user,
      status: state.status,
      isLoading: state.status === 'loading',
      isAuthenticated: state.status === 'authenticated',
      roles: user?.roles ?? [],
      hasRole: (role) => hasRole(user, role),
      hasAnyRole: (roles) => hasAnyRole(user, roles),
      login,
      loginWithGoogle,
      loginWithOtp,
      logout,
      updateUser,
      refreshUser,
    };
  }, [state, login, loginWithGoogle, loginWithOtp, logout, updateUser, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
