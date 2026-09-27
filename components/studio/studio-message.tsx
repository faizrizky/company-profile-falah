import type { StudioStrings } from "@/lib/studio/strings";

import { StudioReadySignal } from "./ready-signal";

/** Full-screen glass card used for "please log in" and "not found" states. */
export function StudioMessage({
  title,
  body,
  action,
  cmsUrl,
}: {
  title: string;
  body?: string;
  action?: { href: string; label: string };
  /** When embedded in the CMS, lets it drop its loading skeleton. */
  cmsUrl?: string;
}) {
  return (
    <main className="studio-center">
      {cmsUrl ? <StudioReadySignal cmsUrl={cmsUrl} /> : null}
      <div className="studio-card">
        <div className="studio-brand">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark */}
          <img className="studio-brand__mark" src="/icon.png" alt="" width={28} height={28} />
          <span>Falah Studio</span>
        </div>
        <h1>{title}</h1>
        {body && <p className="studio-muted">{body}</p>}
        {action && (
          <a className="studio-btn studio-btn--primary" href={action.href}>
            {action.label}
          </a>
        )}
      </div>
    </main>
  );
}

export const loginAction = (cmsUrl: string, s: StudioStrings) => ({
  href: `${cmsUrl}/admin/login`,
  label: s.loginButton,
});
