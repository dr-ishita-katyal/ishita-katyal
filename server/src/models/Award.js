import mongoose from 'mongoose';
import { orderableFields } from './shared.js';

const awardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    event: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    ...orderableFields,
  },
  { timestamps: true }
);

awardSchema.index({ order: 1, createdAt: 1 });
export default mongoose.model('Award', awardSchema);
