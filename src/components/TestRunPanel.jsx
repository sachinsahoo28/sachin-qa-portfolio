// Decorative-but-honest hero visual: a few example API checks written for this page.
// It is labelled as an illustration and is not data from any real project.
const checks = [
  { call: 'POST /login', check: 'Valid credentials', detail: 'Expected 200', result: 'Pass' },
  { call: 'POST /login', check: 'Wrong password', detail: 'Expected 401', result: 'Pass' },
  { call: 'POST /leads', check: 'Required name left empty', detail: 'Expected 400', result: 'Pass' },
  {
    call: 'GET /users',
    check: 'Employee token on an admin-only route',
    detail: 'Expected 403, received 200',
    result: 'Fail',
  },
];

export default function TestRunPanel({ wide = false }) {
  return (
    <figure className={wide ? 'run run--wide' : 'run'}>
      <div className="run-bar">
        <span className="run-title">api-checks</span>
        <span className="run-sample">sample</span>
      </div>
      <ol className="run-list" role="list">
        {checks.map((c, i) => (
          <li key={c.call + c.check} className="run-row" data-result={c.result.toLowerCase()} style={{ '--i': i }}>
            <span className="run-status">{c.result}</span>
            <span className="run-call">{c.call}</span>
            <span className="run-check">{c.check}</span>
            <span className="run-detail">{c.detail}</span>
          </li>
        ))}
        <li className="run-note" style={{ '--i': checks.length }}>
          Defect logged with steps, expected result, actual result and severity.
        </li>
      </ol>
      <figcaption className="run-caption">
        Illustrative checks written for this page. They are not from a client project.
      </figcaption>
    </figure>
  );
}
