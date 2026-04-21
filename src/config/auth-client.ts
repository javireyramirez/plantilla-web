import { createAuthClient } from 'better-auth/react';

const backURL = import.meta.env.DEV ? window.location.origin : 'https://javireyramirez.com';

export const authClient = createAuthClient({
  baseURL: `${backURL}/api/v1/auth`,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
