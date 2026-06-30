import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

const mockReplace = vi.fn();

vi.mock("@/features/auth/hooks/useAuth");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockUseAuth = vi.mocked(useAuth);

describe("AuthGuard", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders nothing and calls router.replace('/login') when requireAuth=true and not authenticated", () => {
    mockUseAuth.mockReturnValue({ token: null, isAuthenticated: false });

    const { container } = render(
      <AuthGuard requireAuth={true}>
        <div>children</div>
      </AuthGuard>
    );

    expect(container.firstChild).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("renders nothing and calls router.replace('/') when requireAuth=false and authenticated", () => {
    mockUseAuth.mockReturnValue({ token: "test-token", isAuthenticated: true });

    const { container } = render(
      <AuthGuard requireAuth={false}>
        <div>children</div>
      </AuthGuard>
    );

    expect(container.firstChild).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("renders children when requireAuth=true and authenticated", () => {
    mockUseAuth.mockReturnValue({ token: "test-token", isAuthenticated: true });

    const { getByText } = render(
      <AuthGuard requireAuth={true}>
        <div>children</div>
      </AuthGuard>
    );

    expect(getByText("children")).toBeDefined();
  });
});
