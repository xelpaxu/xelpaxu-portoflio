import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(name) {
  const context = { exports: {}, Math };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
  return context.exports;
}
const { stepRat, ratEscape } = load('rat');
const { feedingFrame, FEED_DURATION } = load('rat-feeding');
const bounds = { left: 44, right: 656, top: 30, bottom: 108 };
const rat = () => ({ x: 90, y: 64, vx: 0, vy: 0, facing: 1 });

test('rat moves continuously in pixel space and settles at a target', () => {
  const animal = rat();
  let arrived = false;
  for (let i = 0; i < 600; i++) {
    const before = { ...animal };
    arrived = stepRat(animal, { x: 376.5, y: 83.25 }, 1 / 60, bounds);
    assert(Math.hypot(animal.x - before.x, animal.y - before.y) <= 85 / 60 + 0.01);
    assert(animal.x >= bounds.left && animal.x <= bounds.right && animal.y >= bounds.top && animal.y <= bounds.bottom);
  }
  assert(arrived);
  assert(Math.hypot(animal.x - 376.5, animal.y - 83.25) < 0.1);
});

test('escape heads away from the cat and is faster than ordinary walking', () => {
  const cat = { x: 80, y: 64 };
  const goal = ratEscape(cat, bounds);
  assert.equal(goal.x, bounds.right);
  const walking = rat(), fleeing = rat();
  for (let i = 0; i < 60; i++) { stepRat(walking, goal, 1 / 60, bounds); stepRat(fleeing, goal, 1 / 60, bounds, true); }
  assert(fleeing.x > walking.x + 80);
});

test('a long frame or coincident target cannot corrupt movement', () => {
  const animal = rat();
  stepRat(animal, animal, 0, bounds);
  stepRat(animal, { x: 1000, y: -1000 }, 5, bounds);
  assert(Number.isFinite(animal.x) && Number.isFinite(animal.y));
  assert(animal.y >= bounds.top && animal.x <= bounds.right);
});

test('feeding includes anticipation, pulling, chewing and completion', () => {
  assert.equal(feedingFrame(0).pull, 0);
  assert(feedingFrame(FEED_DURATION * 0.4).pull > 0);
  assert(feedingFrame(FEED_DURATION * 0.7).chew > 0);
  assert.equal(feedingFrame(FEED_DURATION - 0.01).done, false);
  assert.equal(feedingFrame(FEED_DURATION).done, true);
});
