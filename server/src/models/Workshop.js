import mongoose from 'mongoose';
import { orderableFields, imageField } from './shared.js';

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    date: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    link: { type: String, trim: true, default: '' },
    image: imageField,
    ...orderableFields,
  },
  { timestamps: true }
);

workshopSchema.index({ order: 1, createdAt: -1 });
export default mongoose.model('Workshop', workshopSchema);
