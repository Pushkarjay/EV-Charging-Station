import { useState, useEffect } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  token: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage or session)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (token && user) {
      setAuth({
        isLoggedIn: true,
        user: JSON.parse(user),
        token,
      });
    }

    setLoading(false);
  }, []);

  const login = (user: any, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ isLoggedIn: true, user, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isLoggedIn: false, user: null, token: null });
  };

  return { ...auth, loading, login, logout };
}
