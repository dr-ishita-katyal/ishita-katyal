import mongoose from 'mongoose';
import { orderableFields, imageField } from './shared.js';

const expertiseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Reconstructive', 'Aesthetic'],
      default: 'Reconstructive',
      index: true,
    },
    description: { type: String, trim: true, default: '' },
    // Core areas appear in the numbered index; the rest sit in "documented areas of interest".
    featured: { type: Boolean, default: false, index: true },
    image: imageField,
    ...orderableFields,
  },
  { timestamps: true }
);

expertiseSchema.index({ category: 1, order: 1 });
export default mongoose.model('Expertise', expertiseSchema);
