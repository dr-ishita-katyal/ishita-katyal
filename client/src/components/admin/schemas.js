/**
 * One schema per content type. The generic resource screen reads these to build
 * its list, its form and its empty state, so adding a field is a one-line change.
 *
 * field types: text | textarea | select | toggle | image
 */

export const schemas = {
  education: {
    path: '/education',
    title: 'Education',
    singular: 'qualification',
    breadcrumb: 'Education',
    intro: 'Degrees and formal medical training, shown as the Education & training timeline.',
    emptyTitle: 'No qualifications yet',
    emptyBody: 'Add a degree to start building the education timeline.',
    primary: (r) => r.degree,
    secondary: (r) => [r.fullDegreeName, r.institution].filter(Boolean).join(' — '),
    tertiary: (r) => [r.startDate, r.endDate].filter(Boolean).join(' – '),
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true, placeholder: 'MCh', span: 1 },
      { name: 'fullDegreeName', label: 'Full degree name', type: 'text', span: 1, placeholder: 'Master of Chirurgiae — Plastic and Reconstructive Surgery' },
      { name: 'institution', label: 'Institution', type: 'text', span: 2 },
      { name: 'location', label: 'Location', type: 'text', span: 1 },
      { name: 'startDate', label: 'Start', type: 'text', span: 1, hint: 'Free text, e.g. 2019 or August 2019' },
      { name: 'endDate', label: 'End', type: 'text', span: 1 },
      { name: 'description', label: 'Description', type: 'textarea', span: 2 },
    ],
  },

  experience: {
    path: '/experience',
    title: 'Experience & training',
    singular: 'role',
    breadcrumb: 'Experience',
    intro:
      'Appointments and training posts. Set the track to decide whether a role appears under Professional experience or Specialist training.',
    emptyTitle: 'No roles yet',
    emptyBody: 'Add a post to start building the experience timeline.',
    primary: (r) => r.designation,
    secondary: (r) => [r.institution, r.department].filter(Boolean).join(' — '),
    tertiary: (r) => [[r.startDate, r.endDate].filter(Boolean).join(' – '), r.track === 'training' ? 'Specialist training' : null].filter(Boolean).join('  ·  '),
    fields: [
      { name: 'designation', label: 'Designation', type: 'text', required: true, span: 1, placeholder: 'Senior Resident' },
      {
        name: 'track',
        label: 'Shown under',
        type: 'select',
        span: 1,
        options: [
          { value: 'experience', label: 'Professional experience' },
          { value: 'training', label: 'Specialist training' },
        ],
      },
      { name: 'department', label: 'Department', type: 'text', span: 2 },
      { name: 'institution', label: 'Institution', type: 'text', span: 2 },
      { name: 'location', label: 'Location', type: 'text', span: 1 },
      { name: 'startDate', label: 'Start', type: 'text', span: 1 },
      { name: 'endDate', label: 'End', type: 'text', span: 1 },
      { name: 'description', label: 'Description', type: 'textarea', span: 2 },
    ],
  },

  expertise: {
    path: '/expertise',
    title: 'Expertise',
    singular: 'area',
    breadcrumb: 'Expertise',
    intro:
      'Areas of practice. Featured areas appear in the numbered index; the rest are listed as documented areas of interest.',
    emptyTitle: 'No areas yet',
    emptyBody: 'Add an area of practice to build the expertise index.',
    primary: (r) => r.title,
    secondary: (r) => r.description,
    tertiary: (r) => [r.category, r.featured ? 'Featured' : null].filter(Boolean).join('  ·  '),
    fields: [
      { name: 'title', label: 'Area', type: 'text', required: true, span: 1 },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        span: 1,
        options: ['Reconstructive', 'Aesthetic'],
      },
      { name: 'description', label: 'Short note', type: 'text', span: 2, hint: 'Optional, e.g. "Surgical and non-surgical"' },
      {
        name: 'featured',
        label: 'Show in the numbered index',
        type: 'toggle',
        span: 2,
        hint: 'Leave off to list this as a documented area of interest instead.',
      },
      { name: 'image', label: 'Preview image', type: 'image', span: 2, hint: 'Optional. Shown when someone hovers this area on the public site.' },
    ],
  },

  awards: {
    path: '/awards',
    title: 'Credits & awards',
    singular: 'award',
    breadcrumb: 'Awards',
    intro: 'Academic distinctions, prizes and recognitions.',
    emptyTitle: 'No awards yet',
    emptyBody: 'Add a distinction to fill the Credits & awards section.',
    primary: (r) => r.title,
    secondary: (r) => r.subtitle || r.event,
    tertiary: (r) => r.year,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, span: 2 },
      { name: 'subtitle', label: 'Subtitle', type: 'text', span: 2, hint: 'A topic, citation or short qualifier.' },
      { name: 'event', label: 'Event or awarding body', type: 'text', span: 2 },
      { name: 'year', label: 'Year', type: 'text', span: 1 },
      { name: 'description', label: 'Description', type: 'textarea', span: 2 },
    ],
  },

  publications: {
    path: '/publications',
    title: 'Publications',
    singular: 'publication',
    breadcrumb: 'Publications',
    intro: 'Peer-reviewed papers, conference work and chapters.',
    emptyTitle: 'No publications yet',
    emptyBody: 'Add a paper to fill the Published work section.',
    primary: (r) => r.title,
    secondary: (r) => r.authors,
    tertiary: (r) => [r.year, r.journal, r.publicationType].filter(Boolean).join('  ·  '),
    fields: [
      { name: 'title', label: 'Title', type: 'textarea', rows: 2, required: true, span: 2 },
      { name: 'authors', label: 'Authors', type: 'textarea', rows: 2, span: 2, hint: 'As they appear in the citation.' },
      { name: 'year', label: 'Year', type: 'text', span: 1 },
      {
        name: 'publicationType',
        label: 'Type',
        type: 'select',
        span: 1,
        options: ['Journal article', 'Conference paper', 'Case report', 'Review', 'Chapter', 'Other'],
      },
      { name: 'journal', label: 'Journal or conference', type: 'text', span: 2 },
      { name: 'externalLink', label: 'DOI or link', type: 'text', span: 2, placeholder: 'https://doi.org/…' },
      { name: 'description', label: 'Description', type: 'textarea', span: 2 },
    ],
  },

  workshops: {
    path: '/workshops',
    title: 'Workshops',
    singular: 'workshop',
    breadcrumb: 'Workshops',
    intro:
      'Workshops and scientific meetings. This section stays hidden on the public site until you switch it on under Settings.',
    emptyTitle: 'No workshops yet',
    emptyBody: 'Add an event, then switch the Workshops section on under Settings to publish it.',
    primary: (r) => r.title,
    secondary: (r) => r.description,
    tertiary: (r) => [r.date, r.location, r.role].filter(Boolean).join('  ·  '),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, span: 2 },
      { name: 'date', label: 'Date', type: 'text', span: 1 },
      { name: 'location', label: 'Location', type: 'text', span: 1 },
      { name: 'role', label: 'Her role', type: 'text', span: 1, placeholder: 'Organiser' },
      { name: 'link', label: 'Link', type: 'text', span: 2 },
      { name: 'description', label: 'Description', type: 'textarea', span: 2 },
      { name: 'image', label: 'Image', type: 'image', span: 2 },
    ],
  },
};

/** Builds a blank record from a schema. */
export function blankRecord(schema) {
  const record = { visible: true };
  for (const f of schema.fields) {
    if (f.type === 'toggle') record[f.name] = false;
    else if (f.type === 'image') record[f.name] = { url: '', publicId: '', alt: '' };
    else if (f.type === 'select') record[f.name] = f.options[0]?.value ?? f.options[0] ?? '';
    else record[f.name] = '';
  }
  return record;
}
