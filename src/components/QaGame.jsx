import { useReducer } from 'react';
import { FlaskConical } from 'lucide-react';
import GameResults from './game/GameResults.jsx';
import GameRound from './game/GameRound.jsx';
import GameSetup from './game/GameSetup.jsx';
import { buildRound, initialState, reducer } from './game/gameLogic.js';

export default function QaGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Randomness only happens inside event handlers, so the pre-rendered HTML and the first client render match.
  const start = () => dispatch({ type: 'start', questions: buildRound(state.mode, state.difficulty) });

  return (
    <section id="game" className="section section-band game" aria-labelledby="game-title">
      <div className="container">
        <div className="section-head">
          <h2 id="game-title" className="section-title">
            QA Bug Hunter &mdash; Test Your Skills
          </h2>
          <p className="game-sub">Think like a tester. Find the bugs. Protect the release.</p>
          <p className="section-lead">
            I built this small game to show how I think about testing: reading requirements, checking contracts and
            asking what could go wrong. Every scenario is fictional and runs locally in your browser. Nothing is sent
            anywhere, and wrong answers never lose points.
          </p>
        </div>

        <div className="lab">
          <div className="lab-bar">
            <FlaskConical size={18} aria-hidden="true" />
            <span className="lab-name">QA Lab</span>
            <span className="lab-note">Fictional scenarios, all simulated locally</span>
          </div>
          <div className="lab-body">
            {state.phase === 'setup' && <GameSetup state={state} dispatch={dispatch} onStart={start} />}
            {state.phase === 'playing' && <GameRound state={state} dispatch={dispatch} />}
            {state.phase === 'results' && <GameResults state={state} dispatch={dispatch} onPlayAgain={start} />}
          </div>
        </div>
      </div>
    </section>
  );
}
