import { slug } from '../api.js';

export default function StatusBadge({ s, dark }) {
  return (
    <span
      className={
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ' + slug(s)
      }
      style={{
        background: dark ? '#334155' : '#f2f8ff',
        color: dark ? '#e2e8f0' : '#14306b',
        border: '1px solid ' + (dark ? '#475569' : '#edf3fb'),
      }}
    >
      {s}
    </span>
  );
}
