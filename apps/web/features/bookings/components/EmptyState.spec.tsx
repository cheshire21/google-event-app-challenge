import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe("EmptyState", () => {
  it("renders the 'No bookings yet' heading", () => {
    render(<EmptyState />);
    expect(screen.getByText("No bookings yet")).toBeDefined();
  });

  it("renders the descriptive paragraph", () => {
    render(<EmptyState />);
    expect(
      screen.getByText(/Reserve your first time slot/),
    ).toBeDefined();
  });

  it("renders a 'New booking' link pointing to /bookings/new", () => {
    render(<EmptyState />);
    const link = screen.getByRole("link", { name: "New booking" });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).href).toContain("/bookings/new");
  });
});
