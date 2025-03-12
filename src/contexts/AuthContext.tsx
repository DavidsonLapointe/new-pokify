
import { createContext, useContext, ReactNode, useState } from 'react';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a mock session object
const mockSession: Session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  expires_at: new Date().getTime() + 3600000,
  user: {
    id: "mock-user-id",
    aud: "authenticated",
    role: "authenticated",
    email: "mock@example.com",
    app_metadata: {},
    user_metadata: { name: "Mock User" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always provide a mock session with no loading state
  const [session] = useState<Session | null>(mockSession);
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
