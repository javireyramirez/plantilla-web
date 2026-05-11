// src/router.tsx
import { Navigate, Route, Routes } from 'react-router-dom';

import PrivateLayout from '@/components/layout/PrivateLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import GuestRoute from '@/components/routes/GuestRoute';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import ForgotPassword from '@/pages/ForgotPassword';
import Home from '@/pages/Home';
import DocumentsTable from '@/pages/Pagina1';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import VerifyEmail from '@/pages/VerifyEmail';

export default function Router() {
  return (
    <Routes>
      {/* Rutas públicas con layout */}
      <Route element={<GuestRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* Con layout pero accesibles para todos */}
      <Route element={<PublicLayout />}>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Rutas privadas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/pagina1"
            element={
              <DocumentsTable entityType="hola" entityId="b13ce02f-5bae-424f-80ad-74f47bec5ba1" />
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
