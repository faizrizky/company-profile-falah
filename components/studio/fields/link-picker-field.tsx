"use client";

import { useState } from "react";
import { FieldLabel } from "@puckeditor/core";

import type { StudioStrings } from "@/lib/studio/strings";

type LinkGroupOption = { label: string; options: { label: string; href: string }[] };

const CUSTOM_LINK = "__custom__";

/** Link as a grouped dropdown (pages, solutions, CMS link library) with a free-text fallback. */
export function LinkPickerField({
  label,
  value,
  onChange,
  groups,
  s,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  groups: LinkGroupOption[];
  s: StudioStrings;
}) {
  const [custom, setCustom] = useState(false);
  const known = groups.some((g) => g.options.some((o) => o.href === value));
  const isCustom = custom || (!!value && !known);

  return (
    <FieldLabel label={label} el="div">
      <select
        className="studio-input"
        value={isCustom ? CUSTOM_LINK : (value ?? "")}
        onChange={(e) => {
          if (e.target.value === CUSTOM_LINK) return setCustom(true);
          setCustom(false);
          onChange(e.target.value);
        }}
      >
        <option value="">{s.linkChoose}</option>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={`${g.label}-${o.href}`} value={o.href}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={CUSTOM_LINK}>{s.linkCustom}</option>
      </select>
      {isCustom ? (
        <input
          className="studio-input studio-link-custom"
          type="text"
          value={value ?? ""}
          placeholder={s.linkPlaceholder}
          onChange={(e) => onChange(e.target.value)}
          aria-label={s.linkCustom}
        />
      ) : null}
    </FieldLabel>
  );
}
