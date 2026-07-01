'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // ThemeProvider injects a <script> for flash-prevention — the React 19
    // "script tag" console warning is expected and harmless (next-themes known issue).
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          style: {
            borderRadius: '24px',
            padding: '14px 24px',
            fontFamily: 'var(--font-jakarta), sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-card)',
          },
          success: {
            style: {
              background: '#fdf2f8',
              color: '#be185d',
              border: '2px solid #fbcfe8',
            },
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fff1f2',
              color: '#be123c',
              border: '2px solid #fecdd3',
            },
            iconTheme: {
              primary: '#e11d48',
              secondary: '#fff',
            },
          },
        }}
      />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
