/**
 * Rendered when the API is unreachable, so the site never shows an empty page.
 * Mirrors the seeded content exactly — no invented details.
 */
const fallback = {
  profile: {
    name: 'Dr. Ishita Katyal',
    title: 'Plastic, Reconstructive & Aesthetic Surgeon',
    heroEyebrow: 'Plastic · Reconstructive · Aesthetic Surgery',
    heroHeading: 'Dr. Ishita Katyal',
    heroSubtitle:
      'Specialised in plastic, reconstructive and aesthetic surgery, with training and experience across leading institutions in Mumbai.',
    shortBio:
      'A Plastic, Reconstructive and Aesthetic Surgeon with specialist training in plastic and reconstructive surgery and experience across high-volume centres in Mumbai.',
    aboutHeading: 'A surgical practice rooted in precision',
    longBio:
      'Dr. Ishita Katyal is a Plastic, Reconstructive and Aesthetic Surgeon with specialist training in plastic and reconstructive surgery and experience across high-volume centres in Mumbai.\n\nHer training at Nair Hospital, a high-volume centre in Mumbai, built her expertise in rhinoplasty, trauma reconstruction, aesthetic procedures including abdominoplasty, breast reduction and gynaecomastia surgery, and burn management.\n\nShe has also worked at Tata Memorial Hospital, a centre of excellence for cancer management in India, where the department handles a high volume of head and neck reconstruction, breast reconstruction, and bone and soft tissue reconstruction.\n\nAlongside clinical work she has organised numerous workshops and scientific meetings, drawing on her organisational and communication skills.',
    quote: 'Improving outcomes and the quality of life of patients.',
    credentials: [
      { abbr: 'MBBS', label: 'Bachelor of Medicine and Surgery' },
      { abbr: 'MS', label: 'General Surgery' },
      { abbr: 'MCh', label: 'Plastic and Reconstructive Surgery' },
      { abbr: 'DrNB', label: 'Plastic and Reconstructive Surgery' },
    ],
    credentialsNote: 'Plastic & Reconstructive Surgery',
    profileImage: { url: '/images/dr-ishita-katyal.jpg', alt: 'Portrait of Dr. Ishita Katyal' },
    aboutImage: { url: '/images/dr-ishita-katyal.jpg', alt: 'Dr. Ishita Katyal' },
  },

  education: [
    { _id: 'e1', degree: 'MBBS', fullDegreeName: 'Bachelor of Medicine and Surgery', institution: 'Government Medical College, Nagpur', location: 'Nagpur', startDate: '2009', endDate: '2015' },
    { _id: 'e2', degree: 'MS', fullDegreeName: 'Master of Surgery — General Surgery', institution: 'Grant Medical College and JJ Group of Hospitals', location: 'Mumbai', startDate: '2016', endDate: '2019' },
    { _id: 'e3', degree: 'MCh', fullDegreeName: 'Master of Chirurgiae — Plastic and Reconstructive Surgery', institution: 'Topiwala National Medical College and BYL Nair Charitable Hospital', location: 'Mumbai', startDate: '2019', endDate: '2022' },
    { _id: 'e4', degree: 'DrNB', fullDegreeName: 'Doctorate of National Board — Plastic and Reconstructive Surgery', institution: 'National Board of Examinations', location: '', startDate: '', endDate: 'December 2022' },
  ],

  experience: [
    { _id: 'x1', designation: 'Assistant Professor', department: 'Department of Plastic and Reconstructive Surgery', institution: 'Topiwala National Medical College and BYL Nair Charitable Hospital', location: 'Mumbai', startDate: 'October 2022', endDate: 'July 2023', track: 'experience' },
    { _id: 'x2', designation: 'Visiting Trainee', department: 'Department of Plastic Surgery', institution: 'Tata Memorial Hospital', location: 'Mumbai', startDate: 'May 2021', endDate: 'July 2021', track: 'experience' },
    { _id: 'x3', designation: 'Senior Resident', department: 'Department of Plastic and Reconstructive Surgery', institution: 'Topiwala National Medical College and BYL Nair Charitable Hospital', location: 'Mumbai', startDate: 'August 2019', endDate: 'September 2022', track: 'experience' },
    { _id: 'x4', designation: 'Junior Resident', department: 'Department of General Surgery', institution: 'Grant Medical College and JJ Group of Hospitals', location: 'Mumbai', startDate: 'May 2016', endDate: 'June 2019', track: 'experience' },
    { _id: 't1', designation: 'Specialist Senior Resident', department: 'Plastic and Reconstructive Surgery', institution: 'Tata Memorial Hospital', location: 'Mumbai', startDate: 'August 2023', endDate: 'September 2024', description: 'Tata Memorial Hospital is a centre of excellence for cancer management in India, with a high volume of head and neck, breast, and bone and soft tissue reconstruction.', track: 'training' },
    { _id: 't2', designation: 'Cosmetic Fellowship', department: '', institution: '', location: '', startDate: '', endDate: '', description: 'Details to be updated.', track: 'training' },
  ],

  expertise: [
    { _id: 'p1', title: 'Breast Reconstruction', category: 'Reconstructive', featured: true },
    { _id: 'p2', title: 'Head & Neck Reconstruction', category: 'Reconstructive', featured: true },
    { _id: 'p3', title: 'Bone & Soft Tissue Reconstruction', category: 'Reconstructive', featured: true },
    { _id: 'p4', title: 'Trauma Reconstruction', category: 'Reconstructive', featured: true },
    { _id: 'p5', title: 'Burns', category: 'Reconstructive', featured: true },
    { _id: 'p6', title: 'Rhinoplasty', category: 'Aesthetic', featured: true },
    { _id: 'p7', title: 'Cosmetic Breast Surgeries', category: 'Aesthetic', featured: true },
    { _id: 'p8', title: 'Fat Grafting', category: 'Aesthetic', featured: true },
    { _id: 'p9', title: 'Facial Aesthetics', description: 'Surgical and non-surgical', category: 'Aesthetic', featured: true },
    { _id: 'p10', title: 'Abdominoplasty (Tummy Tuck)', category: 'Aesthetic' },
    { _id: 'p11', title: 'Breast Reduction', category: 'Aesthetic' },
    { _id: 'p12', title: 'Liposuction', category: 'Aesthetic' },
    { _id: 'p13', title: 'Thread Lift', category: 'Aesthetic' },
    { _id: 'p14', title: 'Botox', category: 'Aesthetic' },
    { _id: 'p15', title: 'Fillers', category: 'Aesthetic' },
    { _id: 'p16', title: 'Wrinkles Management', category: 'Aesthetic' },
    { _id: 'p17', title: 'Skin Rejuvenation', category: 'Aesthetic' },
    { _id: 'p18', title: 'PRP for Hair Loss', category: 'Aesthetic' },
    { _id: 'p19', title: 'SVF', category: 'Aesthetic' },
    { _id: 'p20', title: 'Mole Removal', category: 'Reconstructive' },
    { _id: 'p21', title: 'Burn & Scar Management', category: 'Reconstructive' },
  ],

  awards: [
    { _id: 'a1', title: 'Second Rank in State', subtitle: 'Highest marks in practicals', event: 'MCh (Plastic and Reconstructive Surgery) Examinations, Maharashtra University of Health Sciences', year: '' },
    { _id: 'a2', title: 'Best Poster', subtitle: 'Leiomyoma of Ovary Presenting as Right Inguinal Hernia', event: '78th Annual Conference (ASICON 2018), Chennai', year: '2018' },
    { _id: 'a3', title: 'Second Best Video Presentation', subtitle: '', event: 'ASICON 2018', year: '2018' },
    { _id: 'a4', title: 'Token of Appreciation', subtitle: 'For conducting the plastic surgery quiz for nursing staff', event: 'Tata Memorial Hospital', year: '2024' },
  ],

  publications: [
    {
      _id: 'pub1',
      title: 'Versatility and Outcomes of the "Mumbai Technique" of Stacked …',
      authors: 'Bhat, U., Pawar, M., Katyal, I., Peswani, A., Basu, S., Waghmare, S., Dhakad, A., & Dalmia, U.',
      year: '2024',
      journal: '',
      publicationType: 'Journal article',
      description: 'Full title and journal details to be completed from the original record.',
      externalLink: '',
    },
  ],

  workshops: [],
  gallery: [],

  contact: {
    heading: "Let's begin the conversation",
    intro: 'For consultation and appointment enquiries, please get in touch.',
    phone: '', email: '', whatsapp: '', clinicName: '', clinicAddress: '',
    consultingHours: '', mapsLink: '', appointmentUrl: '', instagram: '', linkedin: '', otherLinks: [],
  },

  settings: {
    siteTitle: 'Dr. Ishita Katyal | Plastic, Reconstructive & Aesthetic Surgeon',
    metaDescription:
      'Dr. Ishita Katyal is a Plastic, Reconstructive and Aesthetic Surgeon with specialist training and experience across leading medical institutions in Mumbai.',
    canonicalUrl: '',
    doctorName: 'Dr. Ishita Katyal',
    footerText: 'Plastic, Reconstructive & Aesthetic Surgeon',
    medicalDisclaimer:
      'The information provided on this website is for general informational purposes only and is not a substitute for professional medical advice, diagnosis or treatment. Individual treatment plans are determined following consultation and clinical evaluation.',
    privacyPolicy:
      'This website does not collect personal information beyond what you choose to send through the contact details listed here. Enquiries are used only to respond to you and are not shared with third parties.',
    sections: { workshops: false, gallery: false, publications: true, awards: true, specialistTraining: true },
  },
};

export default fallback;
