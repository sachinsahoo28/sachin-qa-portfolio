import { ICONS } from './StatusBadge.jsx';

/** A simulated application window. Everything shown is fictional text, with no real inputs or network calls. */
export default function AppWindow({ ui }) {
  const Banner = ui.banner ? ICONS[ui.banner.tone] : null;
  return (
    <figure className="appwin" aria-label={`Simulated application: ${ui.title}`}>
      <div className="appwin-bar">
        <span className="appwin-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="appwin-url">{ui.url}</span>
      </div>
      <div className="appwin-body">
        <p className="appwin-title">{ui.title}</p>

        {ui.banner && (
          <div className={`appwin-banner appwin-banner-${ui.banner.tone}`}>
            <Banner size={18} aria-hidden="true" />
            <span>{ui.banner.text}</span>
          </div>
        )}

        {ui.fields && (
          <dl className="appwin-fields">
            {ui.fields.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd className={f.empty ? 'is-empty' : undefined}>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {ui.table && (
          <div className="appwin-table-wrap">
            <table className="appwin-table">
              <thead>
                <tr>
                  {ui.table.head.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ui.table.rows.map((row) => (
                  <tr key={row.join('|')}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {ui.rows && (
          <dl className="appwin-rows">
            {ui.rows.map((r) => (
              <div key={r.label} className={r.strong ? 'is-strong' : undefined}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {ui.action && <span className="appwin-btn">{ui.action}</span>}
      </div>
    </figure>
  );
}
