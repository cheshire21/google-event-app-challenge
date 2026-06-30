import { describe, expect, it } from "vitest";
import { getTopPercent, getHeightPercent } from "./utils";

// Calendar spans 24 hours starting at midnight (CALENDAR_START_HOUR=0, CALENDAR_TOTAL_HOURS=24)

describe("getTopPercent", () => {
  it("returns 0 for midnight (start of calendar)", () => {
    const t = new Date("2026-06-24T00:00:00");
    expect(getTopPercent(t)).toBe(0);
  });

  it("returns 33.33 for 8 AM (8 hours in, 24-hour range)", () => {
    const t = new Date("2026-06-24T08:00:00");
    expect(getTopPercent(t)).toBeCloseTo((8 / 24) * 100, 1);
  });

  it("returns 50 for noon", () => {
    const t = new Date("2026-06-24T12:00:00");
    expect(getTopPercent(t)).toBeCloseTo(50, 1);
  });

  it("clamps to 0 for times at or before midnight", () => {
    const t = new Date("2026-06-24T00:00:00");
    expect(getTopPercent(t)).toBe(0);
  });
});

describe("getHeightPercent", () => {
  it("returns ~4.17 for a 1-hour event (1/24 of the day)", () => {
    const s = new Date("2026-06-24T09:00:00");
    const e = new Date("2026-06-24T10:00:00");
    expect(getHeightPercent(s, e)).toBeCloseTo((1 / 24) * 100, 1);
  });

  it("returns minimum 1 for very short events", () => {
    const s = new Date("2026-06-24T09:00:00");
    const e = new Date("2026-06-24T09:01:00");
    expect(getHeightPercent(s, e)).toBe(1);
  });
});
