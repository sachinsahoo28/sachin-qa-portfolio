// Request/response viewer for fictional API calls. Nothing here is ever sent over the network.
const formatBody = (body) => (body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body, null, 2));

const headerLines = (headers) => Object.entries(headers || {}).map(([k, v]) => `${k}: ${v}`);

export function requestText(request) {
  const lines = [`${request.method} ${request.path}`, ...headerLines(request.headers)];
  const body = formatBody(request.body);
  return body ? `${lines.join('\n')}\n\n${body}` : lines.join('\n');
}

export function responseText(response) {
  const lines = [`HTTP/1.1 ${response.status}`, ...headerLines(response.headers)];
  const body = formatBody(response.body);
  return body ? `${lines.join('\n')}\n\n${body}` : lines.join('\n');
}

function Panel({ label, text }) {
  return (
    <div className="api-panel">
      <p className="api-label">{label}</p>
      {/* tabIndex lets keyboard users scroll long lines inside the panel */}
      <pre className="api-code" tabIndex={0} aria-label={label}>
        <code>{text}</code>
      </pre>
    </div>
  );
}

export default function ApiViewer({ request, response }) {
  return (
    <div className="api" role="group" aria-label="Fictional API request and response">
      <Panel label="Request" text={requestText(request)} />
      <Panel label="Response" text={responseText(response)} />
    </div>
  );
}
