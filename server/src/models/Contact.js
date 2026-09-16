import mongoose from 'mongoose';

/** Singleton: every contact detail shown anywhere on the site. */
const contactSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'contact', unique: true, immutable: true },
    heading: { type: String, trim: true, default: "Let's begin the conversation" },
    intro: {
      type: String,
      trim: true,
      default: 'For consultation and appointment enquiries, please get in touch.',
    },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    whatsapp: { type: String, trim: true, default: '' },
    clinicName: { type: String, trim: true, default: '' },
    clinicAddress: { type: String, trim: true, default: '' },
    consultingHours: { type: String, trim: true, default: '' },
    mapsLink: { type: String, trim: true, default: '' },
    appointmentUrl: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    otherLinks: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
