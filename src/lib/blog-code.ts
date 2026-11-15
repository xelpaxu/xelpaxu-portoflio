import { common, createLowlight } from 'lowlight';

export const codeHighlighter = createLowlight(common);
export const codeLanguages = [
  ['plaintext', 'Plain text'], ['javascript', 'JavaScript'], ['typescript', 'TypeScript'],
  ['jsx', 'JSX'], ['tsx', 'TSX'], ['xml', 'HTML'], ['css', 'CSS'], ['json', 'JSON'], ['python', 'Python'],
  ['bash', 'Shell'], ['sql', 'SQL'], ['java', 'Java'], ['csharp', 'C#'],
  ['cpp', 'C++'], ['go', 'Go'], ['rust', 'Rust'], ['php', 'PHP'],
  ['ruby', 'Ruby'], ['yaml', 'YAML'], ['markdown', 'Markdown'],
] as const;

export function codeLanguage(value: unknown): string {
  return typeof value === 'string' && codeHighlighter.registered(value) ? value : 'plaintext';
}

export function codeLanguageLabel(value: string): string {
  return codeLanguages.find(([language]) => language === value)?.[1] ?? value;
}
