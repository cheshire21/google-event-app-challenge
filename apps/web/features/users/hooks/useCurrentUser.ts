import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { getCurrentUser } from "../api";
import type { User } from "../types";

export const useCurrentUser = (): UseQueryResult<User, Error> =>
  useQuery({ queryKey: ["currentUser"], queryFn: getCurrentUser });
