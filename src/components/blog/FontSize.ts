import { Mark } from '@tiptap/react';
import { blogFontSize } from '@/lib/blog-content';

// A validated inline mark, so selected words can have their own size.
export const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return { size: { default: 16, parseHTML: element => blogFontSize(element.style.fontSize) ?? 16 } };
  },
  parseHTML() { return [{ tag: 'span[style*="font-size"]' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['span', { style: `font-size: ${blogFontSize(HTMLAttributes.size) ?? 16}px` }, 0];
  },
});
