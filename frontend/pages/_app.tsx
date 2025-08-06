import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ui/theme-provider'; // shadcn/ui ThemeProvider
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
