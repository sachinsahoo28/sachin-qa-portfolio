// Pure game logic: no DOM, no React. Imported by the UI and by scripts/test-game.mjs.
import { apiScenarios } from '../../data/game/apiDetective.js';
import { findBugScenarios } from '../../data/game/findBug.js';
import { caseChallenges } from '../../data/game/testCases.js';

export const MODES = [
  {
    id: 'find-bug',
    label: 'Find the Bug',
    blurb: 'Inspect a simulated app and name the defect.',
  },
  {
    id: 'api-detective',
    label: 'API Detective',
    blurb: 'Read a fictional request and response, then decide what to check first.',
  },
  {
    id: 'test-cases',
    label: 'Test Case Challenge',
    blurb: 'Choose the most useful test cases for a small specification.',
  },
];

export const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', points: 10, blurb: 'Core testing ideas' },
  { id: 'intermediate', label: 'Intermediate', points: 15, blurb: 'Contracts and permissions' },
  { id: 'advanced', label: 'Advanced', points: 20, blurb: 'Test design and edge cases' },
];

export const BANKS = {
  'find-bug': findBugScenarios,
  'api-detective': apiScenarios,
  'test-cases': caseChallenges,
};

export const ROUND_SIZE = { 'find-bug': 6, 'api-detective': 6, 'test-cases': 2 };
// Seconds per question when the optional countdown is switched on.
export const TIME_LIMIT = { 'find-bug': 45, 'api-detective': 45, 'test-cases': 90 };

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const pointsFor = (difficulty) => DIFFICULTIES.find((d) => d.id === difficulty).points;

export function shuffle(items, rng = Math.random) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Questions of the chosen level first, topped up with the nearest levels if the pool is small. */
export function buildRound(mode, difficulty, rng = Math.random) {
  const bank = BANKS[mode];
  const level = LEVELS.indexOf(difficulty);
  const ordered = shuffle(bank, rng).sort(
    (a, b) => Math.abs(LEVELS.indexOf(a.difficulty) - level) - Math.abs(LEVELS.indexOf(b.difficulty) - level),
  );
  const chosen = shuffle(ordered.slice(0, ROUND_SIZE[mode]), rng);
  return chosen.map((q) => {
    if (mode === 'test-cases') {
      const candidates = shuffle(
        q.candidates.map((c, i) => ({ ...c, id: `${q.id}-c${i}` })),
        rng,
      );
      return { ...q, mode, candidates, maxPoints: caseWorth(q) };
    }
    const options = shuffle(
      q.options.map((o, i) => ({ ...o, id: `${q.id}-o${i}` })),
      rng,
    );
    return { ...q, mode, options, maxPoints: pointsFor(q.difficulty) };
  });
}

/** A test-case challenge is worth two questions\u2019 points at its level. */
export function caseWorth(challenge) {
  return pointsFor(challenge.difficulty) * 2;
}

export function maxCaseValue(challenge) {
  return challenge.candidates
    .map((c) => c.value)
    .sort((a, b) => b - a)
    .slice(0, challenge.pick)
    .reduce((sum, v) => sum + v, 0);
}

export function gradeChoice(question, optionId) {
  const picked = question.options.find((o) => o.id === optionId);
  if (!picked) return null;
  const correct = Boolean(picked.correct);
  return { kind: 'choice', picked: picked.id, correct, points: correct ? question.maxPoints : 0, max: question.maxPoints };
}

export function gradeCases(question, selectedIds) {
  const valid = new Set(question.candidates.map((c) => c.id));
  const unique = [...new Set(selectedIds)].filter((id) => valid.has(id)).slice(0, question.pick);
  if (unique.length === 0) return null;
  const sum = unique.reduce((total, id) => total + question.candidates.find((c) => c.id === id).value, 0);
  const best = maxCaseValue(question);
  const points = Math.round((question.maxPoints * Math.min(sum, best)) / best);
  return { kind: 'cases', picked: unique, correct: sum === best, points, max: question.maxPoints, sum, best };
}

export function gradeTimeout(question) {
  return question.mode === 'test-cases'
    ? { kind: 'cases', picked: [], correct: false, points: 0, max: question.maxPoints, timedOut: true, sum: 0, best: maxCaseValue(question) }
    : { kind: 'choice', picked: null, correct: false, points: 0, max: question.maxPoints, timedOut: true };
}

export const initialState = {
  phase: 'setup',
  mode: 'find-bug',
  difficulty: 'beginner',
  countdown: false,
  questions: [],
  index: 0,
  answers: {},
};

export function reducer(state, action) {
  const question = state.questions[state.index];
  const canAnswer = state.phase === 'playing' && question && !state.answers[question.id];

  switch (action.type) {
    case 'configure':
      return state.phase === 'setup' ? { ...state, ...action.patch } : state;
    case 'start':
      return { ...state, phase: 'playing', questions: action.questions, index: 0, answers: {} };
    case 'answer': {
      if (!canAnswer || question.mode === 'test-cases') return state;
      const result = gradeChoice(question, action.optionId);
      return result ? { ...state, answers: { ...state.answers, [question.id]: result } } : state;
    }
    case 'submitCases': {
      if (!canAnswer || question.mode !== 'test-cases') return state;
      const result = gradeCases(question, action.selected);
      return result ? { ...state, answers: { ...state.answers, [question.id]: result } } : state;
    }
    case 'timeout':
      if (!canAnswer || question.id !== action.questionId) return state;
      return { ...state, answers: { ...state.answers, [question.id]: gradeTimeout(question) } };
    case 'next': {
      if (state.phase !== 'playing' || !question || !state.answers[question.id]) return state;
      return state.index + 1 >= state.questions.length
        ? { ...state, phase: 'results' }
        : { ...state, index: state.index + 1 };
    }
    case 'reset':
      return { ...initialState, mode: state.mode, difficulty: state.difficulty, countdown: state.countdown };
    default:
      return state;
  }
}

export function summarize(state) {
  const results = state.questions.map((q) => ({ question: q, result: state.answers[q.id] || null }));
  const answered = results.filter((r) => r.result);
  const score = answered.reduce((s, r) => s + r.result.points, 0);
  const maxScore = state.questions.reduce((s, q) => s + q.maxPoints, 0);
  let accuracy = 0;
  if (state.mode === 'test-cases') {
    accuracy = maxScore ? Math.round((score / maxScore) * 100) : 0;
  } else {
    const correct = answered.filter((r) => r.result.correct).length;
    accuracy = state.questions.length ? Math.round((correct / state.questions.length) * 100) : 0;
  }
  return { results, score, maxScore, accuracy, answeredCount: answered.length };
}
