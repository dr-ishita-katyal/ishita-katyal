import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { setRobots } from '../../lib/seo';
import { EASE } from '../../lib/motion';

export default function Login() {
  const { admin, checking, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setRobots('noindex, nofollow');
    document.title = 'Sign in — Dr. Ishita Katyal';
  }, []);

  if (!checking && admin) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[100svh] grid-cols-1 bg-ivory lg:grid-cols-2">
      {/* Left rail keeps the brand present without repeating the whole homepage. */}
      <div className="relative hidden flex-col justify-between bg-cocoa p-12 text-ivory lg:flex">
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-ivory/50">Content manager</p>
        <div>
          <p className="font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.95]">
            Dr. Ishita
            <br />
            Katyal
          </p>
          <p className="mt-5 max-w-[30ch] text-[0.9rem] leading-relaxed text-ivory/60">
            Everything on the public website — biography, timelines, awards, publications and contact
            details — is edited here.
          </p>
        </div>
        <Link to="/" className="link-wipe text-[0.78rem] text-ivory/60 hover:text-ivory">
          Back to the website
        </Link>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h1 className="font-display text-[2.2rem] leading-tight text-ink">Sign in</h1>
          <p className="mt-2 text-[0.9rem] text-clay">Use the administrator account for this site.</p>

          <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
            <label className="block">
              <span className="field-label">Email</span>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="field-label">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
              />
            </label>

            {error && (
              <p role="alert" className="border-l-2 border-red-500 bg-red-50 px-3 py-2.5 text-[0.82rem] text-red-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-solid w-full disabled:opacity-70">
              <span className="inline-flex items-center gap-2">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {busy ? 'Signing in' : 'Sign in'}
              </span>
            </button>
          </form>

          <Link to="/" className="link-wipe mt-8 inline-block text-[0.78rem] text-clay hover:text-ink lg:hidden">
            Back to the website
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
