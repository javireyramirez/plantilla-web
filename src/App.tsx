// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme/theme-provider';
import '@/index.css';
import Router from '@/router';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}
