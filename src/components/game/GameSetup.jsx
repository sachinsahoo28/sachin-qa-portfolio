import { Play } from 'lucide-react';
import { DIFFICULTIES, MODES, ROUND_SIZE, TIME_LIMIT } from './gameLogic.js';

function Choice({ name, value, checked, onChange, label, blurb }) {
  return (
    <label className="choice">
      <input className="choice-input" type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span className="choice-body">
        <span className="choice-label">{label}</span>
        <span className="choice-blurb">{blurb}</span>
      </span>
    </label>
  );
}

export default function GameSetup({ state, dispatch, onStart }) {
  const { mode, difficulty, countdown } = state;
  const set = (patch) => dispatch({ type: 'configure', patch });
  const isCases = mode === 'test-cases';
  const level = DIFFICULTIES.find((d) => d.id === difficulty);

  return (
    <form
      className="setup"
      onSubmit={(e) => {
        e.preventDefault();
        onStart();
      }}
    >
      <fieldset className="setup-group">
        <legend className="setup-legend">Mode</legend>
        <div className="choice-grid">
          {MODES.map((m) => (
            <Choice key={m.id} name="mode" value={m.id} checked={mode === m.id} onChange={(v) => set({ mode: v })} label={m.label} blurb={m.blurb} />
          ))}
        </div>
      </fieldset>

      <fieldset className="setup-group">
        <legend className="setup-legend">Difficulty</legend>
        <div className="choice-grid">
          {DIFFICULTIES.map((d) => (
            <Choice key={d.id} name="difficulty" value={d.id} checked={difficulty === d.id} onChange={(v) => set({ difficulty: v })} label={d.label} blurb={d.blurb} />
          ))}
        </div>
      </fieldset>

      <div className="setup-group">
        <label className="toggle">
          <input type="checkbox" checked={countdown} onChange={(e) => set({ countdown: e.target.checked })} />
          <span>Countdown timer (optional)</span>
        </label>
        <p className="setup-hint">
          {countdown
            ? `You will have ${TIME_LIMIT[mode]} seconds per ${isCases ? 'challenge' : 'question'}. If time runs out, the answer is shown and no points are awarded.`
            : 'Off by default. Take as long as you like.'}
        </p>
      </div>

      <div className="setup-foot">
        <button type="submit" className="btn btn-primary">
          <Play size={18} aria-hidden="true" />
          <span>Start Game</span>
        </button>
        <p className="setup-hint">
          {isCases
            ? `${ROUND_SIZE[mode]} challenges per round. Each is worth up to ${level.points * 2} points.`
            : `${ROUND_SIZE[mode]} questions per round, ${level.points} points for each correct answer.`}{' '}
          Wrong answers never lose points.
        </p>
      </div>
    </form>
  );
}
