import type { CategorySchema } from "./schemas";

import type { z } from "zod";

export type Category = z.infer<typeof CategorySchema>;
