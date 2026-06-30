import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConflictWarning } from "./ConflictWarning";
import type { ConflictEntry } from "../../types";

describe("ConflictWarning", () => {
  const mockConflict: ConflictEntry = {
    id: "1",
    title: "Design Review",
    startTime: "2026-06-30T10:00:00",
    endTime: "2026-06-30T11:00:00",
    type: "booking",
  };

  it("renders the scheduling conflict heading", () => {
    render(<ConflictWarning conflicts={[mockConflict]} />);
    expect(screen.getByText("Scheduling conflict")).toBeInTheDocument();
  });

  it("renders the conflict entry title in the body text", () => {
    render(<ConflictWarning conflicts={[mockConflict]} />);
    expect(screen.getByText("Design Review")).toBeInTheDocument();
  });
});
