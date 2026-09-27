"use client";

import { useState, type KeyboardEvent } from "react";
import { FieldLabel } from "@puckeditor/core";

import type { StudioStrings } from "@/lib/studio/strings";

/** Chips input for hasMany text fields (tags, roles, dropdown options). */
export function TagsField({
  label,
  value,
  onChange,
  s,
}: {
  label: string;
  value: string[] | null | undefined;
  onChange: (value: string[]) => void;
  s: StudioStrings;
}) {
  const tags = value ?? [];
  const [draft, setDraft] = useState("");

  const add = () => {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <FieldLabel label={label} el="div">
      <div className="studio-tags">
        {tags.map((tag) => (
          <span key={tag} className="studio-tag">
            {tag}
            <button
              type="button"
              aria-label={`${s.remove} ${tag}`}
              onClick={() => onChange(tags.filter((t) => t !== tag))}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="studio-tags__input"
          value={draft}
          placeholder={s.addTag}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
        />
      </div>
    </FieldLabel>
  );
}
