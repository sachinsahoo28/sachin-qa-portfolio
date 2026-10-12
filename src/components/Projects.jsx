import { projectGroups, projects } from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head">
          <h2 id="projects-title" className="section-title">
            Featured projects: SaaS and Android application testing
          </h2>
          <p className="section-lead">
            Seven projects I have tested, covering functional, API, UI and regression testing. These are testing case
            studies from project experience, so there are no public demos or repositories to link to.
          </p>
        </div>

        {projectGroups.map((group) => (
          <div className="project-group" key={group.id}>
            <h3 className="group-title">{group.title}</h3>
            <div className={group.id === 'android' ? 'card-grid card-grid-two' : 'card-grid'}>
              {projects
                .filter((p) => p.group === group.id)
                .map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
