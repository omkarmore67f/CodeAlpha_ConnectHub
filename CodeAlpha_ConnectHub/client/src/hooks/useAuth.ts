import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/queries';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  const { isError } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await authApi.me();
      setSession(data.user);
      setHydrated(true);
      return data.user;
    },
    enabled: Boolean(token),
    retry: false
  });

  useEffect(() => {
    if (isError) {
      clearSession();
      setHydrated(true);
    }
  }, [isError, clearSession, setHydrated]);

  return useAuthStore();
}
