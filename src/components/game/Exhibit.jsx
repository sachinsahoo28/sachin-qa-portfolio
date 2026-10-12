import ApiViewer from './ApiViewer.jsx';
import AppWindow from './AppWindow.jsx';
import BugNote from './BugNote.jsx';

/** Everything the player studies before answering: context, contract, the app or API, and the tester note. */
export default function Exhibit({ question, headingRef }) {
  const request = question.api?.request || question.request;
  const response = question.api?.response || question.response;
  return (
    <div className="q-exhibit">
      <p className="q-topic">{question.topic}</p>
      <h3 className="q-title" tabIndex={-1} ref={headingRef}>
        {question.title}
      </h3>
      {question.context && <p className="q-context">{question.context}</p>}
      {question.contract && (
        <p className="contract">
          <strong>Contract excerpt:</strong> {question.contract}
        </p>
      )}
      {question.ui && <AppWindow ui={question.ui} />}
      {request && response && <ApiViewer request={request} response={response} />}
      {question.note && <BugNote note={question.note} />}
    </div>
  );
}
