import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy Loaded Pages for Performance & Bundle Splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CitizenDashboard = lazy(() => import('./pages/CitizenDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard'));
const PublicResourcesPage = lazy(() => import('./pages/PublicResourcesPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const TeamContributionPage = lazy(() => import('./pages/TeamContributionPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen pt-40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-gov-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 animate-pulse">Loading Smart Village...</span>
      </div>
    </div>
  );
}

// Scroll to top on navigation helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-300">
                <Navbar />

                <main className="flex-1">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/resources" element={<PublicResourcesPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/team" element={<TeamContributionPage />} />

                      {/* Citizen Dashboard & Complaint Form */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                          <CitizenDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/complaint/new" element={
                        <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                          <CitizenDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/track" element={<CitizenDashboard />} />

                      {/* Admin Dashboard */}
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />

                      {/* Worker Dashboard */}
                      <Route path="/worker" element={
                        <ProtectedRoute allowedRoles={['worker', 'admin']}>
                          <WorkerDashboard />
                        </ProtectedRoute>
                      } />

                      {/* 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </main>

                <Footer />
              </div>
            </BrowserRouter>
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
