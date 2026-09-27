/**
 * Calls `onChange(true)` when the element scrolls into view and
 * `onChange(false)` when it leaves. With `once`, it reports the first time it
 * is seen and then stops watching. Returns a cleanup function (for effects).
 */
export function watchVisibility(
  el: Element,
  onChange: (visible: boolean) => void,
  { once = false, ...options }: IntersectionObserverInit & { once?: boolean } = {},
): () => void {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry) return;
    if (entry.isIntersecting) {
      if (once) observer.disconnect();
      onChange(true);
    } else if (!once) {
      onChange(false);
    }
  }, options);
  observer.observe(el);
  return () => observer.disconnect();
}
