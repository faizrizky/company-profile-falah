import { describe, expect, it } from "vitest";

import { antiSpamSchema, contactSchema } from "./contact-schema";

const valid = { fullName: "Faiz", organization: "Falah", email: "  Faiz@Example.COM ", phone: "+62 21 2696 1651" };

describe("contact form", () => {
  it("accepts a valid submission and normalises the email", () => {
    const parsed = contactSchema.parse(valid);
    expect(parsed.email).toBe("faiz@example.com");
    expect(parsed.message).toBe("");
  });

  it.each([
    ["short name", { fullName: "F" }],
    ["bad email", { email: "not-an-email" }],
    ["bad phone", { phone: "call me" }],
    ["long message", { message: "x".repeat(2001) }],
  ])("rejects %s", (_, override) => {
    expect(contactSchema.safeParse({ ...valid, ...override }).success).toBe(false);
  });

  it("the honeypot must stay empty", () => {
    expect(antiSpamSchema.safeParse({ website: "", startedAt: Date.now() }).success).toBe(true);
    expect(antiSpamSchema.safeParse({ website: "spam.com", startedAt: Date.now() }).success).toBe(false);
  });
});
