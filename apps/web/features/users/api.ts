import api from "@/lib/api";
import type { User } from "./types";

export const getCurrentUser = (): Promise<User> =>
  api.get<User>("/users/me").then((r) => r.data);
