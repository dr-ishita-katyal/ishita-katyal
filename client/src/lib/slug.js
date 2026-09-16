/** Turns a title into a URL-safe slug, e.g. "Facial Aesthetics" -> "facial-aesthetics". */
export function slugify(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Finds an expertise item whose title slugifies to the given slug. */
export function findBySlug(items = [], slug = '') {
  return items.find((item) => slugify(item.title) === slug);
}