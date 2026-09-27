"use client";

import { FieldLabel } from "@puckeditor/core";

import type { StudioStrings } from "@/lib/studio/strings";

type Option = { id: number; label: string; image?: string | null };

/** Ordered multi-select for relationship fields (partner logos, certifications). */
export function RelationField<T extends { id: number }>({
  label,
  value,
  onChange,
  options,
  toOption,
  createHref,
  s,
}: {
  label: string;
  /** Where to add a new item in the CMS; the list only offers existing ones. */
  createHref?: string;
  value: (number | T)[] | null | undefined;
  onChange: (value: T[]) => void;
  options: T[];
  toOption: (item: T) => Option;
  s: StudioStrings;
}) {
  const byId = new Map(options.map((o) => [o.id, o]));
  const selected = (value ?? [])
    .map((v) => (typeof v === "number" ? byId.get(v) : v))
    .filter((v): v is T => Boolean(v));
  const selectedIds = new Set(selected.map((v) => v.id));

  const move = (index: number, delta: number) => {
    const next = [...selected];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <FieldLabel label={label} el="div">
      <ol className="studio-relation">
        {selected.map((item, i) => {
          const o = toOption(item);
          return (
            <li key={o.id} className="studio-relation__item">
              {o.image && <img src={o.image} alt="" />}
              <span>{o.label}</span>
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Up">
                ↑
              </button>
              <button type="button" disabled={i === selected.length - 1} onClick={() => move(i, 1)} aria-label="Down">
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(selected.filter((x) => x.id !== o.id))}
                aria-label={s.remove}
              >
                ×
              </button>
            </li>
          );
        })}
      </ol>
      <select
        className="studio-input"
        value=""
        onChange={(e) => {
          const item = byId.get(Number(e.target.value));
          if (item) onChange([...selected, item]);
        }}
      >
        <option value="">{s.addItem}</option>
        {options
          .filter((o) => !selectedIds.has(o.id))
          .map((o) => {
            const opt = toOption(o);
            return (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            );
          })}
      </select>
      {createHref && (
        <a className="studio-relation__create" href={createHref} target="_blank" rel="noopener noreferrer">
          + {s.createInCms}
        </a>
      )}
    </FieldLabel>
  );
}
