import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { EASE } from '../../lib/motion';

const TILES = [
  { key: 'education', label: 'Education entries', to: '/admin/education' },
  { key: 'experience', label: 'Experience & training', to: '/admin/experience' },
  { key: 'expertise', label: 'Expertise areas', to: '/admin/expertise' },
  { key: 'awards', label: 'Awards', to: '/admin/awards' },
  { key: 'publications', label: 'Publications', to: '/admin/publications' },
  { key: 'workshops', label: 'Workshops', to: '/admin/workshops' },
  { key: 'gallery', label: 'Gallery images', to: '/admin/gallery' },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [cloud, setCloud] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Dashboard — Admin';
    api.get('/stats').then(setStats).catch((e) => setError(e.message));
    api.get('/upload/status').then((s) => setCloud(s.cloudinary)).catch(() => setCloud(null));
  }, []);

  const todo = [];
  if (stats && !stats.contactComplete)
    todo.push({ text: 'Add phone, email and clinic details so visitors can get in touch.', to: '/admin/contact' });
  if (stats && !stats.profileComplete)
    todo.push({ text: 'Complete the biography and portrait on the profile screen.', to: '/admin/profile' });
  if (cloud === false)
    todo.push({ text: 'Image uploads are off until Cloudinary keys are added to the server .env file.', to: null });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-[2rem] leading-tight text-ink">
        Welcome back{admin?.name ? `, ${admin.name.split(' ')[0]}` : ''}
      </h1>
      <p className="mt-2 max-w-[56ch] text-[0.9rem] leading-relaxed text-clay">
        Everything you change here appears on the website as soon as you save.
      </p>

      {error && (
        <p className="mt-6 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-[0.85rem] text-red-800">{error}</p>
      )}

      {todo.length > 0 && (
        <div className="mt-8 admin-card p-6">
          <p className="flex items-center gap-2 font-display text-[1.25rem] text-ink">
            <AlertCircle className="h-4 w-4 text-umber" />
            Worth finishing
          </p>
          <ul className="mt-4 space-y-2.5">
            {todo.map((item, i) => (
              <li key={i} className="text-[0.9rem] leading-relaxed text-cocoa/85">
                {item.to ? (
                  <Link to={item.to} className="link-wipe">
                    {item.text}
                  </Link>
                ) : (
                  item.text
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
          >
            <Link
              to={tile.to}
              className="group flex h-full flex-col justify-between rounded-[4px] border border-line bg-cream p-5 transition-colors hover:border-umber/40 hover:bg-sand/50"
            >
              <span className="font-display text-[2.4rem] leading-none text-ink">
                {stats ? stats.counts[tile.key] ?? 0 : '—'}
              </span>
              <span className="mt-4 flex items-end justify-between gap-2 text-[0.78rem] leading-snug text-clay">
                {tile.label}
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickLink to="/admin/profile" title="Profile" body="Name, hero copy, biography, quote, portraits." />
        <QuickLink to="/admin/contact" title="Contact" body="Phone, email, WhatsApp, clinic and booking link." />
        <QuickLink to="/admin/settings" title="Settings" body="SEO, disclaimer and which sections are published." />
      </div>
    </div>
  );
}

function QuickLink({ to, title, body }) {
  return (
    <Link
      to={to}
      className="group rounded-[4px] border border-line bg-cream p-5 transition-colors hover:border-umber/40 hover:bg-sand/50"
    >
      <p className="font-display text-[1.3rem] text-ink">{title}</p>
      <p className="mt-1.5 text-[0.82rem] leading-relaxed text-clay">{body}</p>
    </Link>
  );
}
