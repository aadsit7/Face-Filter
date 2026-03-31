import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'recast-partner-user';

const VALID_USER = {
  id: 'partner-001',
  email: 'partner@recast.com',
  name: 'Sarah Mitchell',
  company: 'TechForward Solutions',
  role: 'Partner Sales Manager',
  tier: 'Gold',
  partnerSince: '2023-06-15',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === 'partner@recast.com' && password === 'Partner123!') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(VALID_USER));
      setUser(VALID_USER);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
