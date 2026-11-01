import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/queryClient';
import { AuthProvider } from '@/shared/context/AuthContext';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { ErrorBoundary } from '@/shared/components/ui';
import AppRoutes from '@/routes/AppRoutes';

/**
 * Application root: server-state cache, authentication session, theme provider and router.
 * Toasts, scroll restoration and the mock devtools live in RootLayout (inside the router).
 */
export default function App({ router }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes router={router} />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
