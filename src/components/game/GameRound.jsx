import { useEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import CaseQuestion from './CaseQuestion.jsx';
import ChoiceQuestion from './ChoiceQuestion.jsx';
import { TIME_LIMIT, summarize } from './gameLogic.js';

/** Mounted once per question (keyed), so its timer always starts fresh and stops when the question is answered. */
function Countdown({ seconds, onExpire }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (left <= 0) onExpire();
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <p className="hud-item hud-timer" role="timer">
      Time left: {Math.max(left, 0)}s
    </p>
  );
}

export default function GameRound({ state, dispatch }) {
  const question = state.questions[state.index];
  const result = state.answers[question.id];
  const total = state.questions.length;
  const { score, answeredCount } = summarize(state);
  const isLast = state.index + 1 >= total;

  const headingRef = useRef(null);
  const feedbackRef = useRef(null);

  // Move focus to the new question, and to the feedback once an answer is given.
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);
  useEffect(() => {
    if (result) feedbackRef.current?.focus();
  }, [result]);

  const shared = { question, result, headingRef, feedbackRef };

  return (
    <div className="round">
      <div className="hud">
        <p className="hud-item">
          Question {state.index + 1} of {total}
        </p>
        <p className="hud-item">Score: {score}</p>
        {state.countdown && !result && (
          <Countdown
            key={question.id}
            seconds={TIME_LIMIT[state.mode]}
            onExpire={() => dispatch({ type: 'timeout', questionId: question.id })}
          />
        )}
        <button type="button" className="btn btn-ghost btn-small hud-restart" onClick={() => dispatch({ type: 'reset' })}>
          <RotateCcw size={16} aria-hidden="true" />
          <span>Restart</span>
        </button>
        <progress className="hud-progress" max={total} value={answeredCount} aria-label="Round progress">
          {answeredCount} of {total}
        </progress>
      </div>

      {question.mode === 'test-cases' ? (
        <CaseQuestion key={question.id} {...shared} onSubmit={(selected) => dispatch({ type: 'submitCases', selected })} />
      ) : (
        <ChoiceQuestion key={question.id} {...shared} onAnswer={(optionId) => dispatch({ type: 'answer', optionId })} />
      )}

      {result && (
        <div className="round-foot">
          <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'next' })}>
            <span>{isLast ? 'See results' : 'Next question'}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
