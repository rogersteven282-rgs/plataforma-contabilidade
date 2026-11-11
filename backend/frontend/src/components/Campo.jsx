export default function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--cream-soft)]">
        {label}
      </span>
      {children}
    </label>
  );
}
