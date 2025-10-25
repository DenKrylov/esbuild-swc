import type { ReactNode } from 'react';
import { createElement } from 'react';

export { add, average, multiply } from './math';
export { slugify, titleCase } from './string';

export interface HighlightProps {
  children: ReactNode;
}

export function Highlight({ children }: HighlightProps) {
  return createElement('mark', { className: 'hw-highlight' }, children);
}
