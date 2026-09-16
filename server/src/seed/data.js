/**
 * Every value here comes from the supplied CV / profile material.
 * Nothing in this file is invented. Where a detail was not supplied it is left
 * blank on purpose so the doctor can fill it in from the admin panel.
 */

export const profile = {
  name: 'Dr. Ishita Katyal',
  title: 'Plastic, Reconstructive & Aesthetic Surgeon',
  heroEyebrow: 'Plastic · Reconstructive · Aesthetic Surgery',
  heroHeading: 'Dr. Ishita Katyal',
  heroSubtitle:
    'Specialised in plastic, reconstructive and aesthetic surgery, with training and experience across leading institutions in Mumbai.',
  shortBio:
    'A Plastic, Reconstructive and Aesthetic Surgeon with specialist training in plastic and reconstructive surgery and experience across high-volume centres in Mumbai.',
  aboutHeading: 'A surgical practice rooted in precision',
  longBio: [
    'I am a Plastic, Reconstructive and Aesthetic Surgeon with specialist training in plastic and reconstructive surgery and experience across high-volume centres in Mumbai.',
    'My training at Nair Hospital, a high-volume centre in Mumbai, built my expertise in rhinoplasty, trauma reconstruction, aesthetic procedures including abdominoplasty, breast reduction and gynaecomastia surgery, and burn management.',
    'I have also worked at Tata Memorial Hospital, a centre of excellence for cancer management in India, where the department handles a high volume of head and neck reconstruction, breast reconstruction, and bone and soft tissue reconstruction.',
    'Alongside clinical work I have organised numerous workshops and scientific meetings, drawing on my organisational and communication skills.',
  ].join('\n\n'),
  quote: 'Improving outcomes and the quality of life of patients.',
  credentials: [
    { abbr: 'MBBS', label: 'Bachelor of Medicine and Surgery' },
    { abbr: 'MS', label: 'General Surgery' },
    { abbr: 'MCh', label: 'Plastic and Reconstructive Surgery' },
    { abbr: 'DrNB', label: 'Plastic and Reconstructive Surgery' },
  ],
  credentialsNote: 'Plastic & Reconstructive Surgery',
  profileImage: { url: '/images/dr-ishita-katyal.jpg', publicId: '', alt: 'Portrait of Dr. Ishita Katyal' },
  aboutImage: { url: '/images/dr-ishita-katyal.jpg', publicId: '', alt: 'Dr. Ishita Katyal' },
};

export const education = [
  {
    degree: 'MBBS',
    fullDegreeName: 'Bachelor of Medicine and Surgery',
    institution: 'Government Medical College, Nagpur',
    location: 'Nagpur',
    startDate: '2009',
    endDate: '2015',
    order: 0,
  },
  {
    degree: 'MS',
    fullDegreeName: 'Master of Surgery — General Surgery',
    institution: 'Grant Medical College and JJ Group of Hospitals',
    location: 'Mumbai',
    startDate: '2016',
    endDate: '2019',
    order: 1,
  },
  {
    degree: 'MCh',
    fullDegreeName: 'Master of Chirurgiae — Plastic and Reconstructive Surgery',
    institution: 'Topiwala National Medical College and BYL Nair Charitable Hospital',
    location: 'Mumbai',
    startDate: '2019',
    endDate: '2022',
    order: 2,
  },
  {
    degree: 'DrNB',
    fullDegreeName: 'Doctorate of National Board — Plastic and Reconstructive Surgery',
    institution: 'National Board of Examinations',
    location: '',
    startDate: '',
    endDate: 'December 2022',
    order: 3,
  },
];

export const experience = [
  {
    designation: 'Assistant Professor',
    department: 'Department of Plastic and Reconstructive Surgery',
    institution: 'Topiwala National Medical College and BYL Nair Charitable Hospital',
    location: 'Mumbai',
    startDate: 'October 2022',
    endDate: 'July 2023',
    track: 'experience',
    order: 0,
  },
  {
    designation: 'Visiting Trainee',
    department: 'Department of Plastic Surgery',
    institution: 'Tata Memorial Hospital',
    location: 'Mumbai',
    startDate: 'May 2021',
    endDate: 'July 2021',
    track: 'experience',
    order: 1,
  },
  {
    designation: 'Senior Resident',
    department: 'Department of Plastic and Reconstructive Surgery',
    institution: 'Topiwala National Medical College and BYL Nair Charitable Hospital',
    location: 'Mumbai',
    startDate: 'August 2019',
    endDate: 'September 2022',
    track: 'experience',
    order: 2,
  },
  {
    designation: 'Junior Resident',
    department: 'Department of General Surgery',
    institution: 'Grant Medical College and JJ Group of Hospitals',
    location: 'Mumbai',
    startDate: 'May 2016',
    endDate: 'June 2019',
    track: 'experience',
    order: 3,
  },
  {
    designation: 'Specialist Senior Resident',
    department: 'Plastic and Reconstructive Surgery',
    institution: 'Tata Memorial Hospital',
    location: 'Mumbai',
    startDate: 'August 2023',
    endDate: 'September 2024',
    description:
      'Tata Memorial Hospital is a centre of excellence for cancer management in India, with a high volume of head and neck, breast, and bone and soft tissue reconstruction.',
    track: 'training',
    order: 0,
  },
  {
    designation: 'Cosmetic Fellowship',
    department: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: 'Details to be updated.',
    track: 'training',
    order: 1,
  },
];

