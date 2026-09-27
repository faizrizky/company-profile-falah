import { expect, it } from "vitest";

import { safeEqual } from "./timing-safe";

it("compares secrets", () => {
  expect(safeEqual("revalidate-secret", "revalidate-secret")).toBe(true);
  expect(safeEqual("revalidate-secret", "revalidate-secreT")).toBe(false);
  expect(safeEqual("a", "abc")).toBe(false);
});
