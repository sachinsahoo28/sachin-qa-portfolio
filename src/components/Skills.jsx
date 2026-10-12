import { skillGroups } from '../data/skills.js';

export default function Skills() {
  return (
    <section id="skills" className="section section-band" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-head">
          <h2 id="skills-title" className="section-title">
            Technical skills in software testing
          </h2>
          <p className="section-lead">
            Manual testing and automation are listed separately, because they are different kinds of work. Every tool
            below is one I have used.
          </p>
        </div>
        <div className="skill-list">
          {skillGroups.map((group) => (
            <div className="skill-row" key={group.title}>
              <h3 className="skill-title">{group.title}</h3>
              <ul className="tags" role="list">
                {group.skills.map((skill) => (
                  <li className="tag" key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
