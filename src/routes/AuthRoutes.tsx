import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from '../auth/AuthContext';
import { RequireAuth } from '../auth/RequireAuth';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProductsPage } from '../pages/ProductsPage';

export const AuthRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </AuthProvider>
  );
};
