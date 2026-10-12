/** A short fictional tester's note: the steps taken and what was observed. */
export default function BugNote({ note }) {
  return (
    <aside className="bugnote" aria-label={`Tester note ${note.id}`}>
      <p className="bugnote-id">Tester note {note.id}</p>
      <ol className="bugnote-steps">
        {note.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <p className="bugnote-observed">
        <strong>Observed:</strong> {note.observed}
      </p>
    </aside>
  );
}
