'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      return;
    }

    // Check if we are loading from an invite link before Supabase clears the hash
    if (typeof window !== 'undefined' && window.location.hash) {
      if (
        window.location.hash.includes('type=invite') ||
        window.location.hash.includes('type=recovery')
      ) {
        sessionStorage.setItem('requiresPasswordUpdate', 'true');
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user && sessionStorage.getItem('requiresPasswordUpdate') === 'true') {
        sessionStorage.removeItem('requiresPasswordUpdate');
        window.location.href = '/update-password';
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY')) {
        if (sessionStorage.getItem('requiresPasswordUpdate') === 'true') {
          sessionStorage.removeItem('requiresPasswordUpdate');
          window.location.href = '/update-password';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
