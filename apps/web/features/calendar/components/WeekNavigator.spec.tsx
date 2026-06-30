import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WeekNavigator } from "./WeekNavigator";
import { getMondayOfWeek } from "../utils";

vi.mock("next/navigation", () => ({ useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe("WeekNavigator", () => {
  it("renders the date range label for the current week", () => {
    const anchor = new Date("2026-06-24T12:00:00");
    const monday = getMondayOfWeek(anchor);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    render(
      <WeekNavigator
        anchor={anchor}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onToday={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    expect(
      screen.getByText(
        `Jun ${monday.getDate()} – ${sunday.getDate()}, ${sunday.getFullYear()}`,
      ),
    ).toBeDefined();
  });

  it("calls onPrev when previous week button is clicked", async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();

    render(
      <WeekNavigator
        anchor={new Date("2026-06-24T12:00:00")}
        onPrev={onPrev}
        onNext={vi.fn()}
        onToday={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Previous week" }));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it("calls onToday when Today button is clicked", async () => {
    const user = userEvent.setup();
    const onToday = vi.fn();

    render(
      <WeekNavigator
        anchor={new Date("2026-06-24T12:00:00")}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onToday={onToday}
      />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Today" }));
    expect(onToday).toHaveBeenCalledOnce();
  });
});
