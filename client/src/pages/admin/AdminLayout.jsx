import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, User, GraduationCap, Briefcase, Sparkles, Award,
  BookOpen, Presentation, Images, Phone, Settings as SettingsIcon,
  LogOut, Menu, X, ExternalLink, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { setRobots } from '../../lib/seo';

// Grouped so the sidebar reads as sections rather than one long flat list.
const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/profile', label: 'Profile', icon: User },
      { to: '/admin/education', label: 'Education', icon: GraduationCap },
      { to: '/admin/experience', label: 'Experience', icon: Briefcase },
      { to: '/admin/expertise', label: 'Expertise', icon: Sparkles },
      { to: '/admin/awards', label: 'Awards', icon: Award },
      { to: '/admin/publications', label: 'Publications', icon: BookOpen },
      { to: '/admin/workshops', label: 'Workshops', icon: Presentation },
      { to: '/admin/gallery', label: 'Gallery', icon: Images },
    ],
  },
  {
    label: 'Site',
    items: [
      { to: '/admin/contact', label: 'Contact', icon: Phone },
      { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/admin/account', label: 'Account', icon: ShieldCheck }],
  },
];

const NAV = NAV_GROUPS.flatMap((g) => g.items);

export default function AdminLayout() {
  const { admin, checking, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setRobots('noindex, nofollow'), []);
  useEffect(() => setOpen(false), [location.pathname]);

  if (checking) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ivory">
        <p className="text-[0.8rem] uppercase tracking-[0.2em] text-clay">Checking your session…</p>
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;

  const current = NAV.find((n) => location.pathname.startsWith(n.to));

  const onLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const initials = (admin.email || 'A')
    .replace(/@.*/, '')
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('') || 'A';

  return (
    <div className="min-h-[100svh] bg-ivory text-ink">
      {/* ---- Sidebar ---- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] flex-col border-r border-line bg-cream transition-transform duration-300 ease-silk lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-umber via-gilt to-umber" aria-hidden="true" />

        <div className="flex items-center gap-3 border-b border-line px-6 py-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-umber/25 bg-ivory font-display text-[1.15rem] text-umber">
            IK
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[1.15rem] leading-none">Dr. Ishita Katyal</p>
            <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-clay">Content manager</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin sections">
          <div className="space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-clay/70">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 rounded-r-[3px] border-l-2 px-3.5 py-2.5 text-[0.85rem] transition-colors duration-200 ${
                            isActive
                              ? 'border-umber bg-sand text-ink font-medium'
                              : 'border-transparent text-cocoa/75 hover:border-line hover:bg-sand/50 hover:text-ink'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                                isActive ? 'text-umber' : 'text-clay group-hover:text-umber'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="space-y-0.5 border-t border-line p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-[3px] px-3.5 py-2.5 text-[0.85rem] text-cocoa/75 transition-colors hover:bg-sand/50 hover:text-ink"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-clay" />
            View the website
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-[3px] px-3.5 py-2.5 text-left text-[0.85rem] text-cocoa/75 transition-colors hover:bg-sand/50 hover:text-ink"
          >
            <LogOut className="h-4 w-4 shrink-0 text-clay" />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
        />
      )}

      {/* ---- Content ---- */}
      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-ivory/92 px-5 backdrop-blur-[8px] sm:px-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-ink/[0.05] lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-2 text-[0.75rem] text-clay">
              <li>Admin</li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="truncate font-medium text-ink">{current?.label || 'Dashboard'}</li>
            </ol>
          </nav>

          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="truncate text-[0.78rem] text-clay">{admin.email}</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-cream text-[0.62rem] font-semibold text-umber">
              {initials}
            </span>
          </div>
        </header>

        <main className="px-5 pb-20 pt-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}