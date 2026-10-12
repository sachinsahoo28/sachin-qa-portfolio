import { expertise } from '../data/expertise.js';

export default function Expertise() {
  return (
    <section id="expertise" className="section" aria-labelledby="expertise-title">
      <div className="container">
        <div className="section-head">
          <h2 id="expertise-title" className="section-title">
            Quality assurance expertise
          </h2>
          <p className="section-lead">
            The practical areas I test every day. Security work here means basic security testing of access control,
            sessions and input handling. It is not penetration testing.
          </p>
        </div>
        <ul className="expertise-grid" role="list">
          {expertise.map((item) => (
            <li className="expertise-item" key={item.title}>
              <h3 className="expertise-title">{item.title}</h3>
              <p className="expertise-text">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
