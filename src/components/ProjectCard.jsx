import { useRef } from 'react';
import { X } from 'lucide-react';
import { PROJECT_NOTE } from '../data/projects.js';
import { safeHttpUrl } from '../seo.js';

const CARD_TAG_LIMIT = 4;

export default function ProjectCard({ project }) {
  const dialogRef = useRef(null);
  const titleId = `${project.id}-title`;
  const shown = project.scope.slice(0, CARD_TAG_LIMIT);
  const hidden = project.scope.length - shown.length;
  const projectUrl = safeHttpUrl(project.projectUrl);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();
  // A click on the backdrop reports the <dialog> itself as the target.
  const onDialogClick = (event) => {
    if (event.target === dialogRef.current) close();
  };

  return (
    <article className={project.featured ? 'card card-wide' : 'card'}>
      <p className="card-type">{project.type}</p>
      <h4 className="card-title">{project.name}</h4>
      <p className="card-text">{project.summary}</p>

      <ul className="tags tags-small" role="list" aria-label="Testing categories">
        {shown.map((s) => (
          <li className="tag" key={s}>
            {s}
          </li>
        ))}
        {hidden > 0 && <li className="tag tag-more">+{hidden} more in details</li>}
      </ul>

      {project.tools.length > 0 && (
        <p className="card-tools">
          <span className="card-tools-label">Tools:</span> {project.tools.join(', ')}
        </p>
      )}

      {projectUrl ? (
        <a className="btn btn-primary btn-small project-live-link" href={projectUrl} target="_blank" rel="noopener noreferrer">
          Visit Project<span className="sr-only">: {project.name} (opens in a new tab)</span>
        </a>
      ) : project.isPrivate ? (
        <span className="project-access-label">Access restricted</span>
      ) : null}

      <button
        type="button"
        className="btn btn-ghost btn-small card-button"
        aria-haspopup="dialog"
        onClick={open}
      >
        View details<span className="sr-only"> for {project.name}</span>
      </button>

      <dialog ref={dialogRef} className="dialog" aria-labelledby={titleId} onClick={onDialogClick}>
        <div className="dialog-inner">
          <div className="dialog-head">
            <div>
              <p className="card-type">{project.type}</p>
              <h5 id={titleId} className="dialog-title">
                {project.fullName === project.name ? project.name : `${project.name}: ${project.fullName}`}
              </h5>
            </div>
            <button type="button" className="icon-btn" onClick={close} aria-label="Close project details">
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <p>{project.summary}</p>
          {project.clarification && <p className="dialog-clarify">{project.clarification}</p>}

          {project.covers.length > 0 && (
            <>
              <h6 className="dialog-sub">Areas the platform covers</h6>
              <ul className="plain-list plain-list-cols">
                {project.covers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}

          <h6 className="dialog-sub">My testing scope</h6>
          <ul className="plain-list plain-list-cols">
            {project.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          {project.tools.length > 0 && (
            <>
              <h6 className="dialog-sub">Tools</h6>
              <ul className="tags tags-small" role="list">
                {project.tools.map((t) => (
                  <li className="tag" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="dialog-note">{PROJECT_NOTE}</p>
        </div>
      </dialog>
    </article>
  );
}
