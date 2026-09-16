import mongoose from 'mongoose';
import { imageField } from './shared.js';

/** Singleton: the doctor's identity and hero/about copy. */
const profileSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'profile', unique: true, immutable: true },
    name: { type: String, trim: true, default: 'Dr. Ishita Katyal' },
    title: { type: String, trim: true, default: 'Plastic, Reconstructive & Aesthetic Surgeon' },
    heroHeading: { type: String, trim: true, default: '' },
    heroSubtitle: { type: String, trim: true, default: '' },
    heroEyebrow: { type: String, trim: true, default: '' },
    shortBio: { type: String, trim: true, default: '' },
    longBio: { type: String, trim: true, default: '' },
    aboutHeading: { type: String, trim: true, default: '' },
    quote: { type: String, trim: true, default: '' },
    credentials: [
      {
        abbr: { type: String, trim: true },
        label: { type: String, trim: true },
      },
    ],
    credentialsNote: { type: String, trim: true, default: '' },
    profileImage: imageField,
    aboutImage: imageField,
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
