export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product';
}

export function productSlug(name: string, id: string): string {
  return `${slugify(name)}--${id}`;
}

export function extractId(compound: string): string {
  const parts = compound.split('--');
  return parts[parts.length - 1];
}
