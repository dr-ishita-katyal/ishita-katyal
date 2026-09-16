import mongoose from 'mongoose';
import { orderableFields } from './shared.js';

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    fullDegreeName: { type: String, trim: true, default: '' },
    institution: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    startDate: { type: String, trim: true, default: '' },
    endDate: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    ...orderableFields,
  },
  { timestamps: true }
);

educationSchema.index({ order: 1, createdAt: 1 });
export default mongoose.model('Education', educationSchema);
