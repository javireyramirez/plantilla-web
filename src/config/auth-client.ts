import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: `${window.location.origin}/api/v1/auth`,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
