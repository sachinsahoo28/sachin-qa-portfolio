import { lifecycle } from '../data/approach.js';

export default function Approach() {
  return (
    <section id="approach" className="section section-band" aria-labelledby="approach-title">
      <div className="container approach-grid">
        <div className="approach-intro">
          <h2 id="approach-title" className="section-title">
            Testing approach: from requirements to quality reporting
          </h2>
          <p className="section-lead">
            Whether I am testing a web application, an API or an Android app, I work through the same eight stages. The
            order is a sequence, and each stage feeds the next.
          </p>
        </div>
        <ol className="lifecycle" role="list">
          {lifecycle.map((stage, index) => (
            <li className="stage" key={stage.title}>
              <span className="stage-num" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className="stage-title">{stage.title}</h3>
                <p className="stage-text">{stage.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
