export default function Footer({ largura = 'max-w-md' }) {
  return (
    <footer className={`mx-auto ${largura} px-4 pb-4 pt-6 text-center`}>
      <p className="text-[11px] tracking-wide text-[var(--cream-soft)]/70">
        Powered by <span className="font-semibold text-[var(--cream-soft)]">SmartMetrics</span>
      </p>
    </footer>
  );
}
