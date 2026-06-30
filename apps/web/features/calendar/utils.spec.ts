import { describe, expect, it } from "vitest";
import { getTopPercent, getHeightPercent } from "./utils";

describe("getTopPercent", () => {
  it("returns 0 for 8 AM (start of calendar)", () => {
    const t = new Date("2026-06-24T08:00:00");
    expect(getTopPercent(t)).toBe(0);
  });

  it("returns ~7.69 for 9 AM (1 hour in, 13-hour range)", () => {
    const t = new Date("2026-06-24T09:00:00");
    expect(getTopPercent(t)).toBeCloseTo(100 / 13, 1);
  });

  it("clamps to 0 for times before 8 AM", () => {
    const t = new Date("2026-06-24T06:00:00");
    expect(getTopPercent(t)).toBe(0);
  });
});

describe("getHeightPercent", () => {
  it("returns ~7.69 for a 1-hour event", () => {
    const s = new Date("2026-06-24T09:00:00");
    const e = new Date("2026-06-24T10:00:00");
    expect(getHeightPercent(s, e)).toBeCloseTo(100 / 13, 1);
  });

  it("returns minimum 1 for very short events", () => {
    const s = new Date("2026-06-24T09:00:00");
    const e = new Date("2026-06-24T09:01:00");
    expect(getHeightPercent(s, e)).toBe(1);
  });
});
