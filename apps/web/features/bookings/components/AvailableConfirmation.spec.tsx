import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AvailableConfirmation } from "./AvailableConfirmation";

describe("AvailableConfirmation", () => {
  it("renders 'This slot is free' text", () => {
    render(<AvailableConfirmation />);
    expect(screen.getByText("This slot is free")).toBeInTheDocument();
  });
});
