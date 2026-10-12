import { useState } from 'react';
import StatusBadge from './StatusBadge.jsx';

const VALUE_LABEL = {
  3: { tone: 'pass', text: 'Essential' },
  2: { tone: 'info', text: 'Useful' },
  1: { tone: 'warn', text: 'Lower priority here' },
  0: { tone: 'neutral', text: 'Not relevant' },
};

export default function CaseQuestion({ question, result, onSubmit, headingRef, feedbackRef }) {
  const [selected, setSelected] = useState([]);
  const answered = Boolean(result);
  const full = selected.length >= question.pick;

  const toggle = (id) =>
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : current.length < question.pick ? [...current, id] : current));

  return (
    <div className="q">
      <div className="q-exhibit">
        <p className="q-topic">Feature specification</p>
        <h3 className="q-title" tabIndex={-1} ref={headingRef}>
          {question.title}
        </h3>
        <blockquote className="spec">{question.spec}</blockquote>
        <p className="q-context">
          Several combinations can work. The most useful cases cover the specified behaviour and its riskiest edges.
        </p>
      </div>

      <div className="q-answer">
        <fieldset className="cases" disabled={answered}>
          <legend className="q-prompt">Choose up to {question.pick} test cases you would run first.</legend>
          <ul className="case-list" role="list">
            {question.candidates.map((c) => {
              const checked = answered ? result.picked.includes(c.id) : selected.includes(c.id);
              const label = VALUE_LABEL[c.value];
              return (
                <li key={c.id} className={answered ? `case case-${label.tone}` : 'case'}>
                  <label className="case-label">
                    <input
                      type="checkbox"
                      className="case-input"
                      checked={checked}
                      disabled={answered || (!checked && full)}
                      onChange={() => toggle(c.id)}
                    />
                    <span className="case-box" aria-hidden="true" />
                    <span className="case-text">{c.text}</span>
                  </label>
                  {answered && (
                    <div className="case-result">
                      <StatusBadge tone={label.tone === 'neutral' ? 'info' : label.tone}>{label.text}</StatusBadge>
                      {checked && <span className="why-you">You chose this</span>}
                      <p className="why-text">{c.why}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </fieldset>

        {!answered && (
          <div className="case-actions">
            <p className="case-count" aria-live="polite">
              {selected.length} of {question.pick} selected
            </p>
            <button
              type="button"
              className="btn btn-primary btn-small"
              disabled={selected.length === 0}
              onClick={() => onSubmit(selected)}
            >
              Check my choices
            </button>
          </div>
        )}

        {answered && (
          <div className="feedback" ref={feedbackRef} tabIndex={-1}>
            <div className="feedback-head">
              {result.timedOut ? (
                <StatusBadge tone="warn">Time&rsquo;s up</StatusBadge>
              ) : result.correct ? (
                <StatusBadge tone="pass">Strong selection</StatusBadge>
              ) : (
                <StatusBadge tone="warn">Good start</StatusBadge>
              )}
              <span className="feedback-points">
                {result.points} of {result.max} points
              </span>
            </div>
            <p>
              {result.correct
                ? 'Your choices cover the most valuable checks for this specification.'
                : 'Look at the labels above to see which cases carried the most value, and why.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
