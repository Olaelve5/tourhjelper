// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

// Import your global styles
import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/providers/AuthProvider';
import { LoadingProvider } from '@/providers/LoadingProvider';
import { theme } from '@/utils/themeUtils';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <SpeedInsights />
      <LoadingProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </LoadingProvider>
    </MantineProvider>
  );
}