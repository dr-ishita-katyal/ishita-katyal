import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/admin/Toast';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';

// The admin bundle only loads for people who actually visit /admin.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProfilePage = lazy(() => import('./pages/admin/ProfilePage'));
const ContactPage = lazy(() => import('./pages/admin/ContactPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const GalleryPage = lazy(() => import('./pages/admin/GalleryPage'));
const ResourcePage = lazy(() => import('./pages/admin/ResourcePage'));
const AccountPage = lazy(() => import('./pages/admin/AccountPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public pages share one SiteProvider so navigating between them
                  doesn't refetch the site content on every click. */}
              <Route element={<SiteProvider><Outlet /></SiteProvider>}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
              </Route>

              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="account" element={<AccountPage />} />
                {/* education | experience | expertise | awards | publications | workshops */}
                <Route path=":resource" element={<ResourcePage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-ivory">
      <p className="text-[0.75rem] uppercase tracking-[0.22em] text-clay">Loading</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="font-display text-[clamp(4rem,14vw,9rem)] leading-none text-ink">404</p>
      <p className="mt-4 max-w-[38ch] text-[0.95rem] leading-relaxed text-clay">
        That page does not exist.
      </p>
      <Link to="/" className="btn-solid mt-8">
        <span>Back to the website</span>
      </Link>
    </div>
  );
}