import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBookingStats } from "../hooks/useBookingStats";
import { StatsCards } from "./StatsCards";

vi.mock("../hooks/useBookingStats");

const mockUseBookingStats = vi.mocked(useBookingStats);

describe("StatsCards", () => {
  it("renders the three stat counts returned by useBookingStats", () => {
    mockUseBookingStats.mockReturnValue({
      upcoming: 3,
      thisWeek: 2,
      googleSynced: 1,
    });

    render(<StatsCards />);

    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();
  });

  it("renders the three card labels", () => {
    mockUseBookingStats.mockReturnValue({
      upcoming: 0,
      thisWeek: 0,
      googleSynced: 0,
    });

    render(<StatsCards />);

    expect(screen.getByText("Upcoming")).toBeDefined();
    expect(screen.getByText("This week")).toBeDefined();
    expect(screen.getByText("Google synced")).toBeDefined();
  });
});
