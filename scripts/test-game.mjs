// Unit checks for the QA Bug Hunter data and scoring. Run with `npm test`.
import assert from 'node:assert/strict';
import {
  BANKS, DIFFICULTIES, ROUND_SIZE, buildRound, caseWorth, gradeCases, initialState, maxCaseValue, reducer, summarize,
} from '../src/components/game/gameLogic.js';

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`PASS  ${name}`);
};

// Seeded RNG so the checks are repeatable.
const seeded = (seed) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

test('Find the Bug has at least 8 scenarios and all banks have unique ids', () => {
  assert.ok(BANKS['find-bug'].length >= 8);
  for (const [mode, bank] of Object.entries(BANKS)) {
    assert.equal(new Set(bank.map((q) => q.id)).size, bank.length, `duplicate ids in ${mode}`);
  }
});

test('Every level has questions in every mode', () => {
  for (const [mode, bank] of Object.entries(BANKS)) {
    for (const d of DIFFICULTIES) assert.ok(bank.some((q) => q.difficulty === d.id), `${mode} lacks ${d.id}`);
  }
});

test('Multiple-choice questions have 3-4 options, exactly one correct, and an explanation for each', () => {
  for (const mode of ['find-bug', 'api-detective']) {
    for (const q of BANKS[mode]) {
      assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
      assert.equal(q.options.filter((o) => o.correct).length, 1, q.id);
      assert.ok(q.options.every((o) => o.text && o.why), q.id);
      assert.ok(q.explanation, q.id);
      assert.ok(q.ui || q.api || q.request, `${q.id} has no exhibit`);
    }
  }
});

test('The longest answer is not a giveaway (correct option is longest in at most half of questions)', () => {
  for (const mode of ['find-bug', 'api-detective']) {
    const bank = BANKS[mode];
    const longest = bank.filter((q) => {
      const c = q.options.find((o) => o.correct).text.length;
      return c === Math.max(...q.options.map((o) => o.text.length));
    }).length;
    assert.ok(longest / bank.length <= 0.5, `${mode}: correct is longest in ${longest}/${bank.length}`);
    const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const correctAvg = avg(bank.map((q) => q.options.find((o) => o.correct).text.length));
    const otherAvg = avg(bank.flatMap((q) => q.options.filter((o) => !o.correct).map((o) => o.text.length)));
    assert.ok(Math.abs(correctAvg - otherAvg) / otherAvg < 0.15, `${mode}: average lengths differ too much`);
  }
});

test('Test-case challenges have a valid pick count and 0-3 values', () => {
  for (const c of BANKS['test-cases']) {
    assert.ok(c.candidates.length >= c.pick + 2, c.id);
    assert.ok(c.candidates.every((x) => [0, 1, 2, 3].includes(x.value) && x.why), c.id);
    assert.ok(c.candidates.filter((x) => x.value >= 2).length >= c.pick, `${c.id}: several valid combinations expected`);
  }
});

test('API Detective covers the required topics', () => {
  const text = BANKS['api-detective'].map((q) => q.topic.toLowerCase()).join(' | ');
  for (const t of ['status codes', 'payload', 'authentication', 'consistency', 'required', 'data types', 'duplicate', 'server errors']) {
    assert.ok(text.includes(t), `missing topic: ${t}`);
  }
});

test('Rounds have the right size, unique questions, shuffled options and no mutation of the bank', () => {
  const before = JSON.stringify(BANKS);
  for (const mode of Object.keys(BANKS)) {
    for (const d of DIFFICULTIES) {
      const round = buildRound(mode, d.id, seeded(7));
      assert.equal(round.length, Math.min(ROUND_SIZE[mode], BANKS[mode].length));
      assert.equal(new Set(round.map((q) => q.id)).size, round.length);
      assert.ok(round.filter((q) => q.difficulty === d.id).length >= 1);
    }
  }
  assert.equal(JSON.stringify(BANKS), before);
});

test('A round of the chosen level uses that level first', () => {
  const round = buildRound('find-bug', 'advanced', seeded(3));
  const advancedInBank = BANKS['find-bug'].filter((q) => q.difficulty === 'advanced').length;
  assert.equal(round.filter((q) => q.difficulty === 'advanced').length, Math.min(advancedInBank, ROUND_SIZE['find-bug']));
});

const play = (mode, difficulty, seed = 1) => {
  let s = reducer(initialState, { type: 'configure', patch: { mode, difficulty } });
  return reducer(s, { type: 'start', questions: buildRound(mode, difficulty, seeded(seed)) });
};

test('Correct answers score full points; wrong answers score 0 and never go negative', () => {
  let s = play('find-bug', 'beginner');
  const q = s.questions[0];
  s = reducer(s, { type: 'answer', optionId: q.options.find((o) => !o.correct).id });
  assert.equal(s.answers[q.id].points, 0);
  s = reducer(s, { type: 'next' });
  const q2 = s.questions[1];
  s = reducer(s, { type: 'answer', optionId: q2.options.find((o) => o.correct).id });
  assert.equal(s.answers[q2.id].points, q2.maxPoints);
  assert.ok(summarize(s).score >= 0);
});

