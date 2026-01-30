import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme/theme-provider.js';

import Layout from './components/layout/Layout.js';
import GuestRoute from './components/routes/GuestRoute.js';
import ProtectedRoute from './components/routes/ProtectedRoute.js';
import './index.css';
import ForgotPassword from './pages/ForgotPassword.js';
import Home from './pages/Home.js';
import Profile from './pages/Profile.js';
import ResetPassword from './pages/ResetPassword.js';
import SignIn from './pages/SignIn.js';
import SignUp from './pages/SignUp.js';
import VerifyEmail from './pages/VerifyEmail.js';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route
              path="/signin"
              element={
                <GuestRoute>
                  <SignIn />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignUp />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/ingredient"
              element={
                <ProtectedRoute>
                  <SignIn />
                </ProtectedRoute>
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pagina1"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
