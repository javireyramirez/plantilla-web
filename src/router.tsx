// src/router.tsx
import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from '@/components/layout/AdminLayout';
import PrivateLayout from '@/components/layout/PrivateLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminRoute from '@/components/routes/AdminRoute';
import GuestRoute from '@/components/routes/GuestRoute';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import CompanyForm from '@/modules/companies/components/companies.form';
import CompaniesView from '@/pages/Companies';
import ForgotPassword from '@/pages/ForgotPassword';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import VerifyEmail from '@/pages/VerifyEmail';

import Admin from './pages/Admin';

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
          <Route path="/companies/new" element={<CompanyForm />} />
          <Route path="/companies/edit/:id" element={<CompanyForm />} />
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
