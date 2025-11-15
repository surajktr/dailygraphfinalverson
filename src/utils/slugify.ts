/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a random string if needed
 */
export function generateUniqueSlug(title: string, id?: string): string {
  const baseSlug = slugify(title || 'untitled');
  
  if (id) {
    // Use first 8 characters of ID for uniqueness
    return `${baseSlug}-${id.substring(0, 8)}`;
  }
  
  return baseSlug;
}
