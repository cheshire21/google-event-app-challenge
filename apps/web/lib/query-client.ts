import { QueryClient } from "@tanstack/react-query";

let client: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
        },
      },
    });
  }
  return client;
};
