import { CircleCheck, TriangleAlert } from 'lucide-react';
import Exhibit from './Exhibit.jsx';
import StatusBadge from './StatusBadge.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function ChoiceQuestion({ question, result, onAnswer, headingRef, feedbackRef }) {
  const promptId = `${question.id}-prompt`;
  const answered = Boolean(result);

  return (
    <div className="q">
      <Exhibit question={question} headingRef={headingRef} />

      <div className="q-answer">
        <p className="q-prompt" id={promptId}>
          {question.question}
        </p>
        <ul className="options" role="list" aria-labelledby={promptId}>
          {question.options.map((option, i) => {
            const isPicked = result?.picked === option.id;
            const state = answered ? (option.correct ? 'is-correct' : isPicked ? 'is-picked' : 'is-dim') : '';
            return (
              <li key={option.id}>
                <button
                  type="button"
                  className={`option ${state}`}
                  aria-disabled={answered || undefined}
                  onClick={() => !answered && onAnswer(option.id)}
                >
                  <span className="option-key" aria-hidden="true">
                    {LETTERS[i]}
                  </span>
                  <span className="option-text">{option.text}</span>
                  {answered && option.correct && (
                    <>
                      <CircleCheck className="option-icon" size={20} aria-hidden="true" />
                      <span className="sr-only"> (correct answer)</span>
                    </>
                  )}
                  {answered && isPicked && !option.correct && (
                    <>
                      <TriangleAlert className="option-icon" size={20} aria-hidden="true" />
                      <span className="sr-only"> (your answer)</span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div className="feedback" ref={feedbackRef} tabIndex={-1}>
            <div className="feedback-head">
              {result.timedOut ? (
                <StatusBadge tone="warn">Time&rsquo;s up</StatusBadge>
              ) : result.correct ? (
                <StatusBadge tone="pass">Correct</StatusBadge>
              ) : (
                <StatusBadge tone="warn">Not quite</StatusBadge>
              )}
              <span className="feedback-points">
                {result.points > 0 ? `+${result.points} points` : 'No points this time'}
              </span>
            </div>
            <p>{question.explanation}</p>
            <p className="feedback-sub">How each answer compares</p>
            <ul className="why-list" role="list">
              {question.options.map((option, i) => (
                <li key={option.id} className={option.correct ? 'why is-best' : 'why'}>
                  <p className="why-head">
                    <strong>
                      {LETTERS[i]}. {option.correct ? 'Best answer' : 'Less appropriate'}
                    </strong>
                    {result.picked === option.id && <span className="why-you"> (your answer)</span>}
                  </p>
                  <p className="why-text">{option.why}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
