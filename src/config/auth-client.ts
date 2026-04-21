import { createAuthClient } from 'better-auth/react';

const backURL = import.meta.env.VITE_BACK_URL
  ? window.location.origin // desarrollo → proxy de Vite
  : 'https://api.javireyramirez.com'; // producción → backend directo

export const authClient = createAuthClient({
  baseURL: `${backURL}/api/v1/auth`,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
