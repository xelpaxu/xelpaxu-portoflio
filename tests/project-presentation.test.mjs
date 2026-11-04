import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(name) {
  const context = { exports: {} };
  const source = fs.readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
  return context.exports;
}
const { getProjectPlatform, getImagePresentation } = load('project-presentation');
const { getProjectImages } = load('project-images');

test('classifies mobile, web, desktop and combined projects', () => {
  assert.equal(getProjectPlatform({ category: 'Agriculture', tags: ['Flutter', 'Dart'] }), 'mobile');
  assert.equal(getProjectPlatform({ category: 'Thesis / Web + mobile', tags: ['Next.js', 'React Native'] }), 'mixed');
  assert.equal(getProjectPlatform({ category: 'Desktop / Healthcare', tags: ['Flet', 'Python'] }), 'desktop');
  assert.equal(getProjectPlatform({ category: 'Multiplayer game', tags: ['Next.js', 'React'] }), 'web');
});

test('explicit project platform wins over stack inference', () => {
  assert.equal(getProjectPlatform({ platform: 'web', category: 'Mobile', tags: ['Flutter'] }), 'web');
});

test('portrait screenshots get a mobile layout in mixed and web galleries', () => {
  assert.equal(getImagePresentation({ src: '/capture.png', alt: '' }, 'mixed', { width: 390, height: 844 }), 'mobile');
  assert.equal(getImagePresentation({ src: '/capture.png', alt: '', width: 768, height: 1024 }, 'web'), 'mobile');
});

test('landscape artwork from a mobile project is not squeezed into a phone', () => {
  assert.equal(getImagePresentation({ src: '/cover.svg', alt: '' }, 'mobile'), 'artwork');
  assert.equal(getImagePresentation({ src: '/cover.png', alt: '' }, 'mobile', { width: 900, height: 560 }), 'artwork');
});

test('landscape captures retain the appropriate web or desktop presentation', () => {
  const image = { src: '/screen.png', alt: '', width: 1914, height: 989 };
  assert.equal(getImagePresentation(image, 'mixed'), 'web');
  assert.equal(getImagePresentation(image, 'desktop'), 'desktop');
});

test('per-image presentation overrides inferred aspect ratio', () => {
  assert.equal(getImagePresentation({ src: '/poster.png', alt: '', presentation: 'artwork', width: 400, height: 900 }, 'mobile'), 'artwork');
});

test('image normalization preserves display metadata and filters empty paths', () => {
  const images = getProjectImages({ title: 'Example', images: ['', '/one.png', { src: '/two.png', alt: 'A mobile screen', width: 390, height: 844, presentation: 'mobile' }] });
  assert.equal(images.length, 2);
  assert.equal(images[0].src, '/one.png');
  assert.equal(images[1].width, 390);
  assert.equal(images[1].height, 844);
  assert.equal(images[1].presentation, 'mobile');
});
