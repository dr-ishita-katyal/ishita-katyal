/**
 * Rewrites a Cloudinary URL to request an optimised, correctly sized image.
 * Non-Cloudinary URLs (like the bundled portrait) pass through untouched.
 */
export function cdn(url, { width, height, crop = 'fill', gravity = 'auto' } = {}) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const parts = ['f_auto', 'q_auto:good'];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) parts.push(`c_${crop}`, `g_${gravity}`, 'dpr_auto');

  return url.replace('/upload/', `/upload/${parts.join(',')}/`);
}

/** Builds a srcSet across common layout widths. */
export function cdnSrcSet(url, widths = [480, 768, 1024, 1440]) {
  if (!url || !url.includes('res.cloudinary.com')) return undefined;
  return widths.map((w) => `${cdn(url, { width: w, crop: 'limit', gravity: undefined })} ${w}w`).join(', ');
}