// The nine areas listed on the CV carry `featured: true` and appear in the numbered index.
// The remaining entries come from the Balco Medical Centre profile's listed interests.
export const expertise = [
  { title: 'Breast Reconstruction', category: 'Reconstructive', featured: true, order: 0 },
  { title: 'Head & Neck Reconstruction', category: 'Reconstructive', featured: true, order: 1 },
  { title: 'Bone & Soft Tissue Reconstruction', category: 'Reconstructive', featured: true, order: 2 },
  { title: 'Trauma Reconstruction', category: 'Reconstructive', featured: true, order: 3 },
  { title: 'Burns', category: 'Reconstructive', featured: true, order: 4 },
  { title: 'Rhinoplasty', category: 'Aesthetic', featured: true, order: 5 },
  { title: 'Cosmetic Breast Surgeries', category: 'Aesthetic', featured: true, order: 6 },
  { title: 'Fat Grafting', category: 'Aesthetic', featured: true, order: 7 },
  {
    title: 'Facial Aesthetics',
    description: 'Surgical and non-surgical',
    category: 'Aesthetic',
    featured: true,
    order: 8,
  },

  { title: 'Abdominoplasty (Tummy Tuck)', category: 'Aesthetic', order: 20 },
  { title: 'Breast Reduction', category: 'Aesthetic', order: 21 },
  { title: 'Liposuction', category: 'Aesthetic', order: 22 },
  { title: 'Thread Lift', category: 'Aesthetic', order: 23 },
  { title: 'Botox', category: 'Aesthetic', order: 24 },
  { title: 'Fillers', category: 'Aesthetic', order: 25 },
  { title: 'Wrinkles Management', category: 'Aesthetic', order: 26 },
  { title: 'Skin Rejuvenation', category: 'Aesthetic', order: 27 },
  { title: 'PRP for Hair Loss', category: 'Aesthetic', order: 28 },
  { title: 'SVF', category: 'Aesthetic', order: 29 },
  { title: 'Mole Removal', category: 'Reconstructive', order: 30 },
  { title: 'Burn & Scar Management', category: 'Reconstructive', order: 31 },
];

export const awards = [
  {
    title: 'Second Rank in State',
    subtitle: 'Highest marks in practicals',
    event: 'MCh (Plastic and Reconstructive Surgery) Examinations, Maharashtra University of Health Sciences',
    year: '',
    order: 0,
  },
  {
    title: 'Best Poster',
    subtitle: 'Leiomyoma of Ovary Presenting as Right Inguinal Hernia',
    event: '78th Annual Conference (ASICON 2018), Chennai',
    year: '2018',
    order: 1,
  },
  {
    title: 'Second Best Video Presentation',
    subtitle: '',
    event: 'ASICON 2018',
    year: '2018',
    order: 2,
  },
  {
    title: 'Token of Appreciation',
    subtitle: 'For conducting the plastic surgery quiz for nursing staff',
    event: 'Tata Memorial Hospital',
    year: '2024',
    order: 3,
  },
];

export const publications = [
  {
    // The supplied source cuts off mid-title; the remainder is deliberately not filled in.
    title: 'Versatility and Outcomes of the "Mumbai Technique" of Stacked …',
    authors:
      'Bhat, U., Pawar, M., Katyal, I., Peswani, A., Basu, S., Waghmare, S., Dhakad, A., & Dalmia, U.',
    year: '2024',
    journal: '',
    publicationType: 'Journal article',
    description: 'Full title and journal details to be completed from the original record.',
    externalLink: '',
    order: 0,
  },
];

export const contact = {
  heading: "Let's begin the conversation",
  intro: 'For consultation and appointment enquiries, please get in touch.',
  // Left blank on purpose — no contact details were supplied. Fill these in from /admin/contact.
  phone: '',
  email: '',
  whatsapp: '',
  clinicName: '',
  clinicAddress: '',
  consultingHours: '',
  mapsLink: '',
  appointmentUrl: '',
  instagram: '',
  linkedin: '',
  otherLinks: [],
};

export const settings = {
  siteTitle: 'Dr. Ishita Katyal | Plastic, Reconstructive & Aesthetic Surgeon',
  metaDescription:
    'Dr. Ishita Katyal is a Plastic, Reconstructive and Aesthetic Surgeon with specialist training and experience across leading medical institutions in Mumbai.',
  canonicalUrl: '',
  // Designed card shown when the site is shared on WhatsApp/social, rather than
  // the bare portrait. Replaceable any time from Admin → Settings → Share image.
  ogImage: {
    url: '/images/og-share-card.jpg',
    publicId: '',
    alt: 'Dr. Ishita Katyal — Plastic, Reconstructive & Aesthetic Surgeon',
  },
  doctorName: 'Dr. Ishita Katyal',
  footerText: 'Plastic, Reconstructive & Aesthetic Surgeon',
  medicalDisclaimer:
    'The information provided on this website is for general informational purposes only and is not a substitute for professional medical advice, diagnosis or treatment. Individual treatment plans are determined following consultation and clinical evaluation.',
  privacyPolicy:
    'This website does not collect personal information beyond what you choose to send through the contact details listed here. Enquiries are used only to respond to you and are not shared with third parties.',
  sections: {
    workshops: false,
    gallery: false,
    publications: true,
    awards: true,
    specialistTraining: true,
  },
};