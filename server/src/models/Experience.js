import mongoose from 'mongoose';
import { orderableFields } from './shared.js';

const experienceSchema = new mongoose.Schema(
  {
    designation: { type: String, required: true, trim: true },
    department: { type: String, trim: true, default: '' },
    institution: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    startDate: { type: String, trim: true, default: '' },
    endDate: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    // "experience" renders in Professional Experience; "training" in Specialist Training.
    track: { type: String, enum: ['experience', 'training'], default: 'experience', index: true },
    ...orderableFields,
  },
  { timestamps: true }
);

experienceSchema.index({ track: 1, order: 1 });
export default mongoose.model('Experience', experienceSchema);
