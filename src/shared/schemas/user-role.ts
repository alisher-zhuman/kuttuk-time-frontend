import { z } from "zod";

export const UserRoleSchema = z.enum(["user", "merchant", "admin"]);
