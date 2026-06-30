import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAuth0 } from "@auth0/auth0-react";
import { SignInPage } from "./SignInPage";

vi.mock("@auth0/auth0-react");

const mockLoginWithRedirect = vi.fn();
vi.mocked(useAuth0).mockReturnValue({
  loginWithRedirect: mockLoginWithRedirect,
  isAuthenticated: false,
  isLoading: false,
} as unknown as ReturnType<typeof useAuth0>);

describe("SignInPage", () => {
  it("calls loginWithRedirect with google-oauth2 connection on button click", () => {
    const { getByText } = render(<SignInPage />);
    fireEvent.click(getByText(/continue with google/i));
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({
      authorizationParams: { connection: "google-oauth2" },
    });
  });
});
