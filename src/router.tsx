// src/router.tsx
import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from '@/components/layout/AdminLayout';
import PrivateLayout from '@/components/layout/PrivateLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminRoute from '@/components/routes/AdminRoute';
import GuestRoute from '@/components/routes/GuestRoute';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import ForgotPassword from '@/modules/auth/pages/ForgotPassword';
import ResetPassword from '@/modules/auth/pages/ResetPassword';
import SignIn from '@/modules/auth/pages/SignIn';
import SignUp from '@/modules/auth/pages/SignUp';
import VerifyEmail from '@/modules/auth/pages/VerifyEmail';
import CompanyDetail from '@/modules/companies/pages/companies.detail';
import CompaniesView from '@/modules/companies/pages/companies.view';
import Profile from '@/modules/profile/Profile';
import Admin from '@/pages/Admin';
import Home from '@/pages/Home';

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
          <Route path="/companies" element={<CompaniesView />} />
          <Route path="/companies/new" element={<CompanyDetail />} />
          <Route path="/companies/edit/:id" element={<CompanyDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Rutas administración */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
