import deburr from 'lodash/deburr';

export function titleCase(value: string): string {
  const clean = deburr(value).toLowerCase();
  return clean.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function slugify(value: string): string {
  const clean = deburr(value).toLowerCase();
  return clean
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
