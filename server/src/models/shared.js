/** Fields every orderable, hideable content item carries. */
export const orderableFields = {
  order: { type: Number, default: 0, index: true },
  visible: { type: Boolean, default: true, index: true },
};

/** A Cloudinary-backed image reference. */
export const imageField = {
  url: { type: String, trim: true, default: '' },
  publicId: { type: String, trim: true, default: '' },
  alt: { type: String, trim: true, default: '' },
};
