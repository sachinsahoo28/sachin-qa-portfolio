import { useEffect, useRef } from 'react';
import { RotateCcw, Settings2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { DIFFICULTIES, MODES, summarize } from './gameLogic.js';

function message(accuracy) {
  if (accuracy >= 80) return 'Strong testing instincts. You read the evidence carefully.';
  if (accuracy >= 50) return 'A solid base. Read the explanations for the ones you missed and try another round.';
  return 'A good start. Every tester learns by reviewing what they missed. Try Beginner again or switch modes.';
}

export default function GameResults({ state, dispatch, onPlayAgain }) {
  const { results, score, maxScore, accuracy } = summarize(state);
  const headingRef = useRef(null);
  useEffect(() => headingRef.current?.focus(), []);
  const mode = MODES.find((m) => m.id === state.mode);
  const level = DIFFICULTIES.find((d) => d.id === state.difficulty);

  return (
    <div className="results">
      <h3 className="results-title" tabIndex={-1} ref={headingRef}>
        Round complete
      </h3>
      <p className="results-sub">
        {mode.label}, {level.label}
        {state.countdown ? ', with countdown' : ''}
      </p>

      <dl className="results-stats">
        <div>
          <dt>Final score</dt>
          <dd>
            {score} <span className="results-of">/ {maxScore}</span>
          </dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd>{accuracy}%</dd>
        </div>
      </dl>
      <p className="results-note">{message(accuracy)}</p>

      <h4 className="results-list-title">Your answers</h4>
      <ol className="results-list" role="list">
        {results.map(({ question, result }) => (
          <li key={question.id} className="results-item">
            <span className="results-item-title">{question.title}</span>
            {result?.timedOut ? (
              <StatusBadge tone="warn">Time&rsquo;s up</StatusBadge>
            ) : result?.correct ? (
              <StatusBadge tone="pass">{question.mode === 'test-cases' ? 'Strong selection' : 'Correct'}</StatusBadge>
            ) : (
              <StatusBadge tone="warn">{question.mode === 'test-cases' ? 'Partly right' : 'Not quite'}</StatusBadge>
            )}
            <span className="results-item-points">
              {result?.points ?? 0} / {question.maxPoints}
            </span>
          </li>
        ))}
      </ol>

      <div className="results-actions">
        <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
          <RotateCcw size={18} aria-hidden="true" />
          <span>Play again</span>
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'reset' })}>
          <Settings2 size={18} aria-hidden="true" />
          <span>Change settings</span>
        </button>
      </div>
    </div>
  );
}
