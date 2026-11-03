/* eslint-disable @next/next/no-img-element */
import { Fragment, type ReactNode } from 'react';
import type { BlogNode } from '@/types/blog';
import { blogFontSize, safeBlogUrl } from '@/lib/blog-content';

function renderNode(node: BlogNode, index: number): ReactNode {
  if (node.type === 'text') {
    let text: ReactNode = node.text ?? '';
    for (const mark of node.marks ?? []) {
      switch (mark.type) {
        case 'fontSize': {
          const size = blogFontSize(mark.attrs?.size);
          if (size) text = <span style={{ fontSize: `${size}px` }}>{text}</span>;
          break;
        }
        case 'bold': text = <strong>{text}</strong>; break;
        case 'italic': text = <em>{text}</em>; break;
        case 'underline': text = <u>{text}</u>; break;
        case 'strike': text = <s>{text}</s>; break;
        case 'code': text = <code>{text}</code>; break;
        case 'link': {
          const href = safeBlogUrl(mark.attrs?.href);
          if (href) text = <a href={href} rel="noopener noreferrer">{text}</a>;
          break;
        }
      }
    }
    return <Fragment key={index}>{text}</Fragment>;
  }
  const children = node.content?.map(renderNode);
  switch (node.type) {
    case 'doc': return <Fragment key={index}>{children}</Fragment>;
    case 'paragraph': return <p key={index}>{children?.length ? children : <br />}</p>;
    case 'heading': return node.attrs?.level === 3 ? <h3 key={index}>{children}</h3> : <h2 key={index}>{children}</h2>;
    case 'bulletList': return <ul key={index}>{children}</ul>;
    case 'orderedList': return <ol key={index} start={typeof node.attrs?.start === 'number' ? node.attrs.start : 1}>{children}</ol>;
    case 'listItem': return <li key={index}>{children}</li>;
    case 'blockquote': return <blockquote key={index}>{children}</blockquote>;
    case 'codeBlock': return <pre key={index}><code>{children}</code></pre>;
    case 'hardBreak': return <br key={index} />;
    case 'horizontalRule': return <hr key={index} />;
    case 'image': {
      const src = safeBlogUrl(node.attrs?.src, true);
      return src ? <figure key={index}><img src={src} alt={typeof node.attrs?.alt === 'string' ? node.attrs.alt : ''} loading="lazy" />{typeof node.attrs?.title === 'string' && node.attrs.title && <figcaption>{node.attrs.title}</figcaption>}</figure> : null;
    }
    default: return null;
  }
}
export default function BlogBody({ content }: { content: BlogNode }) {
  return <div className="blog-prose">{renderNode(content, 0)}</div>;
}
