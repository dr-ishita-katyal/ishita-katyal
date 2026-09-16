import mongoose from 'mongoose';
import { imageField } from './shared.js';

/** Singleton: SEO, footer and section visibility. */
const settingsSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'settings', unique: true, immutable: true },
    siteTitle: {
      type: String,
      trim: true,
      default: 'Dr. Ishita Katyal | Plastic, Reconstructive & Aesthetic Surgeon',
    },
    metaDescription: { type: String, trim: true, default: '' },
    canonicalUrl: { type: String, trim: true, default: '' },
    ogImage: imageField,
    favicon: imageField,
    doctorName: { type: String, trim: true, default: 'Dr. Ishita Katyal' },
    footerText: { type: String, trim: true, default: '' },
    medicalDisclaimer: { type: String, trim: true, default: '' },
    privacyPolicy: { type: String, trim: true, default: '' },
    // Sections the doctor can switch off entirely from the dashboard.
    sections: {
      workshops: { type: Boolean, default: false },
      gallery: { type: Boolean, default: false },
      publications: { type: Boolean, default: true },
      awards: { type: Boolean, default: true },
      specialistTraining: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', settingsSchema);
