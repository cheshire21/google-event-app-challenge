import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { SettingsPage } from "./SettingsPage";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/features/google-calendar/components/GoogleCalendarCard", () => ({
  GoogleCalendarCard: () => <div data-testid="google-calendar-card" />,
}));

const makeSearchParams = (params: Record<string, string>) => ({
  get: (key: string) => params[key] ?? null,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SettingsPage", () => {
  it("calls toast.success when ?connected=true is in the URL", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      makeSearchParams({ connected: "true" }) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<SettingsPage />);

    expect(toast.success).toHaveBeenCalledWith("Google Calendar connected successfully!");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("calls toast.error when ?error=google_auth_failed is in the URL", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      makeSearchParams({ error: "google_auth_failed" }) as unknown as ReturnType<
        typeof useSearchParams
      >,
    );

    render(<SettingsPage />);

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to connect Google Calendar. Please try again.",
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls no toast when no relevant params are present", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      makeSearchParams({}) as unknown as ReturnType<typeof useSearchParams>,
    );

    render(<SettingsPage />);

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
