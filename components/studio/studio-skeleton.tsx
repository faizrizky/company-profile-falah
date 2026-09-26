/**
 * Placeholder shaped like the Puck editor (header, blocks panel, canvas,
 * fields panel). Shown while the studio page loads and until it hydrates.
 */
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export function StudioSkeleton({ embedded = false }: { embedded?: boolean }) {
  return (
    <div
      className={`studio-sk ${embedded ? "studio-embedded" : "studio-standalone"}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading…</span>
      <div className="studio-sk__bar">
        <span className="studio-sk__block studio-sk__block--icon" />
        <span className="studio-sk__block studio-sk__block--icon" />
        <span className="studio-sk__spacer" />
        <span className="studio-sk__block studio-sk__block--pill" />
        <span className="studio-sk__block studio-sk__block--pill" />
        <span className="studio-sk__block studio-sk__block--pill studio-sk__block--accent" />
      </div>
      <div className="studio-sk__body">
        <div className="studio-sk__panel">
          {range(8).map((i) => (
            <span key={i} className="studio-sk__block studio-sk__block--item" />
          ))}
        </div>
        <div className="studio-sk__canvas">
          <span className="studio-sk__block studio-sk__block--frame" />
        </div>
        <div className="studio-sk__panel">
          {range(3).map((i) => (
            <div key={i} className="studio-sk__field">
              <span className="studio-sk__block studio-sk__block--label" />
              <span className="studio-sk__block studio-sk__block--input" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
