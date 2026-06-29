import { AxiosHeaders } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import api from "./api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestHandlers = (api.interceptors.request as any).handlers;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseHandlers = (api.interceptors.response as any).handlers;

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe("api", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockLocalStorage);
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  describe("request interceptor", () => {
    it("adds Authorization header when access_token exists in localStorage", async () => {
      mockLocalStorage.getItem.mockReturnValue("test-token");

      const config = { headers: new AxiosHeaders() };
      const result = await requestHandlers[0].fulfilled(config);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("access_token");
      expect(result.headers.Authorization).toBe("Bearer test-token");
    });

    it("does not add Authorization header when no token is present", async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const config = { headers: new AxiosHeaders() };
      const result = await requestHandlers[0].fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe("response interceptor", () => {
    beforeEach(() => {
      vi.stubGlobal("window", { location: { href: "" } });
    });

    it("removes access_token and redirects to /login on 401 response", async () => {
      const error = { response: { status: 401 } };

      await expect(responseHandlers[0].rejected(error)).rejects.toEqual(error);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("access_token");
      expect(window.location.href).toBe("/login");
    });

    it("rejects with the original error for non-401 responses", async () => {
      const error = { response: { status: 500 } };

      await expect(responseHandlers[0].rejected(error)).rejects.toEqual(error);

      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
      expect(window.location.href).toBe("");
    });
  });
});
