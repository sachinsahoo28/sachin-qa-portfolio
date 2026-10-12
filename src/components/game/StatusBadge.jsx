import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';

const ICONS = { pass: CircleCheck, fail: CircleX, warn: TriangleAlert, info: Info };

/** Status is always shown as an icon plus a text label, never by colour alone. */
export default function StatusBadge({ tone = 'info', children }) {
  const Icon = ICONS[tone] || Info;
  return (
    <span className={`badge badge-${tone}`}>
      <Icon size={16} aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}

export { ICONS };
