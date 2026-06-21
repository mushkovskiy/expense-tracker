'use client';

import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';

function RadixThemeSync({ children }: { children: React.ReactNode }) {
  return (
    <Theme accentColor="indigo" grayColor="slate" radius="medium">
      {children}
    </Theme>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RadixThemeSync>{children}</RadixThemeSync>
    </ThemeProvider>
  );
}
