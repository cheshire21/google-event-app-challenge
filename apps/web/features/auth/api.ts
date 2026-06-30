import api from "@/lib/api";

interface AuthResponse {
  accessToken: string;
}

export const exchangeToken = (auth0AccessToken: string): Promise<AuthResponse> =>
  api.post<AuthResponse>("/auth/exchange", { auth0AccessToken }).then((r) => r.data);

export const postLogout = (): Promise<undefined> =>
  api.post<undefined>("/auth/logout").then(() => undefined);