test('The same question cannot be scored twice in one round', () => {
  let s = play('find-bug', 'beginner');
  const q = s.questions[0];
  const right = q.options.find((o) => o.correct).id;
  const wrong = q.options.find((o) => !o.correct).id;
  s = reducer(s, { type: 'answer', optionId: right });
  const once = summarize(s).score;
  s = reducer(s, { type: 'answer', optionId: right });
  s = reducer(s, { type: 'answer', optionId: wrong });
  s = reducer(s, { type: 'timeout', questionId: q.id });
  assert.equal(summarize(s).score, once);
  assert.equal(s.answers[q.id].picked, right);
});

test('Cannot advance before answering; timeout scores zero and is recorded once', () => {
  let s = play('api-detective', 'intermediate');
  const first = s.index;
  s = reducer(s, { type: 'next' });
  assert.equal(s.index, first);
  const q = s.questions[0];
  s = reducer(s, { type: 'timeout', questionId: 'some-other-question' });
  assert.equal(Object.keys(s.answers).length, 0);
  s = reducer(s, { type: 'timeout', questionId: q.id });
  assert.equal(s.answers[q.id].points, 0);
  assert.equal(s.answers[q.id].timedOut, true);
});

test('Perfect and zero rounds give correct final score and accuracy', () => {
  for (const mode of ['find-bug', 'api-detective']) {
    let s = play(mode, 'advanced', 11);
    for (let i = 0; i < s.questions.length; i++) {
      s = reducer(s, { type: 'answer', optionId: s.questions[s.index].options.find((o) => o.correct).id });
      s = reducer(s, { type: 'next' });
    }
    assert.equal(s.phase, 'results');
    const sum = summarize(s);
    assert.equal(sum.score, sum.maxScore);
    assert.equal(sum.accuracy, 100);

    let z = play(mode, 'advanced', 11);
    for (let i = 0; i < z.questions.length; i++) {
      z = reducer(z, { type: 'answer', optionId: z.questions[z.index].options.find((o) => !o.correct).id });
      z = reducer(z, { type: 'next' });
    }
    assert.equal(summarize(z).score, 0);
    assert.equal(summarize(z).accuracy, 0);
  }
});

test('Accuracy is the share of correct answers (half right = 50%)', () => {
  let s = play('find-bug', 'beginner', 5);
  s.questions.forEach((_, i) => {
    const q = s.questions[s.index];
    const pick = i % 2 === 0 ? q.options.find((o) => o.correct) : q.options.find((o) => !o.correct);
    s = reducer(s, { type: 'answer', optionId: pick.id });
    s = reducer(s, { type: 'next' });
  });
  assert.equal(summarize(s).accuracy, 50);
});

test('Test-case scoring: best picks earn full points, other valid combinations earn partial, none is negative', () => {
  const c = buildRound('test-cases', 'intermediate', seeded(2))[0];
  const best = [...c.candidates].sort((a, b) => b.value - a.value).slice(0, c.pick).map((x) => x.id);
  assert.equal(gradeCases(c, best).points, caseWorth(c));
  assert.equal(gradeCases(c, best).correct, true);
  const mid = c.candidates.filter((x) => x.value === 2).slice(0, c.pick).map((x) => x.id);
  const midResult = gradeCases(c, mid);
  assert.ok(midResult.points > 0 && midResult.points < caseWorth(c));
  const weak = c.candidates.filter((x) => x.value === 0).map((x) => x.id);
  assert.equal(gradeCases(c, weak).points, 0);
  assert.equal(gradeCases(c, []), null);
  assert.equal(gradeCases(c, [best[0], best[0], best[0]]).sum, c.candidates.find((x) => x.id === best[0]).value, 'duplicates ignored');
  assert.equal(gradeCases(c, c.candidates.map((x) => x.id)).sum <= maxCaseValue(c), true, 'extra picks beyond the limit are ignored');
});

test('Test-case mode works through the reducer and is scored once', () => {
  let s = play('test-cases', 'beginner', 4);
  const q = s.questions[0];
  const best = [...q.candidates].sort((a, b) => b.value - a.value).slice(0, q.pick).map((x) => x.id);
  s = reducer(s, { type: 'submitCases', selected: best });
  const score = summarize(s).score;
  s = reducer(s, { type: 'submitCases', selected: [q.candidates[7].id] });
  s = reducer(s, { type: 'answer', optionId: 'x' });
  assert.equal(summarize(s).score, score);
});

test('Reset returns to setup and keeps the chosen settings', () => {
  let s = reducer(play('api-detective', 'advanced'), { type: 'reset' });
  assert.equal(s.phase, 'setup');
  assert.equal(s.mode, 'api-detective');
  assert.equal(s.answers && Object.keys(s.answers).length, 0);
});

console.log(`\n${passed} game checks passed.`);
