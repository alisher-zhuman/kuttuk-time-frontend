import { z } from "zod";

export const CategoriesSchema = z.array(z.string());
