import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { getSchema } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

// Exercise real route handlers and file writes in an isolated temporary project.
test('local blog workflow and production boundaries', async t => {
  const workspace = process.cwd();
  const directory = await mkdtemp(path.join(tmpdir(), 'devport-blog-check-'));
  const sourceFiles = {
    'blog-content': 'src/lib/blog-content.ts',
    'blog-local': 'src/lib/blog-local.ts',
    posts: 'src/app/api/blog/local/posts/route.ts',
    upload: 'src/app/api/blog/local/upload/route.ts',
  };
  for (const [name, file] of Object.entries(sourceFiles)) {
    const source = await readFile(path.join(workspace, file), 'utf8');
    const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
      .replaceAll('@/lib/blog-local', './blog-local.mjs').replaceAll('@/lib/blog-content', './blog-content.mjs');
    await writeFile(path.join(directory, `${name}.mjs`), output);
  }
  const fontSource = await readFile(path.join(workspace, 'src/components/blog/FontSize.ts'), 'utf8');
  const fontOutput = ts.transpileModule(fontSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
    .replaceAll('@tiptap/react', import.meta.resolve('@tiptap/react')).replaceAll('@/lib/blog-content', './blog-content.mjs');
  await writeFile(path.join(directory, 'font-size.mjs'), fontOutput);
  const bodySource = await readFile(path.join(workspace, 'src/components/blog/BlogBody.tsx'), 'utf8');
  const bodyOutput = ts.transpileModule(bodySource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
    .replaceAll('react/jsx-runtime', import.meta.resolve('react/jsx-runtime'))
    .replaceAll("from 'react'", `from '${import.meta.resolve('react')}'`)
    .replaceAll('@/lib/blog-content', './blog-content.mjs');
  await writeFile(path.join(directory, 'blog-body.mjs'), bodyOutput);
  const { FontSize } = await import(pathToFileURL(path.join(directory, 'font-size.mjs')).href);
  const { default: BlogBody } = await import(pathToFileURL(path.join(directory, 'blog-body.mjs')).href);
  await mkdir(path.join(directory, 'src/data'), { recursive: true });
  await writeFile(path.join(directory, 'src/data/blogs.ts'), await readFile(path.join(workspace, 'src/data/blogs.ts')));
  const posts = await import(pathToFileURL(path.join(directory, 'posts.mjs')).href);
  const upload = await import(pathToFileURL(path.join(directory, 'upload.mjs')).href);
  const { allowLocalBlog } = await import(pathToFileURL(path.join(directory, 'blog-local.mjs')).href);
  const originalEnvironment = process.env.NODE_ENV;
  process.chdir(directory);
  const url = 'http://localhost:3000/api/blog/local/posts';
  const read = () => posts.GET(new Request(url, { headers: { host: 'localhost:3000' } }));
  const write = data => posts.POST(new Request(url, { method: 'POST', headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'Content-Type': 'application/json' }, body: JSON.stringify(data) }));
  const post = {
    title: 'Test article', slug: 'test-article', excerpt: 'A temporary test.', tags: ['Testing'], status: 'draft', cover: '',
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello from the editor', marks: [{ type: 'bold' }, { type: 'fontSize', attrs: { size: 24 } }] }] }] },
  };
  try {
    process.env.NODE_ENV = 'production';
    await t.test('editing and uploads return 404 in production', async () => {
      assert.equal((await read()).status, 404);
      assert.equal((await write({ post })).status, 404);
      assert.equal((await upload.POST(new Request(url, { method: 'POST' }))).status, 404);
    });
    process.env.NODE_ENV = 'development';
    await t.test('only loopback hosts and same-origin writes are accepted', () => {
      assert.equal(allowLocalBlog(new Request(url, { headers: { host: 'localhost:3000' } })), true);
      assert.equal(allowLocalBlog(new Request(url, { headers: { host: '192.168.1.2:3000' } })), false);
      assert.equal(allowLocalBlog(new Request(url, { headers: { host: 'localhost:3000', origin: 'https://other.example' } }), true), false);
      assert.equal(allowLocalBlog(new Request(url, { headers: { host: 'localhost:3000' } }), true), false);
    });
    await t.test('font sizes round trip through the editor schema and public renderer', () => {
      const schema = getSchema([StarterKit, FontSize]);
      const document = schema.nodeFromJSON(post.content);
      const sizeMark = document.firstChild.firstChild.marks.find(mark => mark.type.name === 'fontSize');
      assert.equal(sizeMark.attrs.size, 24);
      assert.deepEqual(sizeMark.type.spec.toDOM(sizeMark), ['span', { style: 'font-size: 24px' }, 0]);
      const html = renderToStaticMarkup(createElement(BlogBody, { content: document.toJSON() }));
      assert.ok(html.includes('font-size:24px'));
      assert.ok(html.includes('<strong>'));
    });
    let current = await (await read()).json();
    let saved;
    await t.test('draft saves to a valid blogs.ts file', async () => {
      const response = await write({ revision: current.revision, post });
      assert.equal(response.status, 200);
      saved = await response.json();
      assert.equal(saved.post.status, 'draft');
      const content = await readFile(path.join(directory, 'src/data/blogs.ts'), 'utf8');
      assert.ok(content.includes('export const blogs: BlogPost[] = ['));
      assert.ok(content.includes('Hello from the editor'));
      assert.equal((await (await read()).json()).revision, saved.revision);
    });
    await t.test('stale revisions cannot overwrite a newer file', async () => {
      assert.equal((await write({ revision: current.revision, post })).status, 409);
    });
    await t.test('publishing preserves the ID and formatting', async () => {
      const response = await write({ revision: saved.revision, post: { ...saved.post, status: 'published' } });
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.post.id, saved.post.id);
      assert.ok(result.post.publishedAt);
      assert.equal(result.post.content.content[0].content[0].marks[0].type, 'bold');
      assert.deepEqual(result.post.content.content[0].content[0].marks[1], { type: 'fontSize', attrs: { size: 24 } });
      current = result;
    });
    await t.test('invalid URLs, traversal, and unknown formatting are rejected', async () => {
      for (const changes of [
        { slug: '../escape' },
        { content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'bad size', marks: [{ type: 'fontSize', attrs: { size: 999 } }] }] }] } },
        { content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'bad size', marks: [{ type: 'fontSize', attrs: { size: '16px; color: red' } }] }] }] } },
        { cover: 'javascript:alert(1)' },
        { content: { type: 'doc', content: [{ type: 'script', text: 'bad' }] } },
        { content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] }] } },
      ]) assert.equal((await write({ revision: current.revision, post: { ...current.post, ...changes } })).status, 400);
    });
    await t.test('simultaneous saves cannot overwrite newer edits', async () => {
      const data = { revision: current.revision, post: current.post };
      const results = await Promise.all([write(data), write(data)]);
      assert.deepEqual(results.map(response => response.status).sort(), [200, 409]);
    });
    await t.test('raster upload saves locally and SVG is rejected', async () => {
      const form = new FormData();
      const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=', 'base64');
      form.set('image', new File([png], '../../example.png', { type: 'image/png' }));
      const request = body => new Request('http://localhost:3000/api/blog/local/upload', { method: 'POST', headers: { host: 'localhost:3000', origin: 'http://localhost:3000' }, body });
      const response = await upload.POST(request(form));
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.match(result.url, /^\/assets\/blog\/[0-9]+-[a-f0-9]+\.png$/);
      assert.deepEqual(await readFile(path.join(directory, 'public', result.url)), png);
      const svg = new FormData(); svg.set('image', new File(['<svg />'], 'bad.svg', { type: 'image/svg+xml' }));
      assert.equal((await upload.POST(request(svg))).status, 400);
    });
  } finally { process.chdir(workspace); process.env.NODE_ENV = originalEnvironment; }
});
