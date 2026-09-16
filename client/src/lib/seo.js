/** Small helpers that write head tags without pulling in a helmet dependency. */

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applySeo({ title, description, canonicalUrl, ogImage, favicon }) {
  if (title) document.title = title;
  if (description) {
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  }
  if (title) {
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  }
  if (ogImage) {
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });
  }
  if (canonicalUrl) {
    upsertLink('canonical', canonicalUrl);
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  }
  if (favicon) upsertLink('icon', favicon);
}

export function setRobots(content) {
  upsertMeta('meta[name="robots"]', { name: 'robots', content });
}

/**
 * Physician / Person structured data built strictly from stored content.
 * Nothing is asserted that the CMS does not hold.
 */
export function buildStructuredData({ profile, contact, settings, education }) {
  const alumni = (education || [])
    .filter((e) => e.institution)
    .map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution }));

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: profile?.name || settings?.doctorName,
    medicalSpecialty: 'PlasticSurgery',
    jobTitle: profile?.title,
  };

  if (profile?.shortBio) person.description = profile.shortBio;
  if (profile?.profileImage?.url) person.image = profile.profileImage.url;
  if (settings?.canonicalUrl) person.url = settings.canonicalUrl;
  if (contact?.email) person.email = contact.email;
  if (contact?.phone) person.telephone = contact.phone;
  if (alumni.length) person.alumniOf = alumni;

  if (contact?.clinicAddress || contact?.clinicName) {
    person.worksFor = {
      '@type': 'MedicalClinic',
      name: contact.clinicName || undefined,
      address: contact.clinicAddress || undefined,
    };
  }

  const sameAs = [contact?.instagram, contact?.linkedin, ...(contact?.otherLinks || []).map((l) => l.url)].filter(
    Boolean
  );
  if (sameAs.length) person.sameAs = sameAs;

  const credentials = (profile?.credentials || []).filter((c) => c.abbr);
  if (credentials.length) {
    person.hasCredential = credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: c.abbr,
      about: c.label || undefined,
    }));
  }

  return person;
}

export function injectStructuredData(data) {
  let el = document.getElementById('ld-json');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'ld-json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}
