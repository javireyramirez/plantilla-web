import { createAuthClient } from 'better-auth/react';

const backURL = import.meta.env.VITE_BACK_URL;

export const authClient = createAuthClient({
  baseURL: `${backURL}/api/v1/auth`,
  fetchOptions: {
    credentials: 'include',
  },
  session: {
    refetchOnWindowFocus: true,
    staleTime: 60000,
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
