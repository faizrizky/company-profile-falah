import type { StudioStrings } from "@/lib/studio/strings";

/** Full-screen glass card used for "please log in" and "not found" states. */
export function StudioMessage({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: { href: string; label: string };
}) {
  return (
    <main className="studio-center">
      <div className="studio-card">
        <div className="studio-brand">
          <span className="studio-brand__mark" aria-hidden>
            ✳
          </span>
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

export const loginAction = (cmsUrl: string, s: StudioStrings) => ({ href: `${cmsUrl}/admin/login`, label: s.loginButton });
