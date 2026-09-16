import mongoose from 'mongoose';
import { orderableFields } from './shared.js';

const publicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    authors: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
    journal: { type: String, trim: true, default: '' },
    publicationType: {
      type: String,
      enum: ['Journal article', 'Conference paper', 'Case report', 'Review', 'Chapter', 'Other'],
      default: 'Journal article',
    },
    description: { type: String, trim: true, default: '' },
    externalLink: { type: String, trim: true, default: '' },
    ...orderableFields,
  },
  { timestamps: true }
);

publicationSchema.index({ order: 1, year: -1 });
export default mongoose.model('Publication', publicationSchema);
