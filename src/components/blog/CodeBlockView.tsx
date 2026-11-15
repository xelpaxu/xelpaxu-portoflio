'use client';

import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { codeLanguage, codeLanguages } from '@/lib/blog-code';

export default function CodeBlockView({ node, updateAttributes }: NodeViewProps) {
  const language = codeLanguage(node.attrs.language);
  return <NodeViewWrapper className="blog-code-block">
    <div className="blog-code-header" contentEditable={false}>
      <label>Language
        <select aria-label="Code block language" value={language} onChange={event => updateAttributes({ language: event.target.value })}>
          {!codeLanguages.some(([value]) => value === language) && <option value={language}>{language}</option>}
          {codeLanguages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
    </div>
    <pre><NodeViewContent<'code'> as="code" className={`language-${language}`} style={{ whiteSpace: 'pre' }} spellCheck={false} /></pre>
  </NodeViewWrapper>;
}
