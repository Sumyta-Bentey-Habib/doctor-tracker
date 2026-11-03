'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { apiRequest } from '@/lib/api';

export interface Admin {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  user: Admin;
}

interface AuthContextValue {
  user: Admin;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthGuard');
  }

  return context;
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const response = await apiRequest<AuthResponse>('/auth/me');

        if (active) {
          setUser(response.user);
        }
      } catch {
        if (active) {
          router.replace('/login');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="mt-4 text-sm text-text-secondary">Verifying your session...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
