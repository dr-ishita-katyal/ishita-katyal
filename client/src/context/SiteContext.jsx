import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../lib/api';
import fallbackData from '../data/fallback';

const SiteContext = createContext(null);

/** Merges the API payload over the fallback so a partially-filled CMS still renders. */
function merge(remote) {
  if (!remote) return fallbackData;
  const pick = (key) => {
    const value = remote[key];
    if (value === null || value === undefined) return fallbackData[key];
    if (Array.isArray(value)) return value.length ? value : fallbackData[key];
    if (typeof value === 'object') return { ...fallbackData[key], ...value };
    return value;
  };
  return {
    profile: pick('profile'),
    education: pick('education'),
    experience: pick('experience'),
    expertise: pick('expertise'),
    awards: pick('awards'),
    publications: pick('publications'),
    workshops: remote.workshops ?? [],
    gallery: remote.gallery ?? [],
    contact: pick('contact'),
    settings: { ...fallbackData.settings, ...(remote.settings || {}),
      sections: { ...fallbackData.settings.sections, ...(remote.settings?.sections || {}) } },
  };
}

export function SiteProvider({ children }) {
  const [data, setData] = useState(fallbackData);
  const [status, setStatus] = useState('loading'); // loading | ready | offline

  const load = useCallback(async (signal) => {
    try {
      const remote = await api.get('/site', { signal });
      setData(merge(remote));
      setStatus('ready');
    } catch (err) {
      if (err.name === 'AbortError') return;
      // The site stays fully readable on the seeded content.
      setData(fallbackData);
      setStatus('offline');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const value = useMemo(() => ({ ...data, status, refresh: () => load() }), [data, status, load]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}
