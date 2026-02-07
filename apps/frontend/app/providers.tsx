/**
 * Providers Component
 * Wraps the app with necessary providers (Redux, Theme, etc.)
 */

'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
}

