"use client";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api";
import type { CurrentUser } from "../types";

export const useCurrentUser = (): UseQueryResult<CurrentUser, Error> =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
