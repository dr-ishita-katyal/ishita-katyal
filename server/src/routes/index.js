import { Router } from 'express';

import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Expertise from '../models/Expertise.js';
import Award from '../models/Award.js';
import Publication from '../models/Publication.js';
import Workshop from '../models/Workshop.js';
import Profile from '../models/Profile.js';
import Contact from '../models/Contact.js';
import SiteSettings from '../models/SiteSettings.js';
import GalleryModel from '../models/Gallery.js';

import authRoutes from './auth.js';
import galleryRoutes from './gallery.js';
import uploadRoutes from './upload.js';
import { resourceRouter } from './resource.js';
import { singletonRouter } from './singleton.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/ApiError.js';
import { destroyAsset } from '../config/cloudinary.js';

const router = Router();

router.use('/auth', authRoutes);

router.use(
  '/profile',
  singletonRouter(Profile, [
    'name', 'title', 'heroHeading', 'heroSubtitle', 'heroEyebrow',
    'shortBio', 'longBio', 'aboutHeading', 'quote',
    'credentials', 'credentialsNote', 'profileImage', 'aboutImage',
  ])
);

router.use(
  '/contact',
  singletonRouter(Contact, [
    'heading', 'intro', 'phone', 'email', 'whatsapp', 'clinicName', 'clinicAddress',
    'consultingHours', 'mapsLink', 'appointmentUrl', 'instagram', 'linkedin', 'otherLinks',
  ])
);

router.use(
  '/settings',
  singletonRouter(SiteSettings, [
    'siteTitle', 'metaDescription', 'canonicalUrl', 'ogImage', 'favicon',
    'doctorName', 'footerText', 'medicalDisclaimer', 'privacyPolicy', 'sections',
  ])
);

router.use(
  '/education',
  resourceRouter(Education, {
    allowed: ['degree', 'fullDegreeName', 'institution', 'location', 'startDate', 'endDate', 'description', 'order', 'visible'],
  })
);

router.use(
  '/experience',
  resourceRouter(Experience, {
    allowed: ['designation', 'department', 'institution', 'location', 'startDate', 'endDate', 'description', 'track', 'order', 'visible'],
  })
);

router.use(
  '/expertise',
  resourceRouter(Expertise, {
    allowed: ['title', 'category', 'description', 'featured', 'image', 'order', 'visible'],
    onDelete: (doc) => destroyAsset(doc.image?.publicId),
  })
);

router.use(
  '/awards',
  resourceRouter(Award, {
    allowed: ['title', 'subtitle', 'event', 'year', 'description', 'order', 'visible'],
  })
);

router.use(
  '/publications',
  resourceRouter(Publication, {
    allowed: ['title', 'authors', 'year', 'journal', 'publicationType', 'description', 'externalLink', 'order', 'visible'],
  })
);

router.use(
  '/workshops',
  resourceRouter(Workshop, {
    allowed: ['title', 'description', 'date', 'location', 'role', 'link', 'image', 'order', 'visible'],
    onDelete: (doc) => destroyAsset(doc.image?.publicId),
  })
);

router.use('/gallery', galleryRoutes);
router.use('/upload', uploadRoutes);

/** Everything the public site needs, in one request. */
router.get(
  '/site',
  asyncHandler(async (req, res) => {
    const visible = { visible: true };
    const sort = { order: 1, createdAt: 1 };

    const [profile, contact, settings, education, experience, expertise, awards, publications, workshops, gallery] =
      await Promise.all([
        Profile.findOne().lean(),
        Contact.findOne().lean(),
        SiteSettings.findOne().lean(),
        Education.find(visible).sort(sort).lean(),
        Experience.find(visible).sort(sort).lean(),
        Expertise.find(visible).sort(sort).lean(),
        Award.find(visible).sort(sort).lean(),
        Publication.find(visible).sort(sort).lean(),
        Workshop.find(visible).sort(sort).lean(),
        GalleryModel.find(visible).sort(sort).lean(),
      ]);

    res.set('Cache-Control', 'public, max-age=60');
    res.json({ profile, contact, settings, education, experience, expertise, awards, publications, workshops, gallery });
  })
);

/** Counts for the dashboard. */
router.get(
  '/stats',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const [education, experience, expertise, awards, publications, workshops, gallery] = await Promise.all([
      Education.countDocuments(),
      Experience.countDocuments(),
      Expertise.countDocuments(),
      Award.countDocuments(),
      Publication.countDocuments(),
      Workshop.countDocuments(),
      GalleryModel.countDocuments(),
    ]);
    const [profile, contact] = await Promise.all([Profile.findOne().lean(), Contact.findOne().lean()]);

    res.json({
      counts: { education, experience, expertise, awards, publications, workshops, gallery },
      profileComplete: Boolean(profile?.longBio && profile?.profileImage?.url),
      contactComplete: Boolean(contact?.email || contact?.phone),
    });
  })
);

export default router;
