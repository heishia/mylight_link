'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken, removeToken, isAuthenticated } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  page?: { slug: string };
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<User>('/auth/me');
      setUser(data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>('/auth/login', {
      email,
      password,
    });
    setToken(data.accessToken);
    await fetchUser();
    router.push('/dashboard');
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    slug: string,
  ) => {
    const { data } = await api.post<{ accessToken: string }>(
      '/auth/register',
      { email, password, name, slug },
    );
    setToken(data.accessToken);
    await fetchUser();
    router.push('/dashboard');
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, register, logout, isAuthenticated: !!user };
}
