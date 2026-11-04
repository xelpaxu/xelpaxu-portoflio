import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const context = { exports: {} };
const source = fs.readFileSync(new URL('../src/data/projects/project-details.ts', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const details = context.exports.projectDetails;
const projectSource = fs.readFileSync(new URL('../src/data/projects/projects.ts', import.meta.url), 'utf8');
const projectIds = [...projectSource.matchAll(/"id": "([^"]+)"/g)].map(match => match[1]);

test('every portfolio project has feature groups and workflows', () => {
  assert.deepEqual(Object.keys(details).sort(), projectIds.sort());
});

test('feature inventories contain real descriptions and unique titles', () => {
  for (const [id, detail] of Object.entries(details)) {
    assert(detail.featureGroups.length >= 2, `${id}: group the capabilities by functional area`);
    const groupTitles = new Set();
    const featureTitles = new Set();
    for (const group of detail.featureGroups) {
      assert(!groupTitles.has(group.title), `${id}: duplicate group key`);
      groupTitles.add(group.title);
      assert(group.summary.length > 20);
      assert(group.features.length > 0);
      for (const feature of group.features) {
        assert(!featureTitles.has(feature.title), `${id}: duplicate feature key`);
        featureTitles.add(feature.title);
        assert(feature.title.length > 5);
        assert(feature.description.length > 30);
        assert(!/TODO|lorem ipsum|coming soon/i.test(feature.description));
      }
    }
    assert(featureTitles.size >= 4, `${id}: do not fall back to three generic bullets`);
  }
});

test('journeys have unique steps with actors, actions, and results', () => {
  for (const [id, detail] of Object.entries(details)) {
    const journeyIds = new Set();
    assert(detail.journeys.length > 0);
    for (const journey of detail.journeys) {
      assert(!journeyIds.has(journey.id), `${id}: duplicate journey key`);
      journeyIds.add(journey.id);
      assert(journey.steps.length >= 4);
      const stepTitles = new Set();
      for (const step of journey.steps) {
        assert(!stepTitles.has(step.title), `${id}: duplicate workflow step key`);
        stepTitles.add(step.title);
        assert(step.actor.length > 2);
        assert(step.description.length > 30);
        assert(step.result.length > 20);
      }
    }
  }
});

test('specification-derived and prototype copy retains its limits', () => {
  assert.match(JSON.stringify(details.encast), /specification|documented/);
  assert.match(JSON.stringify(details.memowee), /prototype/);
  assert.match(JSON.stringify(details.visaia), /distinct from an always-running background upload/);
});
